/**
 * Organization Context
 * 
 * Provides the active organization context for multi-tenant data isolation.
 * Ensures all database queries are scoped to the current organization.
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuth } from './auth-context'
import type { Organization } from '@/types'

interface OrganizationContextType {
  organization: Organization | null
  organizationId: string | null
  loading: boolean
  error: string | null
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !user?.organizationId) {
      setOrganization(null)
      return
    }

    const fetchOrganization = async () => {
      try {
        setLoading(true)
        const orgDocRef = doc(db, 'organizations', user.organizationId)
        const orgDoc = await getDoc(orgDocRef)

        if (orgDoc.exists()) {
          setOrganization(orgDoc.data() as Organization)
        }
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch organization')
      } finally {
        setLoading(false)
      }
    }

    fetchOrganization()
  }, [isAuthenticated, user?.organizationId])

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        organizationId: user?.organizationId || null,
        loading,
        error,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within OrganizationProvider')
  }
  return context
}
