// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {defineSampleConfig, sampleWebServer} from '../../shared/playwright.ts';

// The sample's own thunderid-config (imported by the global setup) registers the client with
// redirect URIs on http://localhost:5173, and its vite.config.js fixes that port.
const config = defineSampleConfig({
  app: 'REACT_B2B',
  webServer: sampleWebServer('REACT_B2B', {
    command: 'npm run dev',
    env: {
      VITE_THUNDERID_BASE_URL: process.env.SERVER_URL!,
      VITE_THUNDERID_CLIENT_ID: 'REACT_B2B_QUICKSTART',
      VITE_THUNDERID_RESOURCE: `${process.env.SERVER_URL}/mcp`,
      VITE_THUNDERID_SIGN_IN_FLOW_ID: '019f0b10-0000-7000-8000-000000000021',
    },
  }),
});

export default config;
