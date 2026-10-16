// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGENT_ONBOARDING_FLOW_HANDLE?: string;
  readonly VITE_THUNDERID_BASE_URL?: string;
  readonly VITE_THUNDERID_CLIENT_ID?: string;
  readonly VITE_THUNDERID_RESOURCE?: string;
}
