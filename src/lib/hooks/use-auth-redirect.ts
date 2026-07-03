/**
 * Hook: useAuthRedirect
 * 
 * Handles automatic redirect for unauthenticated users.
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../auth-context'

export function useAuthRedirect() {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, loading, router])
}
