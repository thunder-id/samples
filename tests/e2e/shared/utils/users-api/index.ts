// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Thin wrapper over the server's `/users` endpoint, for creating and resetting test users.
 */

import {send, sendOk} from '../api-request/index.ts';
import {findUserTypeByName} from '../user-types-api/index.ts';

export interface ApiUser {
  attributes?: Record<string, unknown>;
  id: string;
  ouId?: string;
  type?: string;
}

export async function findUserByUsername(username: string): Promise<ApiUser | undefined> {
  const filter = `username eq "${username}"`;
  const response = await sendOk('GET', `/users?filter=${encodeURIComponent(filter)}`);
  const {users} = (await response.json()) as {users?: ApiUser[]};
  return (users ?? []).find((candidate) => candidate.attributes?.username === username);
}

/** Create a user directly through the API, bypassing any UI. */
export async function createUser(attributes: Record<string, unknown>, type = 'Person'): Promise<ApiUser> {
  const userType = await findUserTypeByName(type);
  if (!userType) {
    throw new Error(`GET /user-types returned no "${type}" user type`);
  }
  const response = await sendOk('POST', '/users', {attributes, ouId: userType.ouId, type: userType.name});
  return (await response.json()) as ApiUser;
}

/** Delete a user by id. Returns false, rather than throwing, if the delete failed. */
export async function deleteUser(userId: string): Promise<boolean> {
  const response = await send('DELETE', `/users/${userId}`);
  return response.ok;
}

/** Set a user's password through the admin API, bypassing any UI. */
export async function setUserPassword(username: string, password: string): Promise<void> {
  const user = await findUserByUsername(username);
  if (!user) {
    throw new Error(`No user "${username}" to set the password for`);
  }
  await sendOk('POST', `/users/${user.id}/update-credentials`, {credentials: {password}});
}

/**
 * Makes sure a Person user with this username exists and signs in with this password. Creates it
 * when missing; otherwise resets the password, which an interrupted change-credential test can
 * leave changed. Safe to run against a server a previous run already provisioned.
 */
export async function ensureUser(username: string, password: string, givenName = 'Test'): Promise<ApiUser> {
  const existing = await findUserByUsername(username);
  if (existing) {
    await sendOk('POST', `/users/${existing.id}/update-credentials`, {credentials: {password}});
    return existing;
  }
  return createUser({
    email: `${username}@example.com`,
    family_name: 'E2E',
    given_name: givenName,
    password,
    username,
  });
}
