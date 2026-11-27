// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {sharedClientVariable} from '../../shared/apps.ts';
import {defineSampleConfig, sampleWebServer} from '../../shared/playwright.ts';

const config = defineSampleConfig({
  app: 'ADMIN_REACT',
  webServer: sampleWebServer('ADMIN_REACT', {
    command: 'npm run dev -- --port 5176 --strictPort',
    env: {
      VITE_THUNDERID_BASE_URL: process.env.SERVER_URL!,
      VITE_THUNDERID_CLIENT_ID: sharedClientVariable('ADMIN_REACT_CLIENT_ID'),
      // The management API answers only tokens issued for the System resource server.
      VITE_THUNDERID_RESOURCE: `${process.env.SERVER_URL}/mcp`,
    },
  }),
});

export default config;
