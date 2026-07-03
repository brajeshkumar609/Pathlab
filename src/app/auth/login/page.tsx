/**
 * Login Page
 */

import { AuthWrapper } from '@/components/auth/auth-wrapper'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <AuthWrapper
      title="Welcome Back"
      subtitle="Sign in to your Pathlab account"
    >
      <LoginForm />
    </AuthWrapper>
  )
}
