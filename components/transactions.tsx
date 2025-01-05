'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownCircle, ArrowUpCircle, RefreshCw } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface Transaction {
  id: string
  amount: number
  type: 'incoming' | 'outgoing'
  date: string
  otherPartyEmail: string
}

interface TransactionsProps {
  onTransactionComplete: () => Promise<void>
}

export function Transactions({ onTransactionComplete }: TransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()

  const fetchTransactions = useCallback(async () => {
    if (session?.user) {
      setIsLoading(true)
      try {
        const response = await fetch('/api/transactions')
        if (response.ok) {
          const data = await response.json()
          setTransactions(data)
          await onTransactionComplete() // Update balance after fetching transactions
        } else {
          throw new Error('Failed to fetch transactions')
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
        toast({
          title: "Error",
          description: "Failed to fetch transactions. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }, [session, onTransactionComplete, toast])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const handleRefresh = () => {
    fetchTransactions()
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-full"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">Recent Transactions</h2>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-16rem)]">
        {transactions.map((transaction) => (
          <motion.div
            key={transaction.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between border-b border-gray-200 pb-2"
          >
            <div className="flex items-center">
              {transaction.type === 'incoming' ? (
                <ArrowDownCircle className="w-6 h-6 text-green-600 mr-2 flex-shrink-0" />
              ) : (
                <ArrowUpCircle className="w-6 h-6 text-red-600 mr-2 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-black">
                  {transaction.type === 'incoming' ? 'Received from' : 'Sent to'} {transaction.otherPartyEmail}
                </p>
                <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
            </div>
            <p className={`font-semibold ${
              transaction.type === 'incoming' ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.type === 'incoming' ? '+' : '-'}${transaction.amount.toFixed(2)}
            </p>
          </motion.div>
        ))}
        {transactions.length === 0 && (
          <p className="text-center text-gray-500">No transactions found.</p>
        )}
      </div>
    </motion.div>
  )
}

