/**
 * Auth Wrapper Component
 * 
 * Provides consistent styling for authentication pages.
 */

import type React from 'react'

interface AuthWrapperProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthWrapper({ children, title, subtitle }: AuthWrapperProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-900 dark:to-dark-800 px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-dark-600 dark:text-dark-400">{subtitle}</p>
          )}
        </div>

        {/* Form Container */}
        <div className="rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 p-8 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  )
}
