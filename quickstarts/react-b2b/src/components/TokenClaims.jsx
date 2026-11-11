import { useEffect, useState } from 'react'
import { useThunderID } from '@thunderid/react'

const decodePayload = (token) => {
  const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  const bytes = Uint8Array.from(atob(payload), (char) => char.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes))
}

/**
 * Shows the access token's organization, roles and scopes. They change with every switch, because a
 * switch signs the user in to another company and replaces the tokens.
 */
export default function TokenClaims() {
  const { currentOrganizationUnit, getAccessToken } = useThunderID()
  const [claims, setClaims] = useState(null)

  useEffect(() => {
    getAccessToken()
      .then((token) => setClaims(decodePayload(token)))
      .catch(() => setClaims(null))
  }, [getAccessToken, currentOrganizationUnit?.id])

  if (!claims) {
    return null
  }

  return (
    <section className="section">
      <div className="section-label">Access token</div>
      <p className="section-desc">The organization, roles and scopes ThunderID issued for this company.</p>
      <dl className="claims">
        <dt>ouName</dt>
        <dd>{claims.ouName}</dd>
        <dt>ouHandle</dt>
        <dd>{claims.ouHandle}</dd>
        <dt>ouId</dt>
        <dd>{claims.ouId}</dd>
        <dt>roles</dt>
        <dd>
          <span className="chips">
            {(claims.roles ?? []).length > 0
              ? claims.roles.map((role) => <span key={role} className="chip">{role}</span>)
              : 'none'}
          </span>
        </dd>
        <dt>scope</dt>
        <dd>{claims.scope}</dd>
      </dl>
      <details className="code-box">
        <summary>All claims</summary>
        <pre>{JSON.stringify(claims, null, 2)}</pre>
      </details>
    </section>
  )
}
