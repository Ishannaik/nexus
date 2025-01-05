'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, User, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useSession } from 'next-auth/react'

interface MoneyTransferProps {
  onTransactionComplete: () => Promise<void>
}

export function MoneyTransfer({ onTransactionComplete }: MoneyTransferProps) {
  const [email, setEmail] = useState('')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (session?.user?.email === email) {
        toast({
          title: "Transfer Failed",
          description: "You cannot send money to yourself.",
          variant: "destructive",
        })
        return
      }

      const amountValue = parseFloat(amount)

      // Check if recipient exists
      const recipientCheckResponse = await fetch(`/api/user-exists?email=${encodeURIComponent(email)}`)
      const recipientCheckData = await recipientCheckResponse.json()

      if (!recipientCheckData.exists) {
        toast({
          title: "Transfer Failed",
          description: "Recipient user does not exist.",
          variant: "destructive",
        })
        return
      }

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountValue,
          type: 'outgoing',
          recipientEmail: email,
        }),
      })

      if (response.ok) {
        toast({
          title: "Transfer Successful",
          description: `$${amount} has been sent to ${email}`,
          variant: "success",
        })
        setEmail('')
        setAmount('')
        await onTransactionComplete() // Fetch the updated balance
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Transfer failed')
      }
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "An error occurred while processing your transfer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-black mb-3">Transfer Money</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="email"
            placeholder="Recipient's Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 border-gray-300 focus:border-black focus:ring-black"
          />
        </div>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
            className="pl-10 border-gray-300 focus:border-black focus:ring-black"
          />
        </div>
        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={isLoading}>
          {isLoading ? (
            'Processing...'
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" /> Send Money
            </>
          )}
        </Button>
      </form>
    </motion.div>
  )
}

