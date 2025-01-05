'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign } from 'lucide-react'

interface AccountBalanceProps {
  balance: number | null
  fetchBalance: () => Promise<void>
}

export function AccountBalance({ balance, fetchBalance }: AccountBalanceProps) {
  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-black text-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center mb-4">
        <DollarSign className="w-8 h-8 mr-2" />
        <h2 className="text-xl font-semibold">Account Balance</h2>
      </div>
      <p className="text-4xl font-bold mb-4">${balance !== null ? balance.toFixed(2) : '...'}</p>
    </motion.div>
  )
}

