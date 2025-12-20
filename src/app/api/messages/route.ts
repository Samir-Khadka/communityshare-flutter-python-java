import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get('transactionId')

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      )
    }

    const messages = await db.message.findMany({
      where: {
        transactionId
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      transactionId,
      senderId,
      text
    } = await request.json()

    // Validate required fields
    if (!transactionId || !senderId || !text) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Create message
    const message = await db.message.create({
      data: {
        transactionId,
        senderId,
        text
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true
          }
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'Message sent successfully',
        message
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create message error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}