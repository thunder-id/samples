// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ChangeCredential, UserProfile} from '@thunderid/react';
import type {ReactElement} from 'react';

// The signed-in administrator's own account: their profile, which they can edit, and their password.
export default function AccountPage(): ReactElement {
  return (
    <>
      <h2 className="admin-content-title">My account</h2>
      <p className="admin-content-subtitle">Your own profile and password, as any ThunderID user sees them.</p>
      <UserProfile title="Profile" />
      <div className="admin-panel">
        <ChangeCredential />
      </div>
    </>
  );
}
