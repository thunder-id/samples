// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

'use client';

import { FlowVariablesForm, useManagementRequestConfig } from '@thunderid/nextjs';
import { useEffect, useState } from 'react';
import AddIdentityProvider from './AddIdentityProvider';
import Icon from './Icon';

interface EnterpriseSsoProps {
  callbackUrl: string;
  ouHandle?: string;
  ouId: string;
  ouName?: string;
  signInFlowId: string;
}

interface IdentityProvider {
  id: string;
  name: string;
  type: string;
}

/**
 * The company's enterprise SSO. `FlowVariablesForm` from the ThunderID SDK sets the company's value of the
 * shared sign-in flow's `enterpriseIdp` variable, picking from the connections the company owns or was
 * shared. The side panel lists those identity providers and adds an OpenID Connect one owned by the
 * company. Both use the SDK's management request config: the connections URL the app configured (its own
 * /api/admin route) and the SDK's fetcher, which sends the request from the server with the user's session.
 */
export default function EnterpriseSso({ callbackUrl, ouHandle, ouId, ouName, signInFlowId }: EnterpriseSsoProps) {
  const { baseUrl, fetcher: sdkFetcher, url } = useManagementRequestConfig('connections');
  const connectionsUrl = url ?? `${baseUrl}/connections`;
  // The SDK always supplies its fetcher; the browser's fetch also reaches the app's own route by its cookie.
  const fetcher = sdkFetcher ?? fetch;
  const [isAdding, setIsAdding] = useState(false);
  // Changes after an identity provider is added, so the list and the form load the connections again.
  const [connectionsVersion, setConnectionsVersion] = useState(0);
  const [providers, setProviders] = useState<IdentityProvider[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;
    const query = new URLSearchParams({ category: 'identity-provider', filter: `ouId eq "${ouId}"`, limit: '100' });
    fetcher(`${connectionsUrl}?${query}`, { method: 'GET' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const page: { connections?: IdentityProvider[] } = await response.json();
        if (isCurrent) {
          setListError(null);
          setProviders(page.connections ?? []);
        }
      })
      .catch(() => isCurrent && setListError('Could not load your identity providers.'));
    return () => {
      isCurrent = false;
    };
  }, [connectionsUrl, fetcher, ouId, connectionsVersion]);

  return (
    <div className="stack">
      <section className="panel">
        <div className="card-header">
          <div>
            <h2>Set up in four steps</h2>
            <p className="muted">Connect once, and every employee can sign in with their company account.</p>
          </div>
        </div>
        <ol className="stepper">
          <li>
            <span className="step-number">1</span>
            <strong>Register Wayfinder</strong>
            <p className="muted">In your identity provider, register an OpenID Connect application with the callback URL below.</p>
          </li>
          <li>
            <span className="step-number">2</span>
            <strong>Add the identity provider</strong>
            <p className="muted">Enter that application&apos;s client ID, secret and endpoints here.</p>
          </li>
          <li>
            <span className="step-number">3</span>
            <strong>Select and save</strong>
            <p className="muted">Choose it as your company&apos;s enterprise SSO connection.</p>
          </li>
          <li>
            <span className="step-number">4</span>
            <strong>Employees sign in</strong>
            <p className="muted">
              They choose <strong>Sign in with enterprise SSO</strong> and enter{' '}
              <code>{ouHandle ?? 'your organization handle'}</code>. First-time employees join as members.
            </p>
          </li>
        </ol>
        <CopyField label="Callback URL" value={callbackUrl} />
      </section>

      <div className="two-column">
        <section className="panel">
          <FlowVariablesForm
            key={connectionsVersion}
            flowId={signInFlowId}
            ouId={ouId}
            ouName={ouName}
            showScopeNotice={Boolean(ouName)}
            title="Enterprise SSO connection"
            onCreateConnection={() => setIsAdding(true)}
          />
        </section>

        <section className="panel">
          {isAdding ? (
            <AddIdentityProvider
              callbackUrl={callbackUrl}
              connectionsUrl={connectionsUrl}
              fetcher={fetcher}
              onCancel={() => setIsAdding(false)}
              onCreated={() => {
                setIsAdding(false);
                setConnectionsVersion((version) => version + 1);
              }}
            />
          ) : (
            <>
              <div className="card-header">
                <div>
                  <h2>Identity providers</h2>
                  <p className="muted">Connections your company owns or was given.</p>
                </div>
                <button type="button" className="button solid small" onClick={() => setIsAdding(true)}>
                  <Icon name="plus" size={16} />
                  Add identity provider
                </button>
              </div>
              {listError && (
                <p className="alert error" role="alert">
                  {listError}
                </p>
              )}
              {!listError && providers === null && <p className="muted">Loading identity providers…</p>}
              {providers?.length === 0 && (
                <div className="empty-state">
                  <span className="empty-icon">
                    <Icon name="key" size={22} />
                  </span>
                  <strong>No identity provider yet</strong>
                  <p className="muted">
                    Add your OpenID Connect identity provider, then select it as the enterprise SSO connection.
                  </p>
                </div>
              )}
              {providers && providers.length > 0 && (
                <ul className="provider-list">
                  {providers.map((provider) => (
                    <li key={provider.id}>
                      <span className="provider-mark" aria-hidden="true">
                        {provider.name.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="provider-text">
                        <strong>{provider.name}</strong>
                        <span className="muted">
                          {provider.type.toLowerCase() === 'oidc' ? 'OpenID Connect' : provider.type}
                        </span>
                      </span>
                      <span className="badge muted">{provider.type.toUpperCase()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

/** A read-only value with a button that copies it, for the URL the admin pastes into their identity provider. */
function CopyField({ label, value }: { label: string; value: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // The value stays on screen to copy by hand.
    }
  };

  return (
    <div className="copy-field">
      <span className="copy-label">{label}</span>
      <code>{value}</code>
      <button type="button" className="button ghost small" onClick={() => void copy()}>
        <Icon name={isCopied ? 'check' : 'copy'} size={16} />
        {isCopied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
