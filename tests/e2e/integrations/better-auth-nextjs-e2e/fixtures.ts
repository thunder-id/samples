// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {test as base} from '@playwright/test';
import {BetterAuthPage} from './pages/better-auth.page.ts';

export const test = base.extend<{betterAuthPage: BetterAuthPage}>({
  betterAuthPage: async ({page}, use) => {
    await use(new BetterAuthPage(page));
  },
});

export {expect} from '@playwright/test';
