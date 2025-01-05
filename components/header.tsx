import { motion } from 'framer-motion'
import { User, Bell, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  user: {
    email?: string | null
    name?: string | null
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10"
    >
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">NexusBank</h1>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="text-gray-600 w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm font-semibold text-black">{user.name}</p>
              <p className="text-xs text-gray-600">{user.email}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded-full">
              <User className="text-black w-5 h-5" />
            </div>
          </div>
          <Button onClick={() => signOut()} variant="ghost" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </motion.header>
  )
}

