// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {SignedIn, SignedOut, User, useTheme} from '@thunderid/react';
import type {ReactElement} from 'react';
import Shell from '../components/Shell';
import ThunderMark from '../components/ThunderMark';

const SDK_NOTES: string[] = [
  'Sign-in is with a ThunderID administrator account. The app asks for admin access when you sign in.',
  'Every request goes through the ThunderID React SDK, which adds your access token.',
];

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
              <span>Manage</span>
              <span className="hero-badge-line" />
            </div>

            <h1 className="hero-title">Manage your ThunderID server</h1>

            <p className="hero-subtitle">
              A sample admin app. Sign in as an administrator to see and manage the agents on your ThunderID server.
            </p>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <Shell>
          <User>
            {(user) => {
              const name: string =
                [user?.givenName, user?.given_name, user?.displayName, user?.username].find(
                  (value: unknown): value is string => typeof value === 'string' && value.length > 0,
                ) ?? 'there';

              return <h2 className="manage-content-title">Hi, {name}</h2>;
            }}
          </User>
          <p className="manage-content-subtitle">
            Manage is a sample app that shows how an admin tool for ThunderID can be built with the ThunderID React SDK.
          </p>

          <h3 className="manage-section-title">How it is built</h3>
          <ul className="manage-notes">
            {SDK_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Shell>
      </SignedIn>
    </>
  );
}
