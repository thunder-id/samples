// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * self-service/myaccount-react - sign in through the redirect flow, land on the account page,
 * edit the profile, and sign out. Signs in as the shared test user (shared/apps.ts).
 */

import {SampleApps, sampleAppUrl, testUser} from '../../../shared/apps.ts';
import {ProfileFieldLabels} from '../../../shared/pages/thunderid-web-sample.page.ts';
import {test} from '../fixtures.ts';

const appUrl = sampleAppUrl(SampleApps.MYACCOUNT_REACT);

test.describe('self-service/myaccount-react - Sign in, profile and sign out', () => {
  test.beforeEach(async ({myAccountPage}) => {
    const {password, username} = testUser();
    await myAccountPage.goto(appUrl);
    await myAccountPage.verifyHomePageLoaded();
    await myAccountPage.clickSignInButton();
    await myAccountPage.verifyLoginPageLoaded();
    await myAccountPage.login(username, password);
    await myAccountPage.verifyLoggedIn();
  });

  test('TC001: a signed-in user lands on the account page', async ({myAccountPage}) => {
    await myAccountPage.verifyAccountHome();
  });

  test('TC002: signs out after a successful sign-in', async ({myAccountPage}) => {
    await myAccountPage.logout();
    await myAccountPage.verifyLoggedOut();
  });

  test('TC003: profile changes made on the Personal info tab are saved', async ({myAccountPage}) => {
    await myAccountPage.openManageProfile();
    await myAccountPage.editProfileField(ProfileFieldLabels.givenName, 'Account');
    await myAccountPage.editProfileField(ProfileFieldLabels.familyName, 'Edited');

    await myAccountPage.verifyProfileFieldValue(ProfileFieldLabels.givenName, 'Account');
    await myAccountPage.verifyProfileFieldValue(ProfileFieldLabels.familyName, 'Edited');
  });
});
