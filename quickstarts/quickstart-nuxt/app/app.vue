<script setup>
const publicConfig = useRuntimeConfig().public.thunderid

// Redirect-based flow (NUXT_PUBLIC_THUNDERID_CLIENT_ID set) sends the user to
// ThunderID's hosted pages and needs a registered redirect URI. The default,
// native flow renders sign-in/sign-up inline via the app's own routes and
// needs an application ID instead — no redirect URI or CORS setup required.
const isRedirectFlow = Boolean(publicConfig?.clientId)

const REQUIRED_ENV_VARS = [
  { key: 'baseUrl', env: 'NUXT_PUBLIC_THUNDERID_BASE_URL' },
  ...(isRedirectFlow
    ? [{ key: 'clientId', env: 'NUXT_PUBLIC_THUNDERID_CLIENT_ID' }]
    : [
        { key: 'applicationId', env: 'NUXT_PUBLIC_THUNDERID_APPLICATION_ID' },
        { key: 'signInUrl', env: 'NUXT_PUBLIC_THUNDERID_SIGN_IN_URL' },
        { key: 'signUpUrl', env: 'NUXT_PUBLIC_THUNDERID_SIGN_UP_URL' },
      ]),
]
const missingEnvVars = REQUIRED_ENV_VARS.filter((v) => !publicConfig?.[v.key]).map((v) => v.env)
</script>

<template>
  <ConfigNotice v-if="missingEnvVars.length > 0" :missing="missingEnvVars" :is-redirect-flow="isRedirectFlow" />
  <ThunderIDRoot v-else>
    <NuxtPage />
  </ThunderIDRoot>
</template>
