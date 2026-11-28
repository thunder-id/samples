// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Imports a declarative config with `POST /import`, upserting, so re-running against a server
 * that already holds the resources is safe. The same call as `thunderid.sh import`.
 */

import fs from 'node:fs';
import {sendOk} from '../api-request/index.ts';

export type ImportVariables = Record<string, string | string[]>;

/**
 * Reads a KEY=VALUE env file. A value that parses as a JSON array stays a list, so a variable such
 * as REDIRECT_URIS=["http://localhost:3000"] reaches the template as one.
 */
export function readEnvFile(file: string): ImportVariables {
  const variables: ImportVariables = {};
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line.trim());
    if (!match) continue;
    const [, key, value] = match;
    let parsed: string | string[] = value;
    if (value.startsWith('[')) {
      try {
        const json: unknown = JSON.parse(value);
        if (Array.isArray(json)) parsed = json.map(String);
      } catch {
        // Not JSON: keep the raw string.
      }
    }
    variables[key] = parsed;
  }
  return variables;
}

/**
 * Drops the `server_config` documents of the given names from a multi-document config, for a run
 * against a shared server whose server-wide settings must stay as they are.
 */
export function withoutServerConfigs(content: string, names: string[]): string {
  if (names.length === 0) return content;
  return content
    .split(/^---[ \t]*$/m)
    .filter((doc) => {
      if (!/^resource_type:\s*server_config\s*$/m.test(doc)) return true;
      const name = /^name:\s*(\S+)\s*$/m.exec(doc)?.[1];
      return !name || !names.includes(name);
    })
    .join('---');
}

export async function importConfig(content: string, variables: ImportVariables = {}): Promise<void> {
  const response = await sendOk('POST', '/import', {content, options: {upsert: true}, variables});
  const result = (await response.json()) as {summary?: {failed?: number}};
  if ((result.summary?.failed ?? 0) !== 0) {
    throw new Error(`POST /import had failed resources: ${JSON.stringify(result)}`);
  }
}
