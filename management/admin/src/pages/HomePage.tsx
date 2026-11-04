// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {SignedIn, SignedOut, User, useTheme} from '@thunderid/react';
import type {ReactElement} from 'react';
import {Link} from 'react-router';
import Shell from '../components/Shell';
import ThunderMark from '../components/ThunderMark';

interface Section {
  text: string;
  title: string;
  to: string;
}

const SECTIONS: Section[] = [
  {
    text: 'Search and create users, edit their attributes, suspend, unsuspend or unlock them, and share them with other organization units.',
    title: 'Users',
    to: '/users',
  },
  {title: 'Groups', text: 'Create groups, add and remove their members, and delete them.', to: '/groups'},
  {
    text: 'Create roles, add and remove the permissions they grant, assign them, and share them with other organization units.',
    title: 'Roles',
    to: '/roles',
  },
  {
    text: 'Create, edit and suspend applications, regenerate their secrets, and share them. The current project scopes the list.',
    title: 'Applications',
    to: '/applications',
  },
  {
    text: 'Create agents directly or through the onboarding flow, and suspend, unlock or delete them. The current project scopes the list.',
    title: 'Agents',
    to: '/agents',
  },
  {title: 'Flows', text: 'See the flows on your server and share them with other organization units.', to: '/flows'},
  {
    text: 'Create, rename and delete projects, and choose the current one in the sidebar.',
    title: 'Projects',
    to: '/projects',
  },
  {
    text: 'Browse the organization unit tree, create root and child units, and see what each one holds.',
    title: 'Organization units',
    to: '/organization-units',
  },
  {title: 'My account', text: 'Edit your own profile and change your password.', to: '/account'},
];

const SDK_NOTES: string[] = [
  'Sign-in is with a ThunderID administrator account. The app asks for admin access when you sign in.',
  'Every request goes through the ThunderID React SDK, which adds your access token.',
  'The organization unit menu in the top bar switches your session to another organization unit you can access.',
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
              <span>Admin</span>
              <span className="hero-badge-line" />
            </div>

            <h1 className="hero-title">Administer your ThunderID server</h1>

            <p className="hero-subtitle">
              A sample admin app. Sign in as an administrator to manage the users, groups, roles, applications, agents,
              flows, projects and organization units on your ThunderID server.
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

              return <h2 className="admin-content-title">Hi, {name}</h2>;
            }}
          </User>
          <p className="admin-content-subtitle">
            Admin is a sample app that shows how an admin tool for ThunderID can be built with the ThunderID React SDK.
          </p>

          <h3 className="admin-section-title">What you can do</h3>
          <div className="admin-usecases">
            {SECTIONS.map(({text, title, to}) => (
              <Link key={to} to={to} className="admin-usecase">
                <div className="admin-usecase-title">{title}</div>
                <div className="admin-usecase-text">{text}</div>
              </Link>
            ))}
          </div>

          <h3 className="admin-section-title">How it is built</h3>
          <ul className="admin-notes">
            {SDK_NOTES.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </Shell>
      </SignedIn>
    </>
  );
}
