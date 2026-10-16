// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Loading, SignedIn, SignedOut, SignInButton, UserDropdown, useTheme} from '@thunderid/react';
import {useEffect, type ReactElement} from 'react';
import {Link, Outlet, useNavigate} from 'react-router';
import ThemeToggle from './ThemeToggle';
import ThunderMark from './ThunderMark';

export default function Nav(): ReactElement {
  const navigate = useNavigate();
  const {colorScheme, toggleTheme} = useTheme();
  const dark: boolean = colorScheme === 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  }, [dark]);

  return (
    <div className="app" data-theme={dark ? 'dark' : undefined}>
      <nav className="nav">
        <Link to="/" className="nav-logo">
          <ThunderMark height={24} dark={dark} />
          <span className="wordmark-name">Manage</span>
        </Link>
        <div className="nav-actions">
          <ThemeToggle dark={dark} onToggle={toggleTheme} />
          <SignedIn>
            <UserDropdown showTriggerLabel manageProfileLabel="Home" onManageProfile={() => void navigate('/')} />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </nav>

      <Loading>
        <div className="loading-screen">Loading…</div>
      </Loading>

      <Outlet />
    </div>
  );
}
