import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'

export function useBalance() {
  const [balance, setBalance] = useState<number | null>(null)
  const { data: session } = useSession()

  const fetchBalance = useCallback(async () => {
    if (session?.user) {
      try {
        const response = await fetch('/api/balance')
        if (response.ok) {
          const data = await response.json()
          setBalance(data.balance)
        } else {
          throw new Error('Failed to fetch balance')
        }
      } catch (error) {
        console.error('Error fetching balance:', error)
      }
    }
  }, [session])

  return { balance, fetchBalance }
}

