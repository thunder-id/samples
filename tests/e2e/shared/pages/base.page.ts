// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import path from 'node:path';
import type {Page} from '@playwright/test';

/**
 * Base Page Object, with a screenshot helper for debugging.
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /** Saves a full-page screenshot under the suite's test-results/debug folder. */
  async screenshot(name: string): Promise<void> {
    const screenshotPath = path.resolve(process.cwd(), 'test-results/debug', `${name}.png`);
    await this.page.screenshot({fullPage: true, path: screenshotPath});
  }
}
