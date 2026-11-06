// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

export const baseUrl: string | undefined = import.meta.env.VITE_THUNDERID_BASE_URL;
export const clientId: string | undefined = import.meta.env.VITE_THUNDERID_CLIENT_ID;

// The management API only answers a token that has `system` access and was issued for this resource.
const valueOrDefault = (value: string | undefined, fallback: string): string =>
  value === undefined || value === '' ? fallback : value;

export const resource: string = valueOrDefault(import.meta.env.VITE_THUNDERID_RESOURCE, 'https://localhost:8090/mcp');
export const scopes: string[] = ['openid', 'profile', 'system'];

export const onboardingFlowHandle: string = valueOrDefault(
  import.meta.env.VITE_AGENT_ONBOARDING_FLOW_HANDLE,
  'default-agent-onboarding-flow',
);
