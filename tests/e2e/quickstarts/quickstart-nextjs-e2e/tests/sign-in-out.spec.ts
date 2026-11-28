// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * nextjs/quickstart - sign in and sign out via the redirect flow. Run in redirect mode for this
 * suite (NEXT_PUBLIC_THUNDERID_CLIENT_ID set) rather than its native default, see
 * playwright.config.ts. See quickstart-react-e2e/tests/sign-in-out.spec.ts for the rest of the prerequisites.
 */

import {SampleApps, sampleAppUrl} from '../../../shared/apps.ts';
import {expect, test} from '../fixtures.ts';
import {ProfileFieldLabels} from '../../../shared/pages/thunderid-web-sample.page.ts';
import {decodeJwtPayload} from '../../../shared/utils/jwt/index.ts';

const appUrl = sampleAppUrl(SampleApps.NEXTJS);
const username = process.env.TEST_USER_USERNAME!;
const password = process.env.TEST_USER_PASSWORD!;

test.describe('nextjs/quickstart - Sign in and Sign out', () => {
  test('TC001: signs in with valid credentials', async ({nextjsQuickstartPage}) => {
    await nextjsQuickstartPage.goto(appUrl);
    await nextjsQuickstartPage.verifyHomePageLoaded();

    await nextjsQuickstartPage.clickSignInButton();
    await nextjsQuickstartPage.verifyLoginPageLoaded();

    await nextjsQuickstartPage.login(username, password);
    await nextjsQuickstartPage.verifyLoggedIn();
  });

  test('TC002: signs out after a successful sign-in', async ({nextjsQuickstartPage}) => {
    await nextjsQuickstartPage.goto(appUrl);
    await nextjsQuickstartPage.verifyHomePageLoaded();
    await nextjsQuickstartPage.clickSignInButton();
    await nextjsQuickstartPage.verifyLoginPageLoaded();
    await nextjsQuickstartPage.login(username, password);
    await nextjsQuickstartPage.verifyLoggedIn();

    await nextjsQuickstartPage.logout();
    await nextjsQuickstartPage.verifyLoggedOut();
  });

  test('TC003: token debug page displays a valid access token', async ({nextjsQuickstartPage}) => {
    await nextjsQuickstartPage.goto(appUrl);
    await nextjsQuickstartPage.verifyHomePageLoaded();
    await nextjsQuickstartPage.clickSignInButton();
    await nextjsQuickstartPage.verifyLoginPageLoaded();
    await nextjsQuickstartPage.login(username, password);
    await nextjsQuickstartPage.verifyLoggedIn();

    await nextjsQuickstartPage.openTokenDebug();
    await nextjsQuickstartPage.verifyTokenDebugLoaded();

    const token = await nextjsQuickstartPage.getDisplayedAccessToken();
    expect(token.split('.')).toHaveLength(3);

    const payload = decodeJwtPayload(token);
    expect(payload.sub).toBeTruthy();
    expect(payload.exp as number).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  test('TC004: profile changes made via Manage Profile are reflected', async ({nextjsQuickstartPage}) => {
    await nextjsQuickstartPage.goto(appUrl);
    await nextjsQuickstartPage.verifyHomePageLoaded();
    await nextjsQuickstartPage.clickSignInButton();
    await nextjsQuickstartPage.verifyLoginPageLoaded();
    await nextjsQuickstartPage.login(username, password);
    await nextjsQuickstartPage.verifyLoggedIn();

    await nextjsQuickstartPage.openManageProfile();
    await nextjsQuickstartPage.editProfileField(ProfileFieldLabels.givenName, 'Profile');
    await nextjsQuickstartPage.editProfileField(ProfileFieldLabels.familyName, 'Updated');

    await nextjsQuickstartPage.verifyProfileFieldValue(ProfileFieldLabels.givenName, 'Profile');
    await nextjsQuickstartPage.verifyProfileFieldValue(ProfileFieldLabels.familyName, 'Updated');
  });
});
