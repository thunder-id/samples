// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ChangeCredential, User, UserIcon, UserProfile} from '@thunderid/react';
import {useState, type ComponentType, type ReactElement} from 'react';
import {useSearchParams} from 'react-router';

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

// SDK icon, sized to match the other 20px icons.
function PersonIcon(): ReactElement {
  return <UserIcon width={20} height={20} strokeWidth={1.75} aria-hidden="true" />;
}

function ShieldIcon(): ReactElement {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ChevronIcon(): ReactElement {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

type Tab = 'home' | 'personal' | 'security';

interface TabItem {
  id: Tab;
  label: string;
  icon: ComponentType;
}

const TABS: TabItem[] = [
  {id: 'home', label: 'Home', icon: HomeIcon},
  {id: 'personal', label: 'Personal info', icon: PersonIcon},
  {id: 'security', label: 'Security', icon: ShieldIcon},
];

interface Credential {
  attribute: string;
  title: string;
  description: string;
  cta: string;
}

// Add new credential types here; each one gets its own card on the Security tab.
const CREDENTIALS: Credential[] = [
  {attribute: 'password', title: 'Password', description: 'Used to sign in to your account.', cta: 'Change password'},
];

function CredentialCard({attribute, title, description, cta}: Credential): ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const close = (): void => setOpen(false);

  return (
    <div className="account-security-card">
      <div className="account-security-card-row">
        <div>
          <div className="account-security-card-title">{title}</div>
          <div className="account-security-card-desc">{description}</div>
        </div>
        <button
          type="button"
          className="account-security-card-cta"
          aria-expanded={open}
          onClick={() => (open ? close() : setOpen(true))}
        >
          {cta}
          <span className={`account-security-card-chevron${open ? ' account-security-card-chevron--open' : ''}`}>
            <ChevronIcon />
          </span>
        </button>
      </div>
      {open && (
        <div className="account-security-card-form">
          <ChangeCredential attribute={attribute} title="" onSuccess={close} />
        </div>
      )}
    </div>
  );
}

interface Tile {
  id: Tab;
  icon: ComponentType;
  // Each tone has a matching `account-tile-icon--<tone>` class in App.css.
  tone: 'blue' | 'green';
  title: string;
  description: string;
}

const TILES: Tile[] = [
  {
    id: 'personal',
    icon: PersonIcon,
    tone: 'blue',
    title: 'Personal info',
    description: 'Name, email, phone, and profile photo',
  },
  {id: 'security', icon: ShieldIcon, tone: 'green', title: 'Security', description: 'Password and other credentials'},
];

const isTab = (value: string | null): value is Tab => TABS.some((t) => t.id === value);

// Google Account-style layout: a persistent left nav switching between tabs of
// content on the right, rather than a single scrolling page or a modal.
export default function AccountPage(): ReactElement {
  const [searchParams, setSearchParams] = useSearchParams();
  // The URL is the source of truth, so browser back/forward also switch tabs.
  const requestedTab: string | null = searchParams.get('tab');
  const tab: Tab = isTab(requestedTab) ? requestedTab : 'home';

  const selectTab = (id: Tab): void => {
    setSearchParams(id === 'home' ? {} : {tab: id});
  };

  return (
    <div className="account-page">
      <aside className="account-sidebar">
        <h1 className="account-sidebar-title">Account</h1>
        <nav className="account-nav">
          {TABS.map(({id, label, icon: Icon}) => (
            <button
              key={id}
              type="button"
              className={`account-nav-item${tab === id ? ' account-nav-item--active' : ''}`}
              aria-current={tab === id ? 'page' : undefined}
              onClick={() => selectTab(id)}
            >
              <Icon />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="account-content">
        <div className="account-content-inner">
          {tab === 'home' && (
            <User>
              {(user) => {
                const givenName: string =
                  [user?.givenName, user?.given_name, user?.displayName, user?.username].find(
                    (value: unknown): value is string => typeof value === 'string' && value.length > 0,
                  ) ?? 'there';

                return (
                  <>
                    <h2 className="account-content-title">Hi, {givenName}</h2>
                    <p className="account-content-subtitle">Manage your info and security across ThunderID apps.</p>
                    <div className="account-tiles">
                      {TILES.map(({id, icon: Icon, tone, title, description}) => (
                        <button key={id} type="button" className="account-tile" onClick={() => selectTab(id)}>
                          <span className={`account-tile-icon account-tile-icon--${tone}`}>
                            <Icon />
                          </span>
                          <span className="account-tile-title">{title}</span>
                          <span className="account-tile-desc">{description}</span>
                        </button>
                      ))}
                    </div>
                  </>
                );
              }}
            </User>
          )}

          {tab === 'personal' && (
            <>
              <h2 className="account-content-title">Personal info</h2>
              <p className="account-content-subtitle">Manage the basic profile info others may see.</p>
              <UserProfile />
            </>
          )}

          {tab === 'security' && (
            <>
              <h2 className="account-content-title">Security</h2>
              <p className="account-content-subtitle">Manage your password and other credentials.</p>
              <div className="account-security-list">
                {CREDENTIALS.map((credential) => (
                  <CredentialCard key={credential.attribute} {...credential} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
