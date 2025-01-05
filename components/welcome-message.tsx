import { motion } from 'framer-motion'

interface WelcomeMessageProps {
  user: {
    email?: string | null;
    name?: string | null;
  }
}

export function WelcomeMessage({ user }: WelcomeMessageProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-100 rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {user.name || 'User'}!</h2>
      <p className="text-gray-600">Logged in as: {user.email || 'N/A'}</p>
    </motion.div>
  )
}

