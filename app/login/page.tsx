import { AuthForm } from '@/components/auth-form'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-pattern">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg border border-black">
        <AuthForm />
      </div>
    </div>
  )
}

