// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import config from '@thunderid/prettier-config';

export default {
  ...config,
  // Markdown paragraphs stay on one line each, so a small edit does not reflow the whole paragraph.
  overrides: [...(config.overrides ?? []), {files: '*.md', options: {proseWrap: 'preserve'}}],
};
