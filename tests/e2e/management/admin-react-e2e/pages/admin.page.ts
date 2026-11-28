// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * management/admin-react Page Object. The nav carries the SDK's default `SignInButton` and
 * `UserDropdown`; a signed-in administrator gets a sidebar of management sections, each page
 * rendered by an SDK management component (`UserList` and the like).
 */

import {type Locator, expect} from '@playwright/test';
import {Timeouts} from '../../../shared/constants/timeouts.ts';
import {ThunderIDWebSamplePage} from '../../../shared/pages/thunderid-web-sample.page.ts';

export class AdminPage extends ThunderIDWebSamplePage {
  protected signInButton(): Locator {
    return this.page.getByRole('button', {name: /^sign in$/i}).first();
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url, {waitUntil: 'load'});
  }

  /** The sidebar of management sections, shown only when signed in. */
  sidebarLink(section: string): Locator {
    return this.page.locator('.admin-nav').getByRole('link', {exact: true, name: section});
  }

  async verifySidebarLoaded(): Promise<void> {
    await expect(this.sidebarLink('Users')).toBeVisible({timeout: Timeouts.REDIRECT});
  }

  async openSection(section: string): Promise<void> {
    await this.sidebarLink(section).click();
    await expect(this.page.getByRole('heading', {name: section}).first()).toBeVisible({
      timeout: Timeouts.ELEMENT_VISIBILITY,
    });
  }
}
