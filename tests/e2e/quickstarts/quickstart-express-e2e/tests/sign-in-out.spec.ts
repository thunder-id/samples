// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * express/quickstart - sign in and sign out via the redirect flow (server-rendered + cookie
 * session, no client SDK). See quickstart-react-e2e/tests/sign-in-out.spec.ts for the rest of the
 * prerequisites.
 */

import {SampleApps, sampleAppUrl} from '../../../shared/apps.ts';
import {expect, test} from '../fixtures.ts';
import {decodeJwtPayload} from '../../../shared/utils/jwt/index.ts';

const appUrl = sampleAppUrl(SampleApps.EXPRESS);
const username = process.env.TEST_USER_USERNAME!;
const password = process.env.TEST_USER_PASSWORD!;

test.describe('express/quickstart - Sign in and Sign out', () => {
  test('TC001: signs in with valid credentials', async ({expressQuickstartPage}) => {
    await expressQuickstartPage.goto(appUrl);
    await expressQuickstartPage.verifyHomePageLoaded();

    await expressQuickstartPage.clickSignInButton();
    await expressQuickstartPage.verifyLoginPageLoaded();

    await expressQuickstartPage.login(username, password);
    await expressQuickstartPage.verifyLoggedIn();
  });

  test('TC002: signs out after a successful sign-in', async ({expressQuickstartPage}) => {
    await expressQuickstartPage.goto(appUrl);
    await expressQuickstartPage.verifyHomePageLoaded();
    await expressQuickstartPage.clickSignInButton();
    await expressQuickstartPage.verifyLoginPageLoaded();
    await expressQuickstartPage.login(username, password);
    await expressQuickstartPage.verifyLoggedIn();

    await expressQuickstartPage.logout();
    await expressQuickstartPage.verifyLoggedOut();
  });

  test('TC003: token debug page displays a valid access token', async ({expressQuickstartPage}) => {
    await expressQuickstartPage.goto(appUrl);
    await expressQuickstartPage.verifyHomePageLoaded();
    await expressQuickstartPage.clickSignInButton();
    await expressQuickstartPage.verifyLoginPageLoaded();
    await expressQuickstartPage.login(username, password);
    await expressQuickstartPage.verifyLoggedIn();

    await expressQuickstartPage.openTokenDebug();
    await expressQuickstartPage.verifyTokenDebugLoaded();

    const token = await expressQuickstartPage.getDisplayedAccessToken();
    expect(token.split('.')).toHaveLength(3);

    const payload = decodeJwtPayload(token);
    expect(payload.sub).toBeTruthy();
    expect(payload.exp as number).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  // No TC004 (profile management) here: express/quickstart's user menu only has "Token debug" and
  // "Sign out" (see lib/layout.mjs) - no profile UI at all.
});
