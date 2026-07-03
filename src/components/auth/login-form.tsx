/**
 * Login Form Component
 * 
 * Handles user login with email and password.
 * Validates input using Zod.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { cn } from '@/utils/cn'
import Link from 'next/link'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      await signInWithEmailAndPassword(auth, data.email, data.password)
      router.push('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('user-not-found')) {
          setError('No account found with this email')
        } else if (err.message.includes('wrong-password')) {
          setError('Incorrect password')
        } else if (err.message.includes('too-many-requests')) {
          setError('Too many login attempts. Please try again later.')
        } else {
          setError(err.message)
        }
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Email Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-200">
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="you@example.com"
          className={cn(
            'w-full rounded-lg border px-4 py-2 text-sm transition-colors',
            'border-dark-300 dark:border-dark-600',
            'bg-white dark:bg-dark-800',
            'text-dark-900 dark:text-white',
            'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
            errors.email && 'border-red-500 focus:ring-red-500',
          )}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-200">
          Password
        </label>
        <input
          {...register('password')}
          type="password"
          placeholder="••••••••"
          className={cn(
            'w-full rounded-lg border px-4 py-2 text-sm transition-colors',
            'border-dark-300 dark:border-dark-600',
            'bg-white dark:bg-dark-800',
            'text-dark-900 dark:text-white',
            'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
            errors.password && 'border-red-500 focus:ring-red-500',
          )}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Remember Me */}
      <div className="flex items-center">
        <input
          {...register('rememberMe')}
          type="checkbox"
          id="rememberMe"
          className="h-4 w-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="rememberMe" className="ml-2 text-sm text-dark-600 dark:text-dark-400">
          Remember me
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'w-full rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white transition-all',
          'hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'dark:focus:ring-offset-dark-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-dark-600 dark:text-dark-400">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="font-medium text-primary-600 hover:text-primary-700">
          Sign up
        </Link>
      </p>
    </form>
  )
}
