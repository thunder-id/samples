// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {test as base} from '@playwright/test';
import {ThunderIDAccountPageSamplePage} from '../../shared/pages/thunderid-web-sample.page.ts';

export const test = base.extend<{nuxtQuickstartPage: ThunderIDAccountPageSamplePage}>({
  nuxtQuickstartPage: async ({page}, use) => {
    await use(new ThunderIDAccountPageSamplePage(page));
  },
});

export {expect} from '@playwright/test';
