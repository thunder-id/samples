'use client'

import { SignInButton, SignedIn, SignedOut, useThunderID } from '@thunderid/nextjs'
import EnterpriseSso from './EnterpriseSso'
import ThunderMark from './ThunderMark'

type Claims = Record<string, unknown>

function BuildingIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" /><path d="M9 21V9" />
    </svg>
  )
}

function AtIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function Hero() {
  return (
    <div className="hero">
      <div className="hero-inner">
        <div className="hero-mark">
          <ThunderMark height={44} />
        </div>
        <div className="hero-badge">
          <span className="hero-badge-line" />
          <span>B2B Quickstart</span>
          <span className="hero-badge-line" />
        </div>
        <h1 className="hero-title">Sign in to your company</h1>
        <p className="hero-subtitle">
          Every company is an organization in ThunderID. Register yours, plug in its identity provider, and switch
          between the companies you belong to.
        </p>
        <div className="hero-ctas">
          <SignInButton>
            {({ signIn, isLoading }) => (
              <button className="btn-primary" onClick={() => void signIn()} disabled={isLoading}>
                Sign in or register a company
              </button>
            )}
          </SignInButton>
        </div>
        <hr className="hero-divider" />
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">Organizations</span>
            <span className="stat-label">One per company</span>
          </div>
          <div className="stat">
            <span className="stat-value">Roles</span>
            <span className="stat-label">In every token</span>
          </div>
          <div className="stat">
            <span className="stat-value">Enterprise SSO</span>
            <span className="stat-label">Per company</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TokenClaims({ claims }: { claims: Claims }) {
  const roles: string[] = Array.isArray(claims.roles) ? claims.roles : []

  return (
    <section className="section">
      <div className="section-label">Access token</div>
      <p className="section-desc">The organization, roles and scopes ThunderID issued for this company.</p>
      <dl className="claims">
        <dt>ouName</dt>
        <dd>{String(claims.ouName ?? '')}</dd>
        <dt>ouHandle</dt>
        <dd>{String(claims.ouHandle ?? '')}</dd>
        <dt>ouId</dt>
        <dd>{String(claims.ouId ?? '')}</dd>
        <dt>roles</dt>
        <dd>
          <span className="chips">
            {roles.length > 0 ? roles.map((role) => <span key={role} className="chip">{role}</span>) : 'none'}
          </span>
        </dd>
        <dt>scope</dt>
        <dd>{String(claims.scope ?? '')}</dd>
      </dl>
      <details className="code-box">
        <summary>All claims</summary>
        <pre>{JSON.stringify(claims, null, 2)}</pre>
      </details>
    </section>
  )
}

export default function Workspace({ claims }: { claims: Claims | null }) {
  const { currentOrganizationUnit, user } = useThunderID()
  const roles: string[] = Array.isArray(user?.roles) ? user.roles : []
  const name: string = user?.username ?? 'there'
  // Only an admin holds the org permission that managing the company needs.
  const isAdmin = String(claims?.scope ?? '')
    .split(' ')
    .includes('org')

  return (
    <>
      <SignedOut>
        <Hero />
      </SignedOut>

      <SignedIn>
        <main className="home-main">
          <div className="home-greeting">
            <div className="avatar">{name.charAt(0)}</div>
            <div>
              <h1 className="home-greeting-name">Welcome, {name}.</h1>
              <div className="home-greeting-meta">
                {user?.email && <span>{user.email}</span>}
                {user?.email && <span className="home-dot" />}
                <span className="home-session-active">
                  <span className="home-session-dot" />
                  Signed in to {currentOrganizationUnit?.name}
                </span>
              </div>
            </div>
          </div>

          <div className="home-stats">
            <div className="home-stat">
              <div className="home-stat-icon"><BuildingIcon /></div>
              <div>
                <div className="home-stat-value">{currentOrganizationUnit?.name}</div>
                <div className="home-stat-label">Company</div>
              </div>
            </div>
            <div className="home-stat home-stat--bordered">
              <div className="home-stat-icon"><AtIcon /></div>
              <div>
                <div className="home-stat-value home-stat-value--mono">{currentOrganizationUnit?.handle}</div>
                <div className="home-stat-label">Handle</div>
              </div>
            </div>
            <div className="home-stat home-stat--bordered">
              <div className="home-stat-icon"><ShieldIcon /></div>
              <div>
                <div className="home-stat-value">{roles.length > 0 ? roles.join(', ') : 'None'}</div>
                <div className="home-stat-label">Your roles</div>
              </div>
            </div>
          </div>

          {claims && <TokenClaims claims={claims} />}

          {isAdmin && currentOrganizationUnit && (
            <EnterpriseSso
              key={currentOrganizationUnit.id}
              flowId={process.env.NEXT_PUBLIC_THUNDERID_SIGN_IN_FLOW_ID ?? ''}
              ouId={currentOrganizationUnit.id}
              ouName={currentOrganizationUnit.name}
            />
          )}
        </main>
      </SignedIn>
    </>
  )
}
