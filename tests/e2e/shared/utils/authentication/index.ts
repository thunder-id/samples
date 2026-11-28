// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Admin token for the suites' own API calls (config import, test users), not the sign-in under
 * test, which each page object drives through the real UI.
 *
 * Uses ADMIN_TOKEN when set. Otherwise mints one through the CONSOLE application, the same
 * sequence as `mint_admin_token` in shared/scripts/thunderid.sh: authorize -> flow/execute (SSO
 * check) -> flow/execute (credentials) -> oauth2/auth/callback -> oauth2/token.
 */

import {createHash, randomBytes} from 'node:crypto';
import {insecureDispatcher} from '../api-request/dispatcher.ts';

const CONSOLE_CLIENT_ID = 'CONSOLE';

function base64url(input: Buffer): string {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

let tokenPromise: Promise<string> | undefined;

/** One admin token per process, memoized. */
export function getAdminToken(): Promise<string> {
  // One retry: the server can refuse a code exchange that races another one (SQLITE_BUSY).
  tokenPromise ??= mintAdminToken()
    .catch(() => mintAdminToken())
    .catch((error: unknown) => {
      tokenPromise = undefined;
      throw error;
    });
  return tokenPromise;
}

async function mintAdminToken(): Promise<string> {
  if (process.env.ADMIN_TOKEN) {
    return process.env.ADMIN_TOKEN;
  }

  const serverUrl = process.env.SERVER_URL ?? 'https://localhost:8090';
  const adminUsername = process.env.ADMIN_USERNAME ?? 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin';
  const redirectUri = `${serverUrl}/console`;

  const codeVerifier = base64url(randomBytes(32)).slice(0, 43);
  const codeChallenge = base64url(createHash('sha256').update(codeVerifier).digest());
  const dispatcher = await insecureDispatcher();

  const authorizeUrl = new URL(`${serverUrl}/oauth2/authorize`);
  authorizeUrl.searchParams.set('client_id', CONSOLE_CLIENT_ID);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('scope', 'system');
  authorizeUrl.searchParams.set('resource', `${serverUrl}/mcp`);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('code_challenge', codeChallenge);
  authorizeUrl.searchParams.set('code_challenge_method', 'S256');

  const authorizeRes = await fetch(authorizeUrl, {dispatcher, redirect: 'manual'} as RequestInit);
  const location = authorizeRes.headers.get('location');
  if (!location) {
    throw new Error(`No Location header from ${authorizeUrl.pathname}: HTTP ${authorizeRes.status}`);
  }
  const locationUrl = new URL(location, serverUrl);
  const authId = locationUrl.searchParams.get('authId');
  const executionId = locationUrl.searchParams.get('executionId');
  if (!authId || !executionId) {
    throw new Error(`Failed to parse authId/executionId from authorize redirect: ${location}`);
  }

  const post = async (path: string, body: unknown): Promise<Record<string, unknown>> => {
    const res = await fetch(`${serverUrl}${path}`, {
      body: JSON.stringify(body),
      dispatcher,
      headers: {'Content-Type': 'application/json'},
      method: 'POST',
    } as RequestInit);
    return (await res.json()) as Record<string, unknown>;
  };

  // The first execute advances past the SSO check to the credentials prompt and mints a
  // challenge token.
  const prompt = await post('/flow/execute', {executionId});
  if (!prompt.challengeToken) {
    throw new Error(`Flow execution did not return a challenge token: ${JSON.stringify(prompt)}`);
  }

  const creds = await post('/flow/execute', {
    action: 'action_001',
    challengeToken: prompt.challengeToken,
    executionId,
    inputs: {password: adminPassword, username: adminUsername},
  });
  if (!creds.assertion) {
    throw new Error(`Admin authentication failed: ${JSON.stringify(creds)}`);
  }

  const callback = await post('/oauth2/auth/callback', {assertion: creds.assertion, authId});
  const authCode =
    typeof callback.redirect_uri === 'string' ? new URL(callback.redirect_uri).searchParams.get('code') : null;
  if (!authCode) {
    throw new Error(`OAuth2 callback did not return an authorization code: ${JSON.stringify(callback)}`);
  }

  const tokenRes = await fetch(`${serverUrl}/oauth2/token`, {
    body: new URLSearchParams({
      client_id: CONSOLE_CLIENT_ID,
      code: authCode,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      resource: `${serverUrl}/mcp`,
    }),
    dispatcher,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    method: 'POST',
  } as RequestInit);
  const tokenData = (await tokenRes.json()) as {access_token?: string};
  if (!tokenData.access_token) {
    throw new Error(`Failed to obtain admin access token: ${JSON.stringify(tokenData)}`);
  }

  return tokenData.access_token;
}
