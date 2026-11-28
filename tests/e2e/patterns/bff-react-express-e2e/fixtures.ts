// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {test as base} from '@playwright/test';
import {ThunderIDAccountPageSamplePage} from '../../shared/pages/thunderid-web-sample.page.ts';

// The React app renders the same nav, dropdown and token debug page as the React quickstart, so
// the shared page object drives it.
export const test = base.extend<{bffPage: ThunderIDAccountPageSamplePage}>({
  bffPage: async ({page}, use) => {
    await use(new ThunderIDAccountPageSamplePage(page));
  },
});

export {expect} from '@playwright/test';
