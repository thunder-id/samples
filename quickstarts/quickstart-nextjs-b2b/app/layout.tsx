import type { Metadata } from 'next'
import { Suspense, type ReactNode } from 'react'
import { connection } from 'next/server'
import { ThunderIDProvider } from '@thunderid/nextjs/server'
import './globals.css'

export const metadata: Metadata = {
  title: 'ThunderID Next.js B2B Quickstart',
  description: 'Companies sign up, switch between organizations and plug in their own identity provider',
}

// The provider reads the session cookie, so it renders for each request rather than at build time.
async function SessionProvider({ children }: { children: ReactNode }) {
  await connection()
  // Reads NEXT_PUBLIC_THUNDERID_* and THUNDERID_* from the environment. The user comes from the ID
  // token, which names the company the session signed in to.
  // The SDK's components follow the `dark` class the header's toggle sets on <html>.
  return (
    <ThunderIDProvider preferences={{ theme: { mode: 'class' }, user: { fetchUserProfile: false } }}>
      {children}
    </ThunderIDProvider>
  )
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense>
          <SessionProvider>{children}</SessionProvider>
        </Suspense>
      </body>
    </html>
  )
}
