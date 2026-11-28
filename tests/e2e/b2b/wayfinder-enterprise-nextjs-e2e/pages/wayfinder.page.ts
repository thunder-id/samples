// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * b2b/wayfinder-enterprise-nextjs Page Object: the landing page's "Get started", and the workspace
 * shell (src/components/WorkspaceShell.tsx), which gives an admin a sidebar of admin pages and a
 * member the booking page only.
 */

import {type Locator, expect} from '@playwright/test';
import {Timeouts} from '../../../shared/constants/timeouts.ts';
import {B2BGatePage} from '../../../shared/pages/b2b-gate.page.ts';

export const ADMIN_PAGES = ['Flight booking', 'Travel policy', 'Team and roles', 'Enterprise SSO'];

export class WayfinderPage extends B2BGatePage {
  async goto(url: string): Promise<void> {
    // Server-rendered: wait for hydration, or the first click is lost.
    await this.page.goto(url, {waitUntil: 'networkidle'});
  }

  async clickSignInButton(): Promise<void> {
    await this.page.getByRole('button', {name: 'Get started'}).first().click();
  }

  sidebarLink(label: string): Locator {
    return this.page.locator('aside').getByRole('link', {name: label});
  }

  async verifyAdminWorkspace(companyName: string): Promise<void> {
    await expect(this.sidebarLink('Flight booking')).toBeVisible({timeout: Timeouts.REDIRECT});
    await expect(this.page.getByText(companyName).first()).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', {exact: true, name: 'Sign out'}).click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLoggedOut(): Promise<void> {
    await expect(this.page.getByRole('button', {name: 'Get started'}).first()).toBeVisible({
      timeout: Timeouts.REDIRECT,
    });
  }
}
