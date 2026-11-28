// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {test as base} from '@playwright/test';
import {WayfinderPage} from './pages/wayfinder.page.ts';

export const test = base.extend<{wayfinderPage: WayfinderPage}>({
  wayfinderPage: async ({page}, use) => {
    await use(new WayfinderPage(page));
  },
});

export {expect} from '@playwright/test';
