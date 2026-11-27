// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Organization units and user sharing, for the B2B suites' multi-company account: the Console's
 * "Affiliations" tab, done through the API.
 */

import {sendOk} from '../api-request/index.ts';
import type {ApiUser} from '../users-api/index.ts';

/** The Default organization unit every B2B sample's companies live beneath. */
export const DEFAULT_OU_ID = '01900000-0000-7000-8000-000000000001';

export interface ApiOrganizationUnit {
  handle: string;
  id: string;
  name: string;
}

export async function createChildOrganizationUnit(handle: string, name: string): Promise<ApiOrganizationUnit> {
  const response = await sendOk('POST', '/organization-units', {handle, name, parent: DEFAULT_OU_ID});
  return (await response.json()) as ApiOrganizationUnit;
}

/** Creates a user of the given user type in the Default organization unit. */
export async function createDefaultOuUser(type: string, attributes: Record<string, unknown>): Promise<ApiUser> {
  const response = await sendOk('POST', '/users', {attributes, ouId: DEFAULT_OU_ID, type});
  return (await response.json()) as ApiUser;
}

/** Shares a user into every organization unit beneath its own, present and future. */
export async function shareUserWithAllChildUnits(userId: string): Promise<void> {
  await sendOk('POST', `/users/${userId}/sharing-policies`, {childUnits: {mode: 'all'}});
}
