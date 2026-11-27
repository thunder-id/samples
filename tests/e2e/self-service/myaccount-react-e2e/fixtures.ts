// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {test as base} from '@playwright/test';
import {MyAccountPage} from './pages/myaccount.page.ts';

export const test = base.extend<{myAccountPage: MyAccountPage}>({
  myAccountPage: async ({page}, use) => {
    await use(new MyAccountPage(page));
  },
});

export {expect} from '@playwright/test';
