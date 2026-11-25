import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThunderIDProvider } from '@thunderid/react'
import App from './App.jsx'
import './App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThunderIDProvider
      clientId={import.meta.env.VITE_THUNDERID_CLIENT_ID}
      baseUrl={import.meta.env.VITE_THUNDERID_BASE_URL}
      // `ou` and `roles` put the company and the user's roles there into the tokens. `org` asks for
      // the permission a company admin needs to manage their company, such as its identity provider.
      // `device_sso` returns a device secret, which a switch exchanges for the other company's tokens
      // without leaving the page.
      scopes={['openid', 'profile', 'email', 'roles', 'ou', 'org', 'device_sso']}
      // `org` is a permission of the System resource server, so a sign-in names that resource server.
      signInOptions={{ resource: import.meta.env.VITE_THUNDERID_RESOURCE }}
      // Read the user from the ID token, which names the company the session signed in to.
      preferences={{ user: { fetchUserProfile: false } }}
    >
      <App />
    </ThunderIDProvider>
  </StrictMode>
)
