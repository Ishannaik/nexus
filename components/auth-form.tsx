'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        // Handle login
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        })

        if (result?.error) {
          toast({
            title: "Login Failed",
            description: result.error,
            variant: "destructive",
          })
        } else {
          router.push('/dashboard')
        }
      } else {
        // Handle signup
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })

        let data
        try {
          data = await response.json()
        } catch (error) {
          console.error('Error parsing JSON:', error)
          throw new Error('Invalid response from server')
        }

        if (response.ok) {
          toast({
            title: "Sign Up Successful",
            description: `Your account has been created with a starting balance of $1000. Please log in with your new account.`,
          })
          setIsLogin(true)
        } else {
          toast({
            title: "Sign Up Failed",
            description: data.error || 'An unexpected error occurred',
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <h1 className="text-3xl font-bold text-center mb-6 text-black">NexusBank</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4 text-black">
          {isLogin ? 'Login to Your Account' : 'Create an Account'}
        </h2>
        {!isLogin && (
          <div>
            <Label htmlFor="name" className="text-black">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border-black focus:border-black focus:ring-black"
            />
          </div>
        )}
        <div>
          <Label htmlFor="email" className="text-black">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-black focus:border-black focus:ring-black"
          />
        </div>
        <div>
          <Label htmlFor="password" className="text-black">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-black focus:border-black focus:ring-black"
          />
        </div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
          {isLoading ? 'Processing...' : (isLogin ? 'Log in' : 'Sign up')}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-black hover:underline"
          disabled={isLoading}
        >
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </motion.div>
  )
}

