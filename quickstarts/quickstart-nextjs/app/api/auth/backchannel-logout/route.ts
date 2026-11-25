import {backchannelLogout} from '@thunderid/nextjs/server'

// ThunderID posts a logout token here when the user's session ends somewhere else, such as a
// sign-out from another application. The SDK records the logout, and from then on this app treats
// the matching session cookie as signed out. Register this path as the application's
// Back-Channel Logout URI to use it (see the README).
export const {POST} = backchannelLogout()
