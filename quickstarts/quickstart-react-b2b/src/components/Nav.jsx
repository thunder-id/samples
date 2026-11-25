import { OrganizationUnitSwitcher, SignInButton, SignOutButton, SignedIn, SignedOut } from '@thunderid/react'
import ReactLogo from './icons/ReactLogo'

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

export default function Nav({ dark, onToggleDark }) {
  return (
    <nav className="nav">
      <a href="/" className="nav-logo">
        <ReactLogo size={24} />
        <span className="wordmark">
          <span className="wordmark-name">Quickstart</span>
          <span className="wordmark-sub">B2B</span>
        </span>
      </a>
      <div className="nav-actions">
        <SignedIn>
          {/* Lists the companies the user belongs to and switches the session to the one picked. A switch
              that falls back to a redirect is a new sign-in, so it names the same resource server as the
              first one. */}
          <OrganizationUnitSwitcher
            scope="siblings"
            switchOptions={{ resource: import.meta.env.VITE_THUNDERID_RESOURCE }}
          />
        </SignedIn>
        <button
          className="dark-toggle"
          onClick={onToggleDark}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
        <SignedIn>
          <SignOutButton>
            {({ signOut, isLoading }) => (
              <button className="btn-ghost" onClick={() => void signOut()} disabled={isLoading}>
                Sign out
              </button>
            )}
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <SignInButton>
            {({ signIn, isLoading }) => (
              <button className="btn-primary" onClick={() => void signIn()} disabled={isLoading}>
                Sign in
              </button>
            )}
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  )
}
