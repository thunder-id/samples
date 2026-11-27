// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * patterns/bff-react-express - sign-in through the Express BFF, which keeps the tokens on the
 * server behind an HttpOnly session cookie. Checks the session the BFF reports, an API call
 * through its proxy, the access token it exposes for the Token debug page, and sign-out.
 *
 * The BFF answers browser SDK calls only with `X-Requested-With: XMLHttpRequest`, so the direct
 * requests below send it, and share the page's cookies through `page.request`.
 */

import type {APIRequestContext} from '@playwright/test';
import {SampleApps, sampleAppUrl, testUser} from '../../../shared/apps.ts';
import {decodeJwtPayload} from '../../../shared/utils/jwt/index.ts';
import {expect, test} from '../fixtures.ts';

const appUrl = sampleAppUrl(SampleApps.BFF_REACT_EXPRESS);
const XHR = {'X-Requested-With': 'XMLHttpRequest'};

function getSession(request: APIRequestContext) {
  return request.get(`${appUrl}/api/auth/session`, {headers: XHR});
}

test.describe('patterns/bff-react-express - BFF session', () => {
  test.beforeEach(async ({bffPage}) => {
    const {password, username} = testUser();
    await bffPage.goto(appUrl);
    await bffPage.verifyHomePageLoaded();
    await bffPage.clickSignInButton();
    await bffPage.verifyLoginPageLoaded();
    await bffPage.login(username, password);
    await bffPage.verifyLoggedIn();
  });

  test('TC001: the BFF reports the signed-in session, without handing the browser a token', async ({page}) => {
    const response = await getSession(page.request);
    expect(response.status()).toBe(200);
    const session = (await response.json()) as {isSignedIn: boolean; user?: Record<string, unknown>};
    expect(session.isSignedIn).toBe(true);
    expect(session.user?.sub).toBeTruthy();

    // The session cookie is HttpOnly, so page scripts cannot read it.
    const cookies = await page.context().cookies(appUrl);
    const sessionCookie = cookies.find((cookie) => cookie.name === 'thunderid-session');
    expect(sessionCookie?.httpOnly).toBe(true);
    expect(await page.evaluate(() => document.cookie)).not.toContain('thunderid-session');
  });

  test('TC002: an API call through /api/auth/proxy carries the access token', async ({page}) => {
    const response = await page.request.get(`${appUrl}/api/auth/proxy/users/me`, {headers: XHR});
    expect(response.status()).toBe(200);
    const me = (await response.json()) as {attributes?: Record<string, unknown>};
    expect(me.attributes?.username).toBe(testUser().username);
  });

  test('TC003: the Token debug page shows the access token the BFF exposes', async ({bffPage}) => {
    await bffPage.openTokenDebug();
    await bffPage.verifyTokenDebugLoaded();
    const payload = decodeJwtPayload(await bffPage.getDisplayedAccessToken());
    expect(payload.sub).toBeTruthy();
    expect(payload.exp as number).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  test('TC004: signing out ends the BFF session', async ({bffPage, page}) => {
    await bffPage.logout();
    await bffPage.verifyLoggedOut();

    const session = (await (await getSession(page.request)).json()) as {isSignedIn: boolean};
    expect(session.isSignedIn).toBe(false);
    const proxied = await page.request.get(`${appUrl}/api/auth/proxy/users/me`, {headers: XHR});
    expect(proxied.status()).toBe(401);
  });
});

test.describe('patterns/bff-react-express - BFF request checks', () => {
  test('TC005: refuses a browser SDK endpoint without X-Requested-With', async ({request}) => {
    const response = await request.get(`${appUrl}/api/auth/session`);
    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });

  test('TC006: the proxy answers 401 without a session', async ({request}) => {
    const response = await request.get(`${appUrl}/api/auth/proxy/users/me`, {headers: XHR});
    expect(response.status()).toBe(401);
  });
});
