// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import { ThunderIDProvider } from '@thunderid/nextjs/server';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

// Inter, the variable font ThunderID's sign-in pages bundle, so the app and those pages match.
const inter = Inter({ subsets: ['latin'] });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Wayfinder Enterprise',
  description: 'Corporate travel for every company, signed in with ThunderID.',
};

const appUrl = process.env.WAYFINDER_APP_URL;
const apiResource = process.env.WAYFINDER_API_RESOURCE;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Reads NEXT_PUBLIC_THUNDERID_* and THUNDERID_* from the environment. Sign-in requests tokens for
            the app's resource server, and the profile comes from the ID token, so the user's token is never
            sent to the ThunderID management API. The admin components reach it through the app's own
            /api/admin routes instead, which pin every call to the signed-in admin's company. */}
        <ThunderIDProvider
          signInOptions={{ resource: apiResource }}
          preferences={{
            user: { fetchUserProfile: false },
            // The ThunderID components use the app's own palette, font, corner radius and shadows from
            // globals.css. The app has no dark mode, so the components stay light too.
            theme: {
              mode: 'light',
              overrides: {
                borderRadius: { large: '14px', medium: '8px', small: '6px' },
                colors: {
                  background: { body: { main: '#f6f8fb' }, surface: '#ffffff' },
                  border: '#dbe3ee',
                  error: { contrastText: '#ffffff', light: '#fff5f5', main: '#b91c1c' },
                  info: { contrastText: '#ffffff', light: '#e8efff', main: '#1d4ed8' },
                  primary: { contrastText: '#ffffff', dark: '#1e40af', main: '#1d4ed8' },
                  success: { contrastText: '#ffffff', light: '#eefbf4', main: '#047857' },
                  text: { primary: '#0f172a', secondary: '#64748b' },
                  warning: { contrastText: '#ffffff', light: '#fff8eb', main: '#a15c07' },
                },
                shadows: {
                  large: '0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px rgba(15, 23, 42, 0.06)',
                  medium: '0 10px 28px rgba(15, 23, 42, 0.05)',
                  small: '0 1px 2px rgba(15, 23, 42, 0.04)',
                },
                typography: { fontFamily: inter.style.fontFamily },
              },
            },
          }}
          endpoints={{
            // The member pickers also list agents. Pointing them here keeps the admin's token in the app;
            // the route serves no agents.
            agents: `${appUrl}/api/admin/agents`,
            connections: `${appUrl}/api/admin/connections`,
            flows: `${appUrl}/api/admin/flows`,
            groups: `${appUrl}/api/admin/groups`,
            roles: `${appUrl}/api/admin/roles`,
            userTypes: `${appUrl}/api/admin/user-types`,
            users: `${appUrl}/api/admin/users`,
          }}
        >
          {children}
        </ThunderIDProvider>
      </body>
    </html>
  );
}
