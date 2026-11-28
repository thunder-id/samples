// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {sharedClientVariable} from '../../shared/apps.ts';
import {defineSampleConfig, sampleWebServer} from '../../shared/playwright.ts';

// The sample listens on a fixed port, 3000.

const config = defineSampleConfig({
  app: 'EXPRESS',
  webServer: sampleWebServer('EXPRESS', {
    command: 'npm start',
    env: {
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
      THUNDERID_BASE_URL: process.env.SERVER_URL!,
      THUNDERID_CLIENT_ID: sharedClientVariable('EXPRESS_CLIENT_ID'),
      THUNDERID_CLIENT_SECRET: sharedClientVariable('EXPRESS_CLIENT_SECRET'),
    },
  }),
});

export default config;
