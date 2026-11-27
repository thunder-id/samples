// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Gate Login Page Object
 *
 * The OAuth authorization_code redirect flow always lands on ThunderID's shared "gate" app,
 * which renders the login form and sign-out confirmation dynamically from the client
 * application's auth flow. That DOM is identical regardless of which sample app (browser, react,
 * vue, nextjs, nuxt, express) initiated the redirect, so the methods here are shared across every
 * sample-app page object rather than duplicated per app. Only each app's own home-page chrome
 * (its sign-in button, its post-login landing content) is app-specific and lives in the subclass.
 *
 * Modeled on thunder-id/thunderid tests/e2e/pages/gate-login.page.ts. Same gate, same DOM.
 */

import {Page, expect} from '@playwright/test';
import {BasePage} from './base.page.ts';
import {Timeouts} from '../constants/timeouts.ts';

export class GateLoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async verifyLoginPageLoaded(): Promise<void> {
    await this.page.waitForSelector('input[name="username"], input[placeholder*="username" i]', {
      state: 'visible',
      timeout: Timeouts.ELEMENT_VISIBILITY,
    });
  }

  async fillLoginForm(username: string, password: string): Promise<void> {
    const usernameInput = this.page.locator('input[name="username"], input[placeholder*="username" i]').first();
    await usernameInput.waitFor({state: 'visible', timeout: Timeouts.DEFAULT_ACTION});
    await usernameInput.fill(username);

    const passwordInput = this.page.locator('input[name="password"], input[placeholder*="password" i]').first();
    await passwordInput.waitFor({state: 'visible', timeout: Timeouts.DEFAULT_ACTION});
    await passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    const loginButton = this.page
      .locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Sign in")')
      .first();
    await loginButton.waitFor({state: 'visible', timeout: Timeouts.DEFAULT_ACTION});
    await loginButton.click();
  }

  /** Callers verify the result with their own signed-in check, so no wait beyond the click. */
  async login(username: string, password: string): Promise<void> {
    await this.fillLoginForm(username, password);
    await this.clickLogin();
  }

  /**
   * Click through the gate's sign-out confirmation, if the app's sign-out button doesn't already
   * complete RP-initiated logout in one step. Callers verify the result themselves.
   */
  async confirmSignOutIfPrompted(): Promise<void> {
    const confirmButton = this.page.getByRole('button', {exact: true, name: 'Sign out'});
    const shown = await confirmButton
      .waitFor({state: 'visible', timeout: Timeouts.DEFAULT_ACTION})
      .then(() => true)
      .catch(() => false);
    if (shown) {
      await confirmButton.click();
    }
  }
}

export {expect};
