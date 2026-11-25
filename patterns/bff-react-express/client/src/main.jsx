import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThunderIDProvider } from '@thunderid/react'
import App from './App.jsx'
import './index.css'

// Sign-in runs on the Express BFF in ../server, which holds the tokens behind an HttpOnly cookie,
// so the app needs no client ID and never holds a token.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThunderIDProvider
      // The BFF is on this origin under /api/auth, the default for every backend endpoint.
      endpoints={{ backend: {} }}
      // Ask the BFF every 30 seconds whether the session still exists, so a back-channel logout
      // signs this app out while it is open.
      session={{ checkInterval: 30 }}
    >
      <App />
    </ThunderIDProvider>
  </StrictMode>
)
