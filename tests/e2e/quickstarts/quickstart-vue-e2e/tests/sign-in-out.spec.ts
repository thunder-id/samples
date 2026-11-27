// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * vue/quickstart - sign in and sign out via the redirect flow. See
 * quickstart-react-e2e/tests/sign-in-out.spec.ts for prerequisites; identical shape, different app.
 */

import {SampleApps, sampleAppUrl} from '../../../shared/apps.ts';
import {expect, test} from '../fixtures.ts';
import {ProfileFieldLabels} from '../../../shared/pages/thunderid-web-sample.page.ts';
import {decodeJwtPayload} from '../../../shared/utils/jwt/index.ts';

const appUrl = sampleAppUrl(SampleApps.VUE);
const username = process.env.TEST_USER_USERNAME!;
const password = process.env.TEST_USER_PASSWORD!;

test.describe('vue/quickstart - Sign in and Sign out', () => {
  test('TC001: signs in with valid credentials', async ({vueQuickstartPage}) => {
    await vueQuickstartPage.goto(appUrl);
    await vueQuickstartPage.verifyHomePageLoaded();

    await vueQuickstartPage.clickSignInButton();
    await vueQuickstartPage.verifyLoginPageLoaded();

    await vueQuickstartPage.login(username, password);
    await vueQuickstartPage.verifyLoggedIn();
  });

  test('TC002: signs out after a successful sign-in', async ({vueQuickstartPage}) => {
    await vueQuickstartPage.goto(appUrl);
    await vueQuickstartPage.verifyHomePageLoaded();
    await vueQuickstartPage.clickSignInButton();
    await vueQuickstartPage.verifyLoginPageLoaded();
    await vueQuickstartPage.login(username, password);
    await vueQuickstartPage.verifyLoggedIn();

    await vueQuickstartPage.logout();
    await vueQuickstartPage.verifyLoggedOut();
  });

  test('TC003: token debug page displays a valid access token', async ({vueQuickstartPage}) => {
    await vueQuickstartPage.goto(appUrl);
    await vueQuickstartPage.verifyHomePageLoaded();
    await vueQuickstartPage.clickSignInButton();
    await vueQuickstartPage.verifyLoginPageLoaded();
    await vueQuickstartPage.login(username, password);
    await vueQuickstartPage.verifyLoggedIn();

    await vueQuickstartPage.openTokenDebug();
    await vueQuickstartPage.verifyTokenDebugLoaded();

    const token = await vueQuickstartPage.getDisplayedAccessToken();
    expect(token.split('.')).toHaveLength(3);

    const payload = decodeJwtPayload(token);
    expect(payload.sub).toBeTruthy();
    expect(payload.exp as number).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  test('TC004: profile changes made via Manage Profile are reflected', async ({vueQuickstartPage}) => {
    await vueQuickstartPage.goto(appUrl);
    await vueQuickstartPage.verifyHomePageLoaded();
    await vueQuickstartPage.clickSignInButton();
    await vueQuickstartPage.verifyLoginPageLoaded();
    await vueQuickstartPage.login(username, password);
    await vueQuickstartPage.verifyLoggedIn();

    await vueQuickstartPage.openManageProfile();
    await vueQuickstartPage.editProfileField(ProfileFieldLabels.givenName, 'Profile');
    await vueQuickstartPage.editProfileField(ProfileFieldLabels.familyName, 'Updated');

    await vueQuickstartPage.verifyProfileFieldValue(ProfileFieldLabels.givenName, 'Profile');
    await vueQuickstartPage.verifyProfileFieldValue(ProfileFieldLabels.familyName, 'Updated');
  });
});
