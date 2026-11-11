// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import { SignOutButton } from '@thunderid/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Icon, { IconName } from './Icon';

const ADMIN_NAV: { href: string; icon: IconName; label: string }[] = [
  { href: '/workspace/bookings', icon: 'plane', label: 'Flight booking' },
  { href: '/workspace/policy', icon: 'sliders', label: 'Travel policy' },
  { href: '/workspace/team', icon: 'users', label: 'Team and roles' },
  { href: '/workspace/enterprise-sso', icon: 'key', label: 'Enterprise SSO' },
];

interface WorkspaceShellProps {
  children: ReactNode;
  companyName: string;
  displayName: string;
  email?: string;
  isAdmin: boolean;
}

/** Admins get a sidebar with the admin pages; members get a top bar and the booking page only. */
export default function WorkspaceShell({ children, companyName, displayName, email, isAdmin }: WorkspaceShellProps) {
  const pathname = usePathname();
  const initials = displayName.slice(0, 2).toUpperCase();
  const currentPage = ADMIN_NAV.find((item) => pathname.startsWith(item.href));

  const account = (
    <div className="account">
      <span className="avatar" aria-hidden="true">
        {initials}
      </span>
      <span className="account-text">
        <strong>{displayName}</strong>
        {email && email !== displayName && <span>{email}</span>}
      </span>
      <SignOutButton>
        {({ isLoading, signOut }) => (
          <button type="button" className="button ghost small" disabled={isLoading} onClick={() => void signOut()}>
            <Icon name="signOut" size={16} />
            Sign out
          </button>
        )}
      </SignOutButton>
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="member-shell">
        <header className="member-header">
          <span className="brand">
            <img className="brand-logo" src="/wayfinder-logo.svg" alt="Wayfinder Enterprise" width={232} height={48} />
            <span className="company-tag">{companyName}</span>
          </span>
          {account}
        </header>
        <main className="workspace">{children}</main>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <img
          className="brand-logo"
          src="/wayfinder-logo-inverse.svg"
          alt="Wayfinder Enterprise"
          width={232}
          height={48}
        />
        <div className="company-card">
          <span className="company-initial" aria-hidden="true">
            {companyName.slice(0, 1).toUpperCase()}
          </span>
          <span className="company-card-text">
            <strong>{companyName}</strong>
            <span>Admin workspace</span>
          </span>
        </div>
        <p className="nav-label">Workspace</p>
        <nav aria-label="Workspace">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item === currentPage ? 'nav-link active' : 'nav-link'}
              aria-current={item === currentPage ? 'page' : undefined}
            >
              <Icon name={item.icon} />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-header">
          <p className="breadcrumb">
            <span>{companyName}</span>
            {currentPage && (
              <>
                <span aria-hidden="true">/</span>
                <strong>{currentPage.label}</strong>
              </>
            )}
          </p>
          {account}
        </header>
        <main className="workspace">{children}</main>
      </div>
    </div>
  );
}
