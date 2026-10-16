// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {useState, type ReactElement} from 'react';
import ThemeToggle from './ThemeToggle';
import ThunderMark from './ThunderMark';

type CopyField = 'cors' | 'redirect' | 'logout';

interface ConfigNoticeProps {
  missing: string[];
}

export default function ConfigNotice({missing}: ConfigNoticeProps): ReactElement {
  const [dark, setDark] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<CopyField | null>(null);
  const origin: string = typeof window !== 'undefined' ? window.location.origin : '';

  const toggleDark = (): void => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : '');
  };

  const handleCopy = async (field: CopyField): Promise<void> => {
    try {
      await navigator.clipboard.writeText(origin);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — ignore.
    }
  };

  const renderCopyButton = (field: CopyField): ReactElement => (
    <button className="token-copy-btn" onClick={() => void handleCopy(field)}>
      {copiedField === field ? 'Copied!' : 'Copy'}
    </button>
  );

  return (
    <div className="app" data-theme={dark ? 'dark' : undefined}>
      <nav className="nav">
        <span className="nav-logo">
          <ThunderMark height={24} dark={dark} />
          <span className="wordmark-name">Manage</span>
        </span>
        <div className="nav-actions">
          <ThemeToggle dark={dark} onToggle={toggleDark} />
        </div>
      </nav>

      <div className="hero">
        <div className="hero-inner">
          <div className="hero-mark">
            <ThunderMark height={40} dark={dark} />
          </div>

          <div className="hero-badge config-badge">
            <span className="hero-badge-line" />
            <span>Setup required</span>
            <span className="hero-badge-line" />
          </div>

          <h1 className="hero-title">Configuration needed</h1>

          <p className="hero-subtitle">
            ThunderID Manage can&apos;t reach ThunderID yet. Follow the steps below, then restart the dev server.
          </p>

          <div className="config-step">
            <div className="config-step-label">Step 1 &middot; Set environment variables</div>

            <ul className="config-list">
              {missing.map((key) => (
                <li key={key} className="config-list-item">
                  {key}
                </li>
              ))}
            </ul>

            <p className="config-hint">
              Copy <code>.env.example</code> to <code>.env</code>, fill in the values from your ThunderID application,
              then run <code>pnpm dev</code> again.
            </p>
          </div>

          <div className="config-step">
            <div className="config-step-label">Step 2 &middot; Allow this origin for CORS</div>

            <div className="config-box">
              <p className="config-box-body">
                Sign-in requests from this origin will be blocked by the browser until it&apos;s added to your ThunderID
                deployment&apos;s allowed CORS origins. In the <strong>ThunderID Console</strong>, go to
                <strong> Settings &rarr; CORS &rarr; Allowed origins</strong> and add it.
              </p>

              <div className="config-value-row">
                <code className="config-value">{origin}</code>
                {renderCopyButton('cors')}
              </div>
            </div>
          </div>

          <div className="config-step">
            <div className="config-step-label">Step 3 &middot; Register redirect URIs</div>

            <div className="config-box">
              <p className="config-box-body">
                This origin also doubles as this app&apos;s Authorized redirect URI and Post-Logout Redirect URI. In the{' '}
                <strong>ThunderID Console</strong>, open this application and go to
                <strong> Advanced Settings &rarr; OAuth2 Configuration</strong>, then add it to both fields below.
              </p>

              <div className="config-value-group">
                <div>
                  <div className="config-value-label">Authorized redirect URI</div>
                  <div className="config-value-row">
                    <code className="config-value">{origin}</code>
                    {renderCopyButton('redirect')}
                  </div>
                </div>
                <div>
                  <div className="config-value-label">Post-Logout Redirect URI</div>
                  <div className="config-value-row">
                    <code className="config-value">{origin}</code>
                    {renderCopyButton('logout')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="config-docs-note">
            Need more info? Take a look at the{' '}
            <a
              href="https://thunderid.dev/docs/next/getting-started/connect-your-application/react/"
              target="_blank"
              rel="noopener noreferrer"
            >
              React quickstart guide.
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
