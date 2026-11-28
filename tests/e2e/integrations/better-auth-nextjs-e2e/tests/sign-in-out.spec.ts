// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * integrations/better-auth-nextjs - sign in with ThunderID through Better Auth, check the session
 * Better Auth keeps, and sign out. Signs in as the shared test user (shared/apps.ts).
 */

import {SampleApps, sampleAppUrl, testUser} from '../../../shared/apps.ts';
import {expect, test} from '../fixtures.ts';

const appUrl = sampleAppUrl(SampleApps.BETTER_AUTH_NEXTJS);

test.describe('integrations/better-auth-nextjs - Sign in and Sign out', () => {
  test.beforeEach(async ({betterAuthPage}) => {
    const {password, username} = testUser();
    await betterAuthPage.goto(appUrl);
    await betterAuthPage.verifyHomePageLoaded();
    await betterAuthPage.clickSignInButton();
    await betterAuthPage.verifyLoginPageLoaded();
    await betterAuthPage.login(username, password);
    await betterAuthPage.verifyLoggedIn();
  });

  test('TC001: signs in and shows the ThunderID user', async ({page}) => {
    await expect(page.getByText(`${testUser().username}@example.com`)).toBeVisible();
    await expect(page.getByText('OAuth provider')).toBeVisible();
  });

  test('TC002: Better Auth holds a session for the ThunderID user', async ({page}) => {
    const response = await page.request.get(`${appUrl}/api/auth/get-session`);
    expect(response.status()).toBe(200);
    const session = (await response.json()) as {session?: {expiresAt?: string}; user?: {email?: string}} | null;
    expect(session?.user?.email).toBe(`${testUser().username}@example.com`);
    expect(new Date(session!.session!.expiresAt!).getTime()).toBeGreaterThan(Date.now());
  });

  test('TC003: signs out and ends the Better Auth session', async ({betterAuthPage, page}) => {
    await betterAuthPage.logout();
    await betterAuthPage.goto(appUrl);
    await betterAuthPage.verifyLoggedOut();
    const response = await page.request.get(`${appUrl}/api/auth/get-session`);
    expect(await response.json()).toBeNull();
  });
});
