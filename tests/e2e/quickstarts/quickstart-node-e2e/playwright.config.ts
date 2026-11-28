// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {defineSampleConfig} from '../../shared/playwright.ts';

// A CLI with no browser UI: the spec spawns it, so there is no web server to start.
export default defineSampleConfig({app: 'NODE'});
