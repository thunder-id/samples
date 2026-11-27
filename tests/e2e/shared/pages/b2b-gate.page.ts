// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * B2B Gate Page Object
 *
 * The company sign-up and company picker that the B2B samples' own flows render on the ThunderID
 * Gate (quickstart-react-b2b, quickstart-nextjs-b2b and wayfinder-enterprise-nextjs, each in its
 * thunderid-config/thunderid-config.yaml). The prompts carry the same labels in all three, so one
 * page object drives them.
 */

import {randomBytes} from 'node:crypto';
import {expect} from '@playwright/test';
import {Timeouts} from '../constants/timeouts.ts';
import {GateLoginPage} from './gate-login.page.ts';

export interface Company {
  email: string;
  handle: string;
  name: string;
  password: string;
  username: string;
}

/** A company and first admin no earlier run has registered, so the flow's uniqueness checks pass. */
export function newCompany(prefix: string): Company {
  const id = `${Date.now().toString(36)}${randomBytes(2).toString('hex')}`;
  return {
    email: `${prefix}-${id}@example.com`,
    handle: `${prefix}-${id}`,
    name: `E2E ${prefix} ${id}`,
    password: process.env.TEST_USER_PASSWORD ?? 'E2ePassword@123',
    username: `${prefix}-admin-${id}`,
  };
}

export class B2BGatePage extends GateLoginPage {
  private async fill(label: string, value: string): Promise<void> {
    const input = this.page.getByLabel(label, {exact: false}).first();
    await input.waitFor({state: 'visible', timeout: Timeouts.ELEMENT_VISIBILITY});
    await input.fill(value);
  }

  private async click(name: string | RegExp): Promise<void> {
    const control = this.page.getByRole('button', {name}).or(this.page.getByRole('link', {name})).first();
    await control.waitFor({state: 'visible', timeout: Timeouts.ELEMENT_VISIBILITY});
    await control.click();
  }

  /**
   * From the sign-in prompt, registers a company and its first admin. `accountChoice` is the
   * button of the "where does your account live" step, for the flows that have one.
   */
  async registerCompany(company: Company, accountChoice?: string): Promise<void> {
    await this.verifyLoginPageLoaded();
    await this.click('Register your company');
    if (accountChoice) await this.click(accountChoice);

    await this.fill('Username', company.username);
    await this.fill('Work email', company.email);
    await this.fill('Password', company.password);
    await this.click(/^Continue$/);

    await this.fill('Company name', company.name);
    await this.fill('Organization handle', company.handle);
    await this.click('Create company');

    // The flows ask for the user type's remaining attributes only when a required one is missing.
    const more = this.page.getByRole('button', {name: /^Continue$/});
    if (await more.isVisible({timeout: 3000}).catch(() => false)) await more.click();
  }

  /** On the "Choose your company" prompt, picks a company by name and continues. */
  async chooseCompany(name: string): Promise<void> {
    await expect(this.page.getByText('Choose your company')).toBeVisible({timeout: Timeouts.REDIRECT});
    const select = this.page.getByLabel('Company').first();
    if ((await select.evaluate((element) => element.tagName)) === 'SELECT') {
      await select.selectOption({label: name});
    } else {
      await select.click();
      await this.page.getByRole('option', {name}).click();
    }
    await this.click(/^Continue$/);
  }
}
