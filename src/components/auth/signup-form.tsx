/**
 * Signup Form Component
 * 
 * Handles user registration with email, password, and organization details.
 * Creates both Firebase Auth user and Firestore documents.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth'
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { cn } from '@/utils/cn'
import Link from 'next/link'
import { UserRole } from '@/types'

const signupSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    organizationName: z.string().min(2, 'Organization name is required'),
    phone: z.string().min(10, 'Valid phone number required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

export function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      )

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: data.displayName,
      })

      // Create organization document
      const orgDocRef = doc(collection(db, 'organizations'))
      const organizationId = orgDocRef.id

      await setDoc(orgDocRef, {
        id: organizationId,
        name: data.organizationName,
        registrationNumber: '',
        email: data.email,
        phone: data.phone,
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        licenseExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        plan: 'FREE',
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userCredential.user.uid,
        adminId: userCredential.user.uid,
      })

      // Create user document in Firestore
      const userDocRef = doc(db, 'users', userCredential.user.uid)
      await setDoc(userDocRef, {
        id: userCredential.user.uid,
        email: data.email,
        displayName: data.displayName,
        role: UserRole.LAB_ADMIN,
        organizationId,
        phone: data.phone,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userCredential.user.uid,
      })

      router.push('/dashboard')
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('email-already-in-use')) {
          setError('Email is already registered')
        } else if (err.message.includes('weak-password')) {
          setError('Password is too weak')
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
      {/* Display Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-200">
          Full Name
        </label>
        <input
          {...register('displayName')}
          type="text"
          placeholder="John Doe"
          className={cn(
            'w-full rounded-lg border px-4 py-2 text-sm transition-colors',
            'border-dark-300 dark:border-dark-600',
            'bg-white dark:bg-dark-800',
            'text-dark-900 dark:text-white',
            'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
            errors.displayName && 'border-red-500 focus:ring-red-500',
          )}
        />
        {errors.displayName && (
          <p className="text-xs text-red-500">{errors.displayName.message}</p>
        )}
      </div>

      {/* Email */}
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

      {/* Organization Name */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-200">
          Lab/Organization Name
        </label>
        <input
          {...register('organizationName')}
          type="text"
          placeholder="Pathology Labs Inc."
          className={cn(
            'w-full rounded-lg border px-4 py-2 text-sm transition-colors',
            'border-dark-300 dark:border-dark-600',
            'bg-white dark:bg-dark-800',
            'text-dark-900 dark:text-white',
            'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
            errors.organizationName && 'border-red-500 focus:ring-red-500',
          )}
        />
        {errors.organizationName && (
          <p className="text-xs text-red-500">{errors.organizationName.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-200">
          Phone Number
        </label>
        <input
          {...register('phone')}
          type="tel"
          placeholder="+1 (555) 123-4567"
          className={cn(
            'w-full rounded-lg border px-4 py-2 text-sm transition-colors',
            'border-dark-300 dark:border-dark-600',
            'bg-white dark:bg-dark-800',
            'text-dark-900 dark:text-white',
            'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
            errors.phone && 'border-red-500 focus:ring-red-500',
          )}
        />
        {errors.phone && (
          <p className="text-xs text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Password */}
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

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-dark-700 dark:text-dark-200">
          Confirm Password
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          placeholder="••••••••"
          className={cn(
            'w-full rounded-lg border px-4 py-2 text-sm transition-colors',
            'border-dark-300 dark:border-dark-600',
            'bg-white dark:bg-dark-800',
            'text-dark-900 dark:text-white',
            'focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500',
            errors.confirmPassword && 'border-red-500 focus:ring-red-500',
          )}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
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
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>

      {/* Login Link */}
      <p className="text-center text-sm text-dark-600 dark:text-dark-400">
        Already have an account?{' '}
        <Link href="/auth/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </form>
  )
}
