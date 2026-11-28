// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * integrations/better-auth-nextjs Page Object. Better Auth runs the OAuth flow against ThunderID
 * through its generic OAuth plugin and the `thunderid()` helper; the app shows the Better Auth
 * session it gets back. See app/page.tsx and app/components/Nav.tsx in the sample.
 */

import {expect} from '@playwright/test';
import {Timeouts} from '../../../shared/constants/timeouts.ts';
import {GateLoginPage} from '../../../shared/pages/gate-login.page.ts';

export class BetterAuthPage extends GateLoginPage {
  async goto(url: string): Promise<void> {
    // Server-rendered: wait for hydration, or the first click is a no-op.
    await this.page.goto(url, {waitUntil: 'networkidle'});
  }

  async verifyHomePageLoaded(): Promise<void> {
    await expect(this.page.getByRole('button', {name: 'Sign in with ThunderID'})).toBeVisible({
      timeout: Timeouts.ELEMENT_VISIBILITY,
    });
  }

  async clickSignInButton(): Promise<void> {
    await this.page.getByRole('button', {name: 'Sign in with ThunderID'}).click();
  }

  async verifyLoggedIn(): Promise<void> {
    await expect(this.page.getByText('Session active')).toBeVisible({timeout: Timeouts.REDIRECT});
  }

  /**
   * Signs out of Better Auth, which also ends the ThunderID session (RP-initiated logout). The
   * sample registers no post-logout redirect URI, so the browser stays on the ThunderID Gate
   * afterwards; open the app again to see it signed out.
   */
  async logout(): Promise<void> {
    const signOut = this.page.waitForResponse((response) => response.url().endsWith('/api/auth/sign-out'));
    await this.page.getByRole('button', {exact: true, name: 'Sign out'}).click();
    await signOut;
    await this.page.waitForURL(/\/gate\//, {timeout: Timeouts.REDIRECT});
    await this.page.waitForLoadState('networkidle');
  }

  async verifyLoggedOut(): Promise<void> {
    await expect(this.page.getByRole('button', {name: 'Sign in with ThunderID'})).toBeVisible({
      timeout: Timeouts.REDIRECT,
    });
  }
}
