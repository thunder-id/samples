// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Stop `next dev` from writing its AGENTS.md block for AI coding agents.
  agentRules: false,
  // `next dev` logs each Server Function call with its arguments. The admin pages send passwords and
  // identity provider client secrets through the SDK's management Server Function, so keep them out of the log.
  logging: {
    serverFunctions: false,
  },
};

export default nextConfig;
