import { useState } from 'react'
import ThunderMark from './ThunderMark'
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

export default function ConfigNotice({ missing }) {
  const [dark, setDark] = useState(false)
  const [copiedField, setCopiedField] = useState(null)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.setAttribute('data-theme', next ? 'dark' : '')
  }

  const handleCopy = async (field) => {
    try {
      await navigator.clipboard.writeText(origin)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 1500)
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — ignore.
    }
  }

  return (
    <div className="app">
      <nav className="nav">
        <span className="nav-logo">
          <ReactLogo size={24} />
          <span className="wordmark-name">Quickstart</span>
        </span>
        <div className="nav-actions">
          <button
            className="dark-toggle"
            onClick={toggleDark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-mark">
            <ThunderMark height={40} />
          </div>

          <div className="hero-badge config-badge">
            <span className="hero-badge-line" />
            <span>Setup required</span>
            <span className="hero-badge-line" />
          </div>

          <h1 className="hero-title">Configuration needed</h1>

          <p className="hero-subtitle">
            This quickstart can't reach ThunderID yet. Follow the steps below,
            then restart the dev server.
          </p>

          <div className="config-step">
            <div className="config-step-label">Step 1 &middot; Set environment variables</div>

            <ul className="config-list">
              {missing.map((key) => (
                <li key={key} className="config-list-item">{key}</li>
              ))}
            </ul>

            <p className="config-hint">
              Copy <code>.env.example</code> to <code>.env</code>, fill in the
              values from your ThunderID application, then run <code>npm run dev</code> again.
            </p>
          </div>

          <div className="config-step">
            <div className="config-step-label">Step 2 &middot; Allow this origin for CORS</div>

            <div className="config-box">
              <p className="config-box-body">
                Sign-in requests from this origin will be blocked by the browser
                until it's added to your ThunderID deployment's allowed CORS
                origins. In the <strong>ThunderID Console</strong>, go to
                <strong> Settings &rarr; CORS &rarr; Allowed origins</strong> and
                add it.
              </p>

              <div className="config-value-row">
                <code className="config-value">{origin}</code>
                <button className="token-copy-btn" onClick={() => handleCopy('cors')}>
                  {copiedField === 'cors' ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className="config-step">
            <div className="config-step-label">Step 3 &middot; Register redirect URIs</div>

            <div className="config-box">
              <p className="config-box-body">
                This origin also doubles as this app's Authorized redirect URI
                and Post-Logout Redirect URI. In the <strong>ThunderID
                Console</strong>, open this application and go to
                <strong> Advanced Settings &rarr; OAuth2 Configuration</strong>,
                then add it to both fields below.
              </p>

              <div className="config-value-group">
                <div>
                  <div className="config-value-label">Authorized redirect URI</div>
                  <div className="config-value-row">
                    <code className="config-value">{origin}</code>
                    <button className="token-copy-btn" onClick={() => handleCopy('redirect')}>
                      {copiedField === 'redirect' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="config-value-label">Post-Logout Redirect URI</div>
                  <div className="config-value-row">
                    <code className="config-value">{origin}</code>
                    <button className="token-copy-btn" onClick={() => handleCopy('logout')}>
                      {copiedField === 'logout' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="config-docs-note">
            Need more info? Take a look at the{' '}
            <a href="https://thunderid.dev/docs/next/getting-started/connect-your-application/react/" target="_blank" rel="noopener noreferrer">
              React quickstart guide.
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
