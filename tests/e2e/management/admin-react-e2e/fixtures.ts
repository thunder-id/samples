// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {test as base} from '@playwright/test';
import {AdminPage} from './pages/admin.page.ts';

export const test = base.extend<{adminPage: AdminPage}>({
  adminPage: async ({page}, use) => {
    await use(new AdminPage(page));
  },
});

export {expect} from '@playwright/test';
