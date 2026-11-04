// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {ThunderIDProvider} from '@thunderid/react';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import ConfigNotice from './components/ConfigNotice';
import {baseUrl, clientId, resource, scopes} from './config';
import {renderers} from './renderers';
import './index.css';

const missingEnvVars: string[] = [
  !baseUrl && 'VITE_THUNDERID_BASE_URL',
  !clientId && 'VITE_THUNDERID_CLIENT_ID',
].filter((key): key is string => Boolean(key));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {baseUrl && clientId ? (
      <ThunderIDProvider
        baseUrl={baseUrl}
        clientId={clientId}
        scopes={scopes}
        signInOptions={{resource}}
        extensions={{components: {renderers}}}
      >
        <App />
      </ThunderIDProvider>
    ) : (
      <ConfigNotice missing={missingEnvVars} />
    )}
  </StrictMode>,
);
