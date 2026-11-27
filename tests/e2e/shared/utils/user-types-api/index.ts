// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Thin wrapper over the server's `/user-types` endpoint.
 */

import {sendOk} from '../api-request/index.ts';

export interface ApiUserType {
  id: string;
  name: string;
  ouId: string;
}

/** Every user type in the system. The list endpoint has no name filter, so this pages until done. */
export async function listUserTypes(): Promise<ApiUserType[]> {
  const pageSize = 100;
  const all: ApiUserType[] = [];

  for (let offset = 0; ; ) {
    const response = await sendOk('GET', `/user-types?limit=${pageSize}&offset=${offset}`);
    const body = (await response.json()) as {totalResults?: number; types?: ApiUserType[]};
    const page = body.types ?? [];
    all.push(...page);
    offset += page.length;
    if (page.length < pageSize || offset >= (body.totalResults ?? offset)) {
      return all;
    }
  }
}

export async function findUserTypeByName(name: string): Promise<ApiUserType | undefined> {
  const types = await listUserTypes();
  return types.find((type) => type.name === name);
}
