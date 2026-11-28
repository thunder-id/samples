// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * self-service/myaccount-react Page Object. The account page has the same Home, Personal info and
 * Security tabs as the quickstarts' Account page, so the shared page object drives it. What
 * differs: the sign-in button is the SDK's default `SignInButton`, the dropdown's profile action
 * is labelled "Account", and a signed-in user lands on /account straight away.
 */

import {type Locator, expect} from '@playwright/test';
import {Timeouts} from '../../../shared/constants/timeouts.ts';
import {ThunderIDAccountPageSamplePage} from '../../../shared/pages/thunderid-web-sample.page.ts';

export class MyAccountPage extends ThunderIDAccountPageSamplePage {
  protected manageAccountLabel: string | RegExp = /^Account$/;

  protected signInButton(): Locator {
    return this.page.getByRole('button', {name: /^sign in$/i}).first();
  }

  async goto(url: string): Promise<void> {
    await this.page.goto(url, {waitUntil: 'load'});
  }

  /** The greeting on the account page's Home tab, which a signed-in user lands on. */
  async verifyAccountHome(): Promise<void> {
    await expect(this.page).toHaveURL(/\/account/, {timeout: Timeouts.REDIRECT});
    await expect(this.page.getByRole('heading', {level: 2, name: /^Hi, /})).toBeVisible({
      timeout: Timeouts.ELEMENT_VISIBILITY,
    });
  }
}
