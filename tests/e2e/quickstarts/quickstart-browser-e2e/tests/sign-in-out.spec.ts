// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * browser/quickstart - sign in and sign out via the redirect flow (vanilla JS + @thunderid/browser).
 * See quickstart-react-e2e/tests/sign-in-out.spec.ts for the rest of the prerequisites.
 */

import {SampleApps, sampleAppUrl} from '../../../shared/apps.ts';
import {expect, test} from '../fixtures.ts';
import {ProfileFieldKeys} from '../pages/browser-quickstart.page.ts';
import {decodeJwtPayload} from '../../../shared/utils/jwt/index.ts';

const appUrl = sampleAppUrl(SampleApps.BROWSER);
const username = process.env.TEST_USER_USERNAME!;
const password = process.env.TEST_USER_PASSWORD!;

test.describe('browser/quickstart - Sign in and Sign out', () => {
  test('TC001: signs in with valid credentials', async ({browserQuickstartPage}) => {
    await browserQuickstartPage.goto(appUrl);
    await browserQuickstartPage.verifyHomePageLoaded();

    await browserQuickstartPage.clickSignInButton();
    await browserQuickstartPage.verifyLoginPageLoaded();

    await browserQuickstartPage.login(username, password);
    await browserQuickstartPage.verifyLoggedIn();
  });

  test('TC002: signs out after a successful sign-in', async ({browserQuickstartPage}) => {
    await browserQuickstartPage.goto(appUrl);
    await browserQuickstartPage.verifyHomePageLoaded();
    await browserQuickstartPage.clickSignInButton();
    await browserQuickstartPage.verifyLoginPageLoaded();
    await browserQuickstartPage.login(username, password);
    await browserQuickstartPage.verifyLoggedIn();

    await browserQuickstartPage.logout();
    await browserQuickstartPage.verifyLoggedOut();
  });

  test('TC003: token debug page displays a valid access token', async ({browserQuickstartPage}) => {
    await browserQuickstartPage.goto(appUrl);
    await browserQuickstartPage.verifyHomePageLoaded();
    await browserQuickstartPage.clickSignInButton();
    await browserQuickstartPage.verifyLoginPageLoaded();
    await browserQuickstartPage.login(username, password);
    await browserQuickstartPage.verifyLoggedIn();

    await browserQuickstartPage.openTokenDebug();
    await browserQuickstartPage.verifyTokenDebugLoaded();

    const token = await browserQuickstartPage.getDisplayedAccessToken();
    expect(token.split('.')).toHaveLength(3);

    const payload = decodeJwtPayload(token);
    expect(payload.sub).toBeTruthy();
    expect(payload.exp as number).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  test('TC004: profile changes made via Manage Profile are reflected', async ({browserQuickstartPage}) => {
    await browserQuickstartPage.goto(appUrl);
    await browserQuickstartPage.verifyHomePageLoaded();
    await browserQuickstartPage.clickSignInButton();
    await browserQuickstartPage.verifyLoginPageLoaded();
    await browserQuickstartPage.login(username, password);
    await browserQuickstartPage.verifyLoggedIn();

    await browserQuickstartPage.openManageProfile();
    await browserQuickstartPage.editProfileField(ProfileFieldKeys.givenName, 'Profile');
    await browserQuickstartPage.editProfileField(ProfileFieldKeys.familyName, 'Updated');

    await browserQuickstartPage.verifyProfileFieldValue(ProfileFieldKeys.givenName, 'Profile');
    await browserQuickstartPage.verifyProfileFieldValue(ProfileFieldKeys.familyName, 'Updated');

    await browserQuickstartPage.closeManageProfile();
    await browserQuickstartPage.verifyDisplayedName('Profile Updated');
  });
});
