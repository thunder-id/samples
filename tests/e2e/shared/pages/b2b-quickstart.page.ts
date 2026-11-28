// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * B2B Quickstart Page Object, for quickstarts/quickstart-react-b2b and quickstarts/quickstart-nextjs-b2b,
 * which render the same page: the hero's sign-in, the workspace that names the company the session
 * signed in to, the access token claims it lists, and the header's `OrganizationUnitSwitcher`.
 */

import {expect} from '@playwright/test';
import {Timeouts} from '../constants/timeouts.ts';
import {B2BGatePage} from './b2b-gate.page.ts';

export class B2BQuickstartPage extends B2BGatePage {
  async goto(url: string): Promise<void> {
    // The Next.js sample renders on the server: wait for hydration, or the first click is lost.
    await this.page.goto(url, {waitUntil: 'networkidle'});
  }

  async clickSignInButton(): Promise<void> {
    await this.page.getByRole('button', {name: 'Sign in or register a company'}).click();
  }

  async verifySignedInTo(companyName: string): Promise<void> {
    await expect(this.page.getByText(`Signed in to ${companyName}`)).toBeVisible({timeout: Timeouts.REDIRECT});
  }

  /** The value of one claim in the "Access token" section. */
  async claim(name: string): Promise<string> {
    const value = this.page
      .locator('dl.claims dt', {hasText: new RegExp(`^${name}$`)})
      .locator('xpath=following-sibling::dd[1]');
    await value.waitFor({state: 'visible', timeout: Timeouts.ELEMENT_VISIBILITY});
    return (await value.innerText()).trim();
  }

  /** Switches the session to another company with the nav's organization unit switcher. */
  async switchTo(currentName: string, targetName: string): Promise<void> {
    await this.page.locator('nav, header').getByRole('button', {name: currentName}).first().click();
    await this.page
      .getByRole('menuitem', {name: targetName})
      .or(this.page.getByRole('option', {name: targetName}))
      .or(this.page.getByRole('button', {name: targetName}))
      .first()
      .click();
  }

  async logout(): Promise<void> {
    await this.page.locator('nav, header').getByRole('button', {exact: true, name: 'Sign out'}).click();
    await this.confirmSignOutIfPrompted();
  }

  async verifyLoggedOut(): Promise<void> {
    await expect(this.page.getByRole('button', {name: 'Sign in or register a company'})).toBeVisible({
      timeout: Timeouts.REDIRECT,
    });
  }
}
