/**
 * Global Providers Component
 * 
 * Wraps the application with necessary context providers.
 */

'use client'

import React from 'react'
import { AuthProvider } from '@/lib/auth-context'
import { OrganizationProvider } from '@/lib/organization-context'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <OrganizationProvider>
        {children}
      </OrganizationProvider>
    </AuthProvider>
  )
}
