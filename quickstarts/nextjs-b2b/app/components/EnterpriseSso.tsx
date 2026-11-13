'use client'

import { FormEvent, useState } from 'react'
import { FlowVariablesForm, useManagementRequestConfig, useThunderID } from '@thunderid/nextjs'

const FIELDS = [
  { name: 'name', label: 'Name', placeholder: 'Northstar SSO' },
  { name: 'clientId', label: 'Client ID' },
  { name: 'clientSecret', label: 'Client secret', type: 'password' },
  { name: 'authorizationEndpoint', label: 'Authorization endpoint', type: 'url' },
  { name: 'tokenEndpoint', label: 'Token endpoint', type: 'url' },
  { name: 'userInfoEndpoint', label: 'User info endpoint', type: 'url' },
  { name: 'jwksEndpoint', label: 'JWKS endpoint', type: 'url' },
  { name: 'issuer', label: 'Issuer' },
]

interface EnterpriseSsoProps {
  flowId: string
  ouId: string
  ouName?: string
}

/**
 * Lets a company admin plug in the company's own identity provider. The admin adds an OpenID Connect
 * connection owned by the company, then picks it as the company's value of the shared sign-in flow's
 * `enterpriseIdp` variable with `FlowVariablesForm`. The SDK's management fetcher sends both calls from
 * the server with the admin's session, so ThunderID applies them to the company the token names.
 */
export default function EnterpriseSso({ flowId, ouId, ouName }: EnterpriseSsoProps) {
  const { baseUrl } = useThunderID()
  const { baseUrl: managementBaseUrl, fetcher, url } = useManagementRequestConfig('connections')
  const connectionsUrl = url ?? `${managementBaseUrl}/connections`
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Changes after a connection is added, so the form loads the connections again.
  const [version, setVersion] = useState(0)
  const callbackUrl = `${baseUrl}/gate/callback`

  const addConnection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const response = await (fetcher ?? fetch)(`${connectionsUrl}/oidc`, {
      method: 'POST',
      body: JSON.stringify({
        ...Object.fromEntries(new FormData(event.currentTarget)),
        ouId,
        redirectUri: callbackUrl,
        scopes: ['openid', 'profile', 'email'],
      }),
    })
    if (!response.ok) {
      const body = await response.json().catch(() => undefined)
      setError(body?.description?.defaultValue ?? 'Could not add the identity provider.')
      return
    }
    setIsAdding(false)
    setVersion((current) => current + 1)
  }

  return (
    <section className="section">
      <div className="section-label">Enterprise SSO</div>
      <h2 className="section-title">Plug in {ouName}'s identity provider</h2>
      <p className="section-desc">
        Register an OpenID Connect application in your identity provider with the callback URL{' '}
        <code>{callbackUrl}</code>, add it here, and select it. Employees then choose{' '}
        <strong>Sign in with enterprise SSO</strong> and enter your organization handle.
      </p>

      {isAdding ? (
        <form className="form" onSubmit={addConnection}>
          {error && <p className="error">{error}</p>}
          {FIELDS.map((field) => (
            <label key={field.name}>
              {field.label}
              <input name={field.name} type={field.type ?? 'text'} placeholder={field.placeholder} required />
            </label>
          ))}
          <div className="form-actions">
            <button type="button" className="btn-outline" onClick={() => setIsAdding(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add identity provider
            </button>
          </div>
        </form>
      ) : (
        <FlowVariablesForm
          key={version}
          flowId={flowId}
          ouId={ouId}
          ouName={ouName}
          showScopeNotice
          title="Enterprise SSO connection"
          onCreateConnection={() => setIsAdding(true)}
        />
      )}
    </section>
  )
}
