<script setup>
import { ref } from 'vue'

defineProps({
  missing: { type: Array, required: true },
})

const dark = ref(false)
const copiedField = ref(null)
const origin = typeof window !== 'undefined' ? window.location.origin : ''

function toggleDark() {
  dark.value = !dark.value
}

async function handleCopy(field) {
  try {
    await navigator.clipboard.writeText(origin)
    copiedField.value = field
    setTimeout(() => { copiedField.value = null }, 1500)
  } catch {
    // Clipboard API unavailable (e.g. insecure context) — ignore.
  }
}
</script>

<template>
  <div :class="['app', { dark }]">
    <nav class="nav">
      <a class="nav-logo" href="/">
        <svg width="24" height="24" viewBox="0 0 196.32 170.02" aria-hidden="true">
          <path fill="#42b883" d="M120.83 0L98.16 39.26 75.49 0H0l98.16 170.02L196.32 0h-75.49z" />
          <path fill="#35495e" d="M120.83 0L98.16 39.26 75.49 0H39.26l58.9 102.01L157.06 0h-36.23z" />
        </svg>
        <span class="wordmark-name">Quickstart</span>
      </a>

      <div class="nav-actions">
        <button
          class="dark-toggle"
          @click="toggleDark"
          :aria-label="dark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <svg v-if="dark" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </nav>

    <div class="hero">
      <div class="hero-inner">
        <div class="hero-mark">
          <svg width="35" height="44" viewBox="0 0 207 257" fill="none" aria-hidden="true">
            <path d="M55.4763 26.4391L58.8866 0H0V26.4391H55.4763Z" fill="#05213F" />
            <path d="M39.8438 147.407L49.5455 72.2839H4.9909e-05V256.743H60.5602L80.048 147.407H39.8438Z" fill="#3688FF" />
            <path d="M192.42 59.361C182.782 40.2307 168.929 25.5705 150.903 15.3381C145.501 12.2662 139.761 9.6605 133.703 7.5208L115.401 103.702H159.757L76.2987 256.743H83.3735C109.449 256.743 131.69 251.574 150.14 241.236C168.569 230.897 182.634 216.131 192.356 196.959C202.058 177.765 206.909 154.8 206.909 128.043C206.909 101.286 202.079 78.5123 192.441 59.3821L192.42 59.361Z" fill="#3688FF" />
          </svg>
        </div>

        <div class="hero-badge config-badge">
          <span class="hero-badge-line"></span>
          <span>Setup required</span>
          <span class="hero-badge-line"></span>
        </div>

        <h1 class="hero-title">Configuration needed</h1>

        <p class="hero-subtitle">
          This quickstart can't reach ThunderID yet. Follow the steps below,
          then restart the dev server.
        </p>

        <div class="config-step">
          <div class="config-step-label">Step 1 &middot; Set environment variables</div>

          <ul class="config-list">
            <li v-for="key in missing" :key="key" class="config-list-item">{{ key }}</li>
          </ul>

          <p class="config-hint">
            Copy <code>.env.example</code> to <code>.env</code>, fill in the
            values from your ThunderID application, then run <code>npm run dev</code> again.
          </p>
        </div>

        <div class="config-step">
          <div class="config-step-label">Step 2 &middot; Allow this origin for CORS</div>

          <div class="config-box">
            <p class="config-box-body">
              Sign-in requests from this origin will be blocked by the browser
              until it's added to your ThunderID deployment's allowed CORS
              origins. In the <strong>ThunderID Console</strong>, go to
              <strong> Settings &rarr; CORS &rarr; Allowed origins</strong> and
              add it.
            </p>

            <div class="config-value-row">
              <code class="config-value">{{ origin }}</code>
              <button class="token-copy-btn" @click="handleCopy('cors')">
                {{ copiedField === 'cors' ? 'Copied!' : 'Copy' }}
              </button>
            </div>
          </div>
        </div>

        <div class="config-step">
          <div class="config-step-label">Step 3 &middot; Register redirect URIs</div>

          <div class="config-box">
            <p class="config-box-body">
              This origin also doubles as this app's Authorized redirect URI
              and Post-Logout Redirect URI. In the <strong>ThunderID
              Console</strong>, open this application and go to
              <strong> Advanced Settings &rarr; OAuth2 Configuration</strong>,
              then add it to both fields below.
            </p>

            <div class="config-value-group">
              <div>
                <div class="config-value-label">Authorized redirect URI</div>
                <div class="config-value-row">
                  <code class="config-value">{{ origin }}</code>
                  <button class="token-copy-btn" @click="handleCopy('redirect')">
                    {{ copiedField === 'redirect' ? 'Copied!' : 'Copy' }}
                  </button>
                </div>
              </div>
              <div>
                <div class="config-value-label">Post-Logout Redirect URI</div>
                <div class="config-value-row">
                  <code class="config-value">{{ origin }}</code>
                  <button class="token-copy-btn" @click="handleCopy('logout')">
                    {{ copiedField === 'logout' ? 'Copied!' : 'Copy' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p class="config-docs-note">
          Need more info? Take a look at the
          <a href="https://thunderid.dev/docs/next/getting-started/connect-your-application/vue/" target="_blank" rel="noopener noreferrer">Vue quickstart guide.</a>
        </p>
      </div>
    </div>
  </div>
</template>
