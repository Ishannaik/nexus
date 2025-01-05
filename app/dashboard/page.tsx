'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Header } from '@/components/header'
import { WelcomeMessage } from '@/components/welcome-message'
import { AccountBalance } from '@/components/account-balance'
import { MoneyTransfer } from '@/components/money-transfer'
import { Transactions } from '@/components/transactions'
import { useBalance } from '@/hooks/useBalance'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { balance, fetchBalance } = useBalance()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-white"
    >
      <Header user={session.user} />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WelcomeMessage user={session.user} />
            <AccountBalance balance={balance} fetchBalance={fetchBalance} />
            <MoneyTransfer onTransactionComplete={fetchBalance} />
          </div>
          <div className="lg:col-span-1 lg:row-start-1 lg:row-end-4">
            <Transactions onTransactionComplete={fetchBalance} />
          </div>
        </div>
      </main>
    </motion.div>
  )
}

