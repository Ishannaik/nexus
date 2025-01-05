import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '../auth/[...nextauth]/options'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id }
        ]
      },
      include: {
        sender: { select: { email: true } },
        receiver: { select: { email: true } }
      },
      orderBy: {
        date: 'desc'
      },
      take: 10 // Limit to 10 most recent transactions
    })

    const formattedTransactions = transactions.map(t => ({
      ...t,
      type: t.senderId === session.user.id ? 'outgoing' : 'incoming',
      otherPartyEmail: t.senderId === session.user.id ? t.receiver.email : t.sender.email
    }))

    return NextResponse.json(formattedTransactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'An error occurred while fetching transactions' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { amount, recipientEmail } = await request.json()

    if (session.user.email === recipientEmail) {
      return NextResponse.json({ error: 'You cannot send money to yourself' }, { status: 400 })
    }

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Get the current user
      const sender = await prisma.user.findUnique({
        where: { id: session.user.id },
      })

      if (!sender) {
        throw new Error('Sender not found')
      }

      // Check if sender has enough balance
      if (sender.balance < amount) {
        throw new Error('Insufficient balance for this transaction')
      }

      // Get the recipient
      const recipient = await prisma.user.findUnique({
        where: { email: recipientEmail },
      })

      if (!recipient) {
        throw new Error('Recipient user does not exist')
      }

      // Update sender's balance
      const updatedSender = await prisma.user.update({
        where: { id: sender.id },
        data: { balance: sender.balance - amount },
      })

      // Update recipient's balance
      await prisma.user.update({
        where: { id: recipient.id },
        data: { balance: recipient.balance + amount },
      })

      // Create the transaction record
      const transaction = await prisma.transaction.create({
        data: {
          amount,
          senderId: sender.id,
          receiverId: recipient.id,
        },
      })

      return { transaction, updatedBalance: updatedSender.balance }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An error occurred while creating the transaction' }, { status: 500 })
  }
}

