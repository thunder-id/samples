// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import type {ReactElement, ReactNode} from 'react';
import {NavLink, Outlet} from 'react-router';
import AgentIcon from './icons/AgentIcon';

function HomeIcon(): ReactElement {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12l9-9 9 9" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

const ITEMS = [
  {end: true, icon: HomeIcon, label: 'Home', to: '/'},
  {end: false, icon: AgentIcon, label: 'Agents', to: '/agents'},
];

// A persistent left sidebar with the sections of the app, and the section's page on the right. Routes render into
// the outlet. The home page passes its own content.
export default function Shell({children = null}: {children?: ReactNode}): ReactElement {
  return (
    <div className="manage-page">
      <aside className="manage-sidebar">
        <nav className="manage-nav">
          {ITEMS.map(({end, icon: Icon, label, to}) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({isActive}) => `manage-nav-item${isActive ? ' manage-nav-item--active' : ''}`}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="manage-content">
        <div className="manage-content-inner">{children ?? <Outlet />}</div>
      </main>
    </div>
  );
}
