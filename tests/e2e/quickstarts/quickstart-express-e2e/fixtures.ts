// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {test as base} from '@playwright/test';
import {ExpressQuickstartPage} from './pages/express-quickstart.page.ts';

export const test = base.extend<{expressQuickstartPage: ExpressQuickstartPage}>({
  expressQuickstartPage: async ({page}, use) => {
    await use(new ExpressQuickstartPage(page));
  },
});

export {expect} from '@playwright/test';
