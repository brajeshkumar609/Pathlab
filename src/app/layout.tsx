/**
 * Root Layout
 * 
 * Main layout wrapper for all pages.
 * Sets up theme provider, metadata, and global styling.
 */

import type { Metadata } from 'next'
import type React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pathlab - Laboratory Management System',
  description:
    'Production-ready multi-tenant pathology laboratory management system. Complete solution for patient management, test processing, and report generation.',
  applicationName: 'Pathlab',
  authors: [{ name: 'Pathlab Team' }],
  generator: 'Next.js',
  keywords: [
    'pathology',
    'laboratory',
    'management',
    'SaaS',
    'healthcare',
    'reports',
    'patient management',
  ],
  openGraph: {
    type: 'website',
    title: 'Pathlab - Laboratory Management System',
    description: 'Production-ready pathology laboratory management system',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {/* Theme provider and global providers will be added in Phase 2 */}
        {children}
      </body>
    </html>
  )
}
