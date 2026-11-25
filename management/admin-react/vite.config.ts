// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // One copy of React and the router for the app and the SDK.
  resolve: {dedupe: ['react', 'react-dom', 'react-router']},
});
