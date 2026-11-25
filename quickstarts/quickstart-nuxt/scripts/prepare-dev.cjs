// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

const PREFIX = 'NUXT_PUBLIC_THUNDERID_';
const NATIVE_FLOW_VARS = [`${PREFIX}APPLICATION_ID`, `${PREFIX}SIGN_IN_URL`, `${PREFIX}SIGN_UP_URL`];
const REDIRECT_FLOW_VARS = [`${PREFIX}CLIENT_ID`, 'THUNDERID_CLIENT_SECRET'];
const REDIRECT_FLOW_PLACEHOLDERS = {
  [`${PREFIX}CLIENT_ID`]: 'your-client-id-here',
  THUNDERID_CLIENT_SECRET: 'your-client-secret-here',
};

const flowArg = process.argv.find((arg) => arg.startsWith('--flow='));
const flowExplicitlyRequested = Boolean(flowArg);
const flow = flowArg ? flowArg.slice('--flow='.length) : 'native';

if (flowExplicitlyRequested && flow !== 'native' && flow !== 'redirect') {
  console.error(`Unknown --flow value "${flow}". Expected "native" or "redirect".`);
  process.exit(1);
}

/**
 * Toggles the leading `# ` on env var lines to match the selected flow, appending
 * any vars for the selected flow that aren't present in the source file yet (the
 * redirect-flow vars aren't checked into `.env.example`, so switching to `redirect`
 * from a fresh copy needs to add them rather than just uncomment them).
 */
function applyFlow(envContent, selectedFlow) {
  const varsToEnable = selectedFlow === 'redirect' ? REDIRECT_FLOW_VARS : NATIVE_FLOW_VARS;
  const varsToDisable = selectedFlow === 'redirect' ? NATIVE_FLOW_VARS : REDIRECT_FLOW_VARS;
  const found = new Set();

  const lines = envContent.split('\n').map((line) => {
    const enable = varsToEnable.find((key) => line.replace(/^#\s*/, '').startsWith(`${key}=`));
    if (enable) {
      found.add(enable);
      return line.replace(/^#\s*/, '');
    }

    const disable = varsToDisable.find((key) => line.startsWith(`${key}=`));
    if (disable) return `# ${line}`;

    return line;
  });

  const missing = varsToEnable.filter((key) => !found.has(key));
  if (missing.length > 0) {
    lines.push('', `# ── ${selectedFlow} flow ─────────────────────────────────────────────────`);
    for (const key of missing) lines.push(`${key}=${REDIRECT_FLOW_PLACEHOLDERS[key] ?? ''}`);
  }

  return lines.join('\n');
}

const envExample = path.join(root, '.env.example');
const envTarget = path.join(root, '.env');

// Only explicit `--flow=` invocations are allowed to (re)write an existing
// .env — a plain `npm run prepare-dev` (e.g. from .stackblitzrc's
// startCommand) stays a safe, idempotent copy-if-missing.
if (fs.existsSync(envExample) && (flowExplicitlyRequested || !fs.existsSync(envTarget))) {
  const envSource = fs.existsSync(envTarget) ? envTarget : envExample;
  const envContent = applyFlow(fs.readFileSync(envSource, 'utf8'), flow)
    // Blank placeholder values (e.g. `your-client-id-here`, the sample base URL)
    // so the copied .env still trips the app's missing-env-var check until real
    // values are filled in.
    .replace(/^([A-Z0-9_]+)=(your-\S*|generate-with-\S*|https:\/\/localhost:8090)$/gm, '$1=');
  fs.writeFileSync(envTarget, envContent);
}
