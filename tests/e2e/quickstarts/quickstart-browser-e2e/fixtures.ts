// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {test as base} from '@playwright/test';
import {BrowserQuickstartPage} from './pages/browser-quickstart.page.ts';

export const test = base.extend<{browserQuickstartPage: BrowserQuickstartPage}>({
  browserQuickstartPage: async ({page}, use) => {
    await use(new BrowserQuickstartPage(page));
  },
});

export {expect} from '@playwright/test';
