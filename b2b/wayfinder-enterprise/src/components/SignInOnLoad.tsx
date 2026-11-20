// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import { useThunderID } from '@thunderid/nextjs';
import { useEffect, useRef } from 'react';

/**
 * Starts sign-in as soon as the landing page opens with `?signin`. ThunderID's account-linking screen
 * links here as "Back to sign in", so the user starts a new sign-in instead of carrying the one that
 * found the match back to the sign-in options.
 */
export default function SignInOnLoad() {
  const { isLoading, signIn } = useThunderID();
  const started = useRef(false);

  useEffect(() => {
    if (started.current || isLoading || !signIn || !new URLSearchParams(window.location.search).has('signin')) {
      return;
    }
    started.current = true;
    void signIn();
  }, [isLoading, signIn]);

  return null;
}
