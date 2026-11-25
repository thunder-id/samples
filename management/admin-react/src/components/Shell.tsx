// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ProjectSwitcher} from '@thunderid/react';
import type {ReactElement, ReactNode} from 'react';
import {NavLink, Outlet} from 'react-router';
import AgentIcon from './icons/AgentIcon';
import ApplicationIcon from './icons/ApplicationIcon';
import FlowIcon from './icons/FlowIcon';
import GroupIcon from './icons/GroupIcon';
import OrganizationUnitIcon from './icons/OrganizationUnitIcon';
import ProjectIcon from './icons/ProjectIcon';
import RoleIcon from './icons/RoleIcon';
import UserIcon from './icons/UserIcon';

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
  {end: false, icon: UserIcon, label: 'Users', to: '/users'},
  {end: false, icon: GroupIcon, label: 'Groups', to: '/groups'},
  {end: false, icon: RoleIcon, label: 'Roles', to: '/roles'},
  {end: false, icon: ApplicationIcon, label: 'Applications', to: '/applications'},
  {end: false, icon: AgentIcon, label: 'Agents', to: '/agents'},
  {end: false, icon: FlowIcon, label: 'Flows', to: '/flows'},
  {end: false, icon: ProjectIcon, label: 'Projects', to: '/projects'},
  {end: false, icon: OrganizationUnitIcon, label: 'Organization units', to: '/organization-units'},
];

// A persistent left sidebar with the current project and the sections of the app, and the section's page on the
// right. Routes render into the outlet. The home page passes its own content.
export default function Shell({children = null}: {children?: ReactNode}): ReactElement {
  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        {/*
          The current project scopes the application and agent lists, and is where new applications and agents are
          created. The SDK keeps the choice, so every page reads the same one.
        */}
        <div className="admin-project">
          <ProjectSwitcher label="Project" />
        </div>
        <nav className="admin-nav">
          {ITEMS.map(({end, icon: Icon, label, to}) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({isActive}) => `admin-nav-item${isActive ? ' admin-nav-item--active' : ''}`}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="admin-content">
        <div className="admin-content-inner">{children ?? <Outlet />}</div>
      </main>
    </div>
  );
}
