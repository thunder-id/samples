// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * self-service/myaccount-react - changing a credential (password) via the Account page's Security tab.
 * See sign-in-out.spec.ts for the rest of the prerequisites.
 *
 * Signs in as a dedicated credential-test user (see credentialTestUser in shared/apps.ts),
 * distinct from the shared TEST_USER_USERNAME every sign-in-out spec uses: TC001 below changes
 * this user's password and changes it back (see the `finally` block), and the suite runs
 * `fullyParallel`, so mutating the shared user's password would race every other
 * concurrently-running spec's login across every app. The two tests in this file are run
 * serially (below) so they don't race each other over their own shared dedicated user either.
 */

import {credentialTestUser, SampleApps, sampleAppUrl} from '../../../shared/apps.ts';
import {expect, test} from '../fixtures.ts';
import {setUserPassword} from '../../../shared/utils/users-api/index.ts';

const appUrl = sampleAppUrl(SampleApps.MYACCOUNT_REACT);
const {username, password} = credentialTestUser(SampleApps.MYACCOUNT_REACT);
// Derived from the real password rather than hardcoded, so this works regardless of what
// policy the schema's password attribute is configured with in a given environment.
const tempPassword = `${password}-Tmp1!`;

test.describe.configure({mode: 'serial'});

test.describe('self-service/myaccount-react - Change credential', () => {
  test.beforeEach(() => setUserPassword(username, password));

  test('TC001: a password change via the Security tab takes effect and can be reverted', async ({myAccountPage}) => {
    await myAccountPage.goto(appUrl);
    await myAccountPage.verifyHomePageLoaded();
    await myAccountPage.clickSignInButton();
    await myAccountPage.verifyLoginPageLoaded();
    await myAccountPage.login(username, password);
    await myAccountPage.verifyLoggedIn();

    await myAccountPage.openSecurityTab();

    try {
      await myAccountPage.changeCredential('Change password', tempPassword);

      // Prove the change landed server-side, not just that the UI collapsed the form: sign
      // out and back in using the new password.
      await myAccountPage.logout();
      await myAccountPage.verifyLoggedOut();

      await myAccountPage.clickSignInButton();
      await myAccountPage.verifyLoginPageLoaded();
      await myAccountPage.login(username, tempPassword);
      await myAccountPage.verifyLoggedIn();

      await myAccountPage.openSecurityTab();
    } finally {
      // Always attempt to restore the shared test user's original password, even if an
      // assertion above failed.
      await myAccountPage.changeCredential('Change password', password);
    }

    // The restore itself also has to have actually worked, or the next test to sign in with
    // the original password would fail.
    await myAccountPage.logout();
    await myAccountPage.verifyLoggedOut();
    await myAccountPage.clickSignInButton();
    await myAccountPage.verifyLoginPageLoaded();
    await myAccountPage.login(username, password);
    await myAccountPage.verifyLoggedIn();
  });

  test('TC002: the submit button stays disabled until the new value and confirmation match', async ({
    myAccountPage,
  }) => {
    await myAccountPage.goto(appUrl);
    await myAccountPage.verifyHomePageLoaded();
    await myAccountPage.clickSignInButton();
    await myAccountPage.verifyLoginPageLoaded();
    await myAccountPage.login(username, password);
    await myAccountPage.verifyLoggedIn();

    await myAccountPage.openSecurityTab();
    await myAccountPage.toggleCredential('Change password');

    expect(await myAccountPage.isCredentialSubmitDisabled()).toBe(true);

    await myAccountPage.fillCredentialFields('mismatch-one', 'mismatch-two');
    expect(await myAccountPage.isCredentialSubmitDisabled()).toBe(true);

    // Collapse without submitting - nothing was written, so there is nothing to restore.
    await myAccountPage.toggleCredential('Change password');
  });
});
