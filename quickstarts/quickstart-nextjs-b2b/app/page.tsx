import { Suspense } from 'react'
import { thunderid } from '@thunderid/nextjs/server'
import Header from './components/Header'
import Workspace from './components/Workspace'

const decodePayload = (token: string): Record<string, unknown> =>
  JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'))

/**
 * Reads the access token on the server, so the app's browser code never receives it, and passes its claims to the
 * page. They change with every switch, because a switch signs the user in to another company and
 * replaces the session's tokens.
 */
async function SessionWorkspace() {
  const client = await thunderid()
  const sessionId = await client.getSessionId()
  const accessToken = sessionId ? await client.getAccessToken(sessionId).catch(() => undefined) : undefined

  return <Workspace claims={accessToken ? decodePayload(accessToken) : null} />
}

// The session is read per request, so it streams in behind a Suspense boundary of the page's own.
export default function Home() {
  return (
    <div className="app">
      <Header />
      <Suspense>
        <SessionWorkspace />
      </Suspense>
    </div>
  )
}
