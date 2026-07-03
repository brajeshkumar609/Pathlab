/**
 * Hook: useRoleCheck
 * 
 * Checks if the current user has required role(s).
 */

'use client'

import { useAuth } from '../auth-context'
import type { UserRole } from '@/types'

export function useRoleCheck(requiredRoles: UserRole | UserRole[]) {
  const { user } = useAuth()

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  const hasRole = user && 'role' in user ? roles.includes(user.role) : false

  return { hasRole, userRole: user && 'role' in user ? user.role : null }
}
