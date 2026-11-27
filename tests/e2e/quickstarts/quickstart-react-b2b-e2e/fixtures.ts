// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {test as base} from '@playwright/test';
import {B2BQuickstartPage} from '../../shared/pages/b2b-quickstart.page.ts';

export const test = base.extend<{b2bPage: B2BQuickstartPage}>({
  b2bPage: async ({page}, use) => {
    await use(new B2BQuickstartPage(page));
  },
});

export {expect} from '@playwright/test';
