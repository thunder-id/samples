// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {sharedClientVariable} from '../../shared/apps.ts';
import {defineSampleConfig, sampleWebServer} from '../../shared/playwright.ts';

const config = defineSampleConfig({
  app: 'MYACCOUNT_REACT',
  webServer: sampleWebServer('MYACCOUNT_REACT', {
    command: 'npm run dev -- --port 5177 --strictPort',
    env: {
      VITE_THUNDERID_BASE_URL: process.env.SERVER_URL!,
      VITE_THUNDERID_CLIENT_ID: sharedClientVariable('MYACCOUNT_REACT_CLIENT_ID'),
    },
  }),
});

export default config;
