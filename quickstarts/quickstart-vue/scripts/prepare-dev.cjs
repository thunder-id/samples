// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

const envExample = path.join(root, '.env.example');
const envTarget = path.join(root, '.env');
if (fs.existsSync(envExample) && !fs.existsSync(envTarget)) {
  // Blank placeholder values (e.g. `your-client-id-here`, the sample base URL)
  // so the copied .env still trips the app's missing-env-var check until real
  // values are filled in.
  const envContent = fs
    .readFileSync(envExample, 'utf8')
    .replace(/^([A-Z0-9_]+)=(your-\S*|generate-with-\S*|https:\/\/localhost:8090)$/gm, '$1=');
  fs.writeFileSync(envTarget, envContent);
}
