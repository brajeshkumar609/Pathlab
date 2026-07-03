/**
 * Signup Page
 */

import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { SignupForm } from '@/components/auth/signup-form'

export function SignupPage() {
  return (
    <AuthWrapper
      title="Create Account"
      subtitle="Set up your Pathlab laboratory account"
    >
      <SignupForm />
    </AuthWrapper>
  )
}

export default SignupPage
