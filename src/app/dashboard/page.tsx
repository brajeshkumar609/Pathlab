/**
 * Dashboard Placeholder Page
 * 
 * Protected route - only accessible to authenticated users.
 * Will be expanded in Phase 4.
 */

'use client'

import { useAuth } from '@/lib/auth-context'
import { useOrganization } from '@/lib/organization-context'
import { useAuthRedirect } from '@/lib/hooks/use-auth-redirect'

export default function DashboardPage() {
  useAuthRedirect() // Redirect to login if not authenticated

  const { user, loading: authLoading, signOut } = useAuth()
  const { organization, loading: orgLoading } = useOrganization()

  if (authLoading || orgLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-300 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-dark-600 dark:text-dark-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white">
              Dashboard
            </h1>
            {organization && (
              <p className="mt-2 text-dark-600 dark:text-dark-400">
                Welcome to {organization.name}
              </p>
            )}
          </div>

          <button
            onClick={signOut}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* User Info */}
        <div className="rounded-lg border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 p-6 mb-8">
          <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-4">
            User Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-dark-600 dark:text-dark-400">Name</p>
              <p className="font-medium text-dark-900 dark:text-white">{user?.displayName}</p>
            </div>
            <div>
              <p className="text-sm text-dark-600 dark:text-dark-400">Email</p>
              <p className="font-medium text-dark-900 dark:text-white">{user?.email}</p>
            </div>
            {user && 'role' in user && (
              <div>
                <p className="text-sm text-dark-600 dark:text-dark-400">Role</p>
                <p className="font-medium text-dark-900 dark:text-white">{user.role}</p>
              </div>
            )}
            {organization && (
              <div>
                <p className="text-sm text-dark-600 dark:text-dark-400">Organization ID</p>
                <p className="font-medium text-dark-900 dark:text-white text-sm">
                  {organization.id}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        <div className="rounded-lg border border-primary-200 dark:border-primary-900 bg-primary-50 dark:bg-primary-900/20 p-6">
          <h3 className="font-semibold text-primary-900 dark:text-primary-100 mb-2">
            Phase 2 Complete: Authentication & RBAC ✓
          </h3>
          <p className="text-primary-800 dark:text-primary-200 text-sm">
            Phase 3 Complete: Multi-Tenant Database Setup ✓
          </p>
          <p className="text-primary-700 dark:text-primary-300 text-sm mt-2">
            Next phase: Dashboard & Navigation with analytics
          </p>
        </div>
      </div>
    </div>
  )
}
