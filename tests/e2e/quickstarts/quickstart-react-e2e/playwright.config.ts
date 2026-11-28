// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {sharedClientVariable} from '../../shared/apps.ts';
import {defineSampleConfig, sampleWebServer} from '../../shared/playwright.ts';

const config = defineSampleConfig({
  app: 'REACT',
  webServer: sampleWebServer('REACT', {
    command: 'npm run dev -- --port 5174 --strictPort',
    env: {
      VITE_THUNDERID_BASE_URL: process.env.SERVER_URL!,
      VITE_THUNDERID_CLIENT_ID: sharedClientVariable('REACT_CLIENT_ID'),
    },
  }),
});

export default config;
