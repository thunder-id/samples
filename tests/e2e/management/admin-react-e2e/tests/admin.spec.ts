// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * management/admin-react - an administrator signs in and reads the server's users through the
 * SDK's management components. Signs in as the server's administrator (ADMIN_USERNAME and
 * ADMIN_PASSWORD), whose token carries the `system` permission the management API requires.
 */

import {SampleApps, sampleAppUrl, testUser} from '../../../shared/apps.ts';
import {Timeouts} from '../../../shared/constants/timeouts.ts';
import {expect, test} from '../fixtures.ts';

const appUrl = sampleAppUrl(SampleApps.ADMIN_REACT);

test.describe('management/admin-react - Administration', () => {
  test.beforeEach(async ({adminPage}) => {
    await adminPage.goto(appUrl);
    await adminPage.verifyHomePageLoaded();
    await adminPage.clickSignInButton();
    await adminPage.verifyLoginPageLoaded();
    await adminPage.login(process.env.ADMIN_USERNAME!, process.env.ADMIN_PASSWORD!);
    await adminPage.verifyLoggedIn();
  });

  test('TC001: an administrator signs in and gets the management sections', async ({adminPage}) => {
    await adminPage.verifySidebarLoaded();
    for (const section of ['Users', 'Groups', 'Roles', 'Applications', 'Organization units']) {
      await expect(adminPage.sidebarLink(section)).toBeVisible();
    }
  });

  test('TC002: the Users page lists and finds the test user', async ({adminPage, page}) => {
    const {username} = testUser();
    await adminPage.openSection('Users');

    const search = page
      .getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .first();
    await search.fill(username);
    await expect(page.getByText(username, {exact: true}).first()).toBeVisible({timeout: Timeouts.ELEMENT_VISIBILITY});
  });

  test('TC003: opening a user shows their details', async ({adminPage, page}) => {
    const {username} = testUser();
    await adminPage.openSection('Users');
    await page
      .getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .first()
      .fill(username);
    await page.getByText(username, {exact: true}).first().click();

    await expect(page).toHaveURL(/\/users\/[^/]+$/, {timeout: Timeouts.ELEMENT_VISIBILITY});
    await expect(page.getByText(username).first()).toBeVisible({timeout: Timeouts.ELEMENT_VISIBILITY});
  });

  test('TC004: the Groups and Roles pages load from the management API', async ({adminPage, page}) => {
    for (const section of ['Groups', 'Roles']) {
      await adminPage.openSection(section);
      // An SDK list shows an alert when the management API turns the request down.
      await expect(page.getByRole('alert')).toHaveCount(0);
    }
  });

  test('TC005: signs out after a successful sign-in', async ({adminPage}) => {
    await adminPage.logout();
    await adminPage.verifyLoggedOut();
  });
});
