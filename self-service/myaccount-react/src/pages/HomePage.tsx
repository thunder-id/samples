// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {SignedIn, SignedOut, SignInButton, useTheme} from '@thunderid/react';
import type {ReactElement} from 'react';
import {Navigate} from 'react-router';
import ThunderMark from '../components/ThunderMark';

export default function HomePage(): ReactElement {
  const {colorScheme} = useTheme();

  return (
    <>
      <SignedOut>
        <div className="hero">
          <div className="hero-inner">
            <div className="hero-mark">
              <ThunderMark height={44} dark={colorScheme === 'dark'} />
            </div>

            <div className="hero-badge">
              <span className="hero-badge-line" />
              <span>Account</span>
              <span className="hero-badge-line" />
            </div>

            <h1 className="hero-title">Your Account, Your Way</h1>

            <p className="hero-subtitle">
              Manage your ThunderID account. Update your profile details and change your password in one place.
            </p>

            <div className="hero-ctas">
              <SignInButton />
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <Navigate to="/account" replace />
      </SignedIn>
    </>
  );
}
