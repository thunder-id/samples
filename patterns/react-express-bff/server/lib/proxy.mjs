import express from 'express';

/** Request headers passed on to the API. Cookies and the CSRF header stay at the BFF. */
const FORWARDED_REQUEST_HEADERS = ['accept', 'accept-language', 'content-type', 'if-match', 'if-none-match'];

/** Response headers passed back to the browser. */
const FORWARDED_RESPONSE_HEADERS = ['content-type', 'etag', 'last-modified', 'location', 'www-authenticate'];

/**
 * API paths the proxy forwards without a session or a token. The React SDK reads the sign-in UI's
 * translations and branding from `/flow/meta` before anyone signs in, with a plain `fetch` that
 * sends no `X-Requested-With` header. The endpoint is public and read only.
 */
const PUBLIC_PATHS = ['/flow/meta'];

/**
 * Forwards a GET to one of the public paths without a token. Mount it ahead of the CSRF check.
 */
export function createPublicProxy({apiBaseUrl}) {
  return (req, res, next) => {
    if (req.method !== 'GET' || !PUBLIC_PATHS.includes(req.path)) {
      next();
      return;
    }
    void forward(req, res, `${apiBaseUrl}${req.url}`, {});
  };
}

/** Sends the request on to the API and the API's answer back to the browser. */
async function forward(req, res, target, headers) {
  FORWARDED_REQUEST_HEADERS.forEach((name) => {
    const value = req.get(name);
    if (value) headers[name] = value;
  });

  const hasBody = !['GET', 'HEAD'].includes(req.method) && Buffer.isBuffer(req.body) && req.body.length > 0;

  let upstream;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body: hasBody ? req.body : undefined,
      redirect: 'manual',
    });
  } catch (error) {
    console.error(`Could not reach the API at ${new URL(target).origin}.`, error);
    res.status(502).json({error: 'bad_gateway'});
    return;
  }

  res.status(upstream.status);
  FORWARDED_RESPONSE_HEADERS.forEach((name) => {
    const value = upstream.headers.get(name);
    if (value) res.set(name, value);
  });
  res.send(Buffer.from(await upstream.arrayBuffer()));
}

/**
 * The BFF's API proxy. A request to `<mount>/<path>` is sent to `<apiBaseUrl>/<path>` with the
 * session's access token as `Authorization: Bearer`, and the API's answer is sent back as it is.
 * The browser never sees the token.
 *
 * A `401` from the API is passed through unchanged. The browser SDK treats it as the API's answer,
 * and only the BFF's own `401 login_required` signs the app out.
 */
export function createProxy({apiBaseUrl, requireSession}) {
  const router = express.Router();

  router.use(express.raw({type: () => true, limit: '1mb'}), async (req, res) => {
    const sessionId = await requireSession(req, res);
    if (!sessionId) return;

    // `new URL` resolves any `..` in the path, so check the result is still under the API.
    const target = new URL(`${apiBaseUrl}${req.url}`);
    if (target.href !== apiBaseUrl && !target.href.startsWith(`${apiBaseUrl}/`) && !target.href.startsWith(`${apiBaseUrl}?`)) {
      res.status(400).json({error: 'invalid_path'});
      return;
    }

    await forward(req, res, target.href, {
      authorization: `Bearer ${await req.thunderIDAuth.getAccessToken(sessionId)}`,
    });
  });

  return router;
}
