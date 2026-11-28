// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * b2b/wayfinder-enterprise-nextjs - a company registers, its first admin lands in the admin
 * workspace, reads the company's team through the app's company-scoped management proxy
 * (/api/admin), and signs out. Every run registers a new company; it stays on the server.
 *
 * Needs the sample's defaultResourceServer server config (its tokens carry the Wayfinder
 * permissions only through it), so it cannot run with E2E_SKIP_SERVER_CONFIGS=true.
 */

import {SampleApps, sampleAppUrl} from '../../../shared/apps.ts';
import {Timeouts} from '../../../shared/constants/timeouts.ts';
import {type Company, newCompany} from '../../../shared/pages/b2b-gate.page.ts';
import {expect, test} from '../fixtures.ts';
import {ADMIN_PAGES} from '../pages/wayfinder.page.ts';

const appUrl = sampleAppUrl(SampleApps.WAYFINDER_ENTERPRISE_NEXTJS);

test.describe('b2b/wayfinder-enterprise-nextjs - Company workspace', () => {
  let company: Company;

  test.beforeEach(async ({wayfinderPage}) => {
    company = newCompany('wayfinder');
    await wayfinderPage.goto(appUrl);
    await wayfinderPage.clickSignInButton();
    await wayfinderPage.registerCompany(company);
    await wayfinderPage.verifyAdminWorkspace(company.name);
  });

  test('TC001: the first admin of a new company gets every admin page', async ({wayfinderPage}) => {
    for (const label of ADMIN_PAGES) {
      await expect(wayfinderPage.sidebarLink(label)).toBeVisible();
    }
  });

  test('TC002: Team and roles lists the company admin through the management proxy', async ({page, wayfinderPage}) => {
    await wayfinderPage.sidebarLink('Team and roles').click();
    await expect(page).toHaveURL(/\/workspace\/team/);
    await expect(page.getByText(company.username).first()).toBeVisible({timeout: Timeouts.REDIRECT});
  });

  test('TC003: signs out of the workspace', async ({wayfinderPage}) => {
    await wayfinderPage.logout();
    await wayfinderPage.goto(appUrl);
    await wayfinderPage.verifyLoggedOut();
  });
});
