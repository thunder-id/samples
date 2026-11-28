// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {randomBytes} from 'node:crypto';
import {sharedClientVariable} from '../../shared/apps.ts';
import {defineSampleConfig, sampleWebServer} from '../../shared/playwright.ts';

// A client ID puts the sample in redirect mode (see its app/layout.tsx), so its native-flow
// variables (application ID, sign-in and sign-up URLs, flow secret) stay unset.
const sessionSecret = randomBytes(32).toString('base64');

const config = defineSampleConfig({
  app: 'NEXTJS',
  webServer: sampleWebServer('NEXTJS', {
    command: 'npm run dev -- -p 3001',
    env: {
      NEXT_PUBLIC_THUNDERID_BASE_URL: process.env.SERVER_URL!,
      NEXT_PUBLIC_THUNDERID_CLIENT_ID: sharedClientVariable('NEXTJS_CLIENT_ID'),
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
      THUNDERID_CLIENT_SECRET: sharedClientVariable('NEXTJS_CLIENT_SECRET'),
      THUNDERID_SECRET: sessionSecret,
      THUNDERID_SESSION_SECRET: sessionSecret,
    },
  }),
});

export default config;
