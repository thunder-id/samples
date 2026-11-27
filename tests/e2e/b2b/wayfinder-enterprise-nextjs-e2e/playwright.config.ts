// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {randomBytes} from 'node:crypto';
import {defineSampleConfig, sampleWebServer} from '../../shared/playwright.ts';

// The sample's `npm run dev` fixes port 3000. Its own thunderid-config (imported by the global
// setup) creates the resources with fixed IDs; the two client secrets match the ones shared/apps.ts
// imports.
const appUrl = 'http://localhost:3000';

const config = defineSampleConfig({
  app: 'WAYFINDER_ENTERPRISE_NEXTJS',
  webServer: sampleWebServer('WAYFINDER_ENTERPRISE_NEXTJS', {
    command: 'npm run dev',
    env: {
      NEXT_PUBLIC_THUNDERID_AFTER_SIGN_IN_URL: appUrl,
      NEXT_PUBLIC_THUNDERID_AFTER_SIGN_OUT_URL: appUrl,
      NEXT_PUBLIC_THUNDERID_APPLICATION_ID: '019f0a10-0000-7000-8000-000000000031',
      NEXT_PUBLIC_THUNDERID_BASE_URL: process.env.SERVER_URL!,
      NEXT_PUBLIC_THUNDERID_CLIENT_ID: 'WAYFINDER_ENTERPRISE',
      NEXT_PUBLIC_THUNDERID_SCOPES:
        'openid profile email roles ou booking:view booking:create booking:manage policy:view policy:manage user:view user:manage group:view group:manage role:view role:manage sso:view sso:manage',
      // The app calls ThunderID from its server; accept the local server's self-signed certificate.
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
      THUNDERID_CLIENT_SECRET: 'e2e-wayfinder-secret',
      THUNDERID_SESSION_SECRET: randomBytes(32).toString('base64'),
      THUNDERID_SYSTEM_RESOURCE: `${process.env.SERVER_URL}/mcp`,
      WAYFINDER_ADMIN_ROLE_ID: '019f0a10-0000-7000-8000-000000000011',
      WAYFINDER_ADMIN_ROLE_NAME: 'Wayfinder Admin',
      WAYFINDER_API_RESOURCE: 'urn:wayfinder-enterprise:api',
      WAYFINDER_APP_URL: appUrl,
      WAYFINDER_BACKEND_CLIENT_ID: 'WAYFINDER_ENTERPRISE_BACKEND',
      WAYFINDER_BACKEND_CLIENT_SECRET: 'e2e-wayfinder-backend-secret',
      WAYFINDER_MEMBER_ROLE_ID: '019f0a10-0000-7000-8000-000000000012',
      WAYFINDER_SIGN_IN_FLOW_ID: '019f0a10-0000-7000-8000-000000000021',
      WAYFINDER_USER_TYPE: 'wayfinder-user',
    },
    url: appUrl,
  }),
});

export default config;
