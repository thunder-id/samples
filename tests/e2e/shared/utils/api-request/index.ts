// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Authenticated requests to the ThunderID server: the base URL, an admin bearer token, the
 * self-signed certificate allowance, and one consistent error carrying the status and body.
 */

import {getAdminToken} from '../authentication/index.ts';
import {insecureDispatcher} from './dispatcher.ts';

export function serverUrl(): string {
  return process.env.SERVER_URL ?? 'https://localhost:8090';
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Authenticated call against the server. Returns the response as is, non-2xx included. */
export async function send(method: Method, path: string, data?: unknown): Promise<Response> {
  const token = await getAdminToken();
  return fetch(`${serverUrl()}${path}`, {
    body: data === undefined ? undefined : JSON.stringify(data),
    dispatcher: await insecureDispatcher(),
    headers: {
      Authorization: `Bearer ${token}`,
      ...(data === undefined ? {} : {'Content-Type': 'application/json'}),
    },
    method,
  } as RequestInit);
}

/** Same as `send`, but a non-2xx becomes an error carrying the status and response body. */
export async function sendOk(method: Method, path: string, data?: unknown): Promise<Response> {
  const response = await send(method, path, data);
  if (!response.ok) {
    throw new Error(`${method} ${path} failed (${response.status}): ${await response.text()}`);
  }
  return response;
}
