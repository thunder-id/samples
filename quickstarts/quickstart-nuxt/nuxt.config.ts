// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@thunderid/nuxt'],
  thunderid: {
    // Serves POST /api/auth/backchannel-logout, so signing out elsewhere ends the session here.
    backchannelLogout: { enabled: true },
  },
  css: ['~/assets/styles.css'],
})
