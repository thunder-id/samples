// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {randomBytes} from 'node:crypto';
import {defineSampleConfig, sampleWebServer} from '../../shared/playwright.ts';

// The sample's own thunderid-config (imported by the global setup) registers the client with
// redirect URIs on http://localhost:3000, which fixes the port. The client secret matches the one
// shared/apps.ts imports for NEXTJS_B2B_CLIENT_SECRET.
const appUrl = 'http://localhost:3000';

const config = defineSampleConfig({
  app: 'NEXTJS_B2B',
  webServer: sampleWebServer('NEXTJS_B2B', {
    command: 'npm run dev -- -p 3000',
    env: {
      NEXT_PUBLIC_THUNDERID_AFTER_SIGN_IN_URL: appUrl,
      NEXT_PUBLIC_THUNDERID_AFTER_SIGN_OUT_URL: appUrl,
      NEXT_PUBLIC_THUNDERID_BASE_URL: process.env.SERVER_URL!,
      NEXT_PUBLIC_THUNDERID_CLIENT_ID: 'NEXTJS_B2B_QUICKSTART',
      NEXT_PUBLIC_THUNDERID_SCOPES: 'openid profile email roles ou org device_sso',
      NEXT_PUBLIC_THUNDERID_SIGN_IN_FLOW_ID: '019f0b20-0000-7000-8000-000000000021',
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
      THUNDERID_CLIENT_SECRET: 'e2e-nextjs-b2b-secret',
      THUNDERID_SESSION_SECRET: randomBytes(32).toString('base64'),
    },
    url: appUrl,
  }),
});

export default config;
