// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {sharedClientVariable} from '../../shared/apps.ts';
import {defineSampleConfig, sampleWebServer} from '../../shared/playwright.ts';

// The BFF signs users in and holds the tokens; the React app reaches it on its own origin under
// /api/auth through the Vite dev server's proxy, so the BFF's session cookie is first party.
const appUrl = 'http://localhost:5178';
const bffPort = 3004;

const config = defineSampleConfig({
  app: 'BFF_REACT_EXPRESS',
  webServer: [
    sampleWebServer('BFF_REACT_EXPRESS', {
      command: 'npm start -w server',
      env: {
        APP_URL: appUrl,
        NODE_TLS_REJECT_UNAUTHORIZED: '0',
        PORT: String(bffPort),
        THUNDERID_BASE_URL: process.env.SERVER_URL!,
        THUNDERID_CLIENT_ID: sharedClientVariable('BFF_REACT_EXPRESS_CLIENT_ID'),
        THUNDERID_CLIENT_SECRET: sharedClientVariable('BFF_REACT_EXPRESS_CLIENT_SECRET'),
      },
      port: bffPort,
    }),
    sampleWebServer('BFF_REACT_EXPRESS', {
      command: 'npm run dev -w client -- --port 5178 --strictPort',
      env: {BFF_URL: `http://localhost:${bffPort}`},
      skipInstall: true,
      url: appUrl,
    }),
  ],
});

export default config;
