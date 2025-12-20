import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {}

    if (userId) {
      where.OR = [
        { borrowerId: userId },
        { lenderId: userId }
      ]
    }

    if (status) {
      where.status = status
    }

    const transactions = await db.transaction.findMany({
      where,
      include: {
        item: {
          include: {
            owner: {
              select: {
                id: true,
                displayName: true,
                averageRating: true
              }
            }
          }
        },
        borrower: {
          select: {
            id: true,
            displayName: true,
            averageRating: true
          }
        },
        lender: {
          select: {
            id: true,
            displayName: true,
            averageRating: true
          }
        },
        messages: {
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
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                displayName: true
              }
            },
            reviewee: {
              select: {
                id: true,
                displayName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform transactions
    const transformedTransactions = transactions.map(transaction => ({
      ...transaction,
      item: {
        ...transaction.item,
        imageUrls: JSON.parse(transaction.item.imageUrls || '[]'),
        availabilitySchedule: JSON.parse(transaction.item.availabilitySchedule || '{}')
      }
    }))

    return NextResponse.json(transformedTransactions)
  } catch (error) {
    console.error('Get transactions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      itemId,
      borrowerId,
      startDate,
      endDate
    } = await request.json()

    // Validate required fields
    if (!itemId || !borrowerId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Get item and lender info
    const item = await db.item.findUnique({
      where: { id: itemId },
      include: {
        owner: true
      }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    if (!item.isAvailable) {
      return NextResponse.json(
        { error: 'Item is not available' },
        { status: 400 }
      )
    }

    // Check borrower has enough tokens
    const borrower = await db.user.findUnique({
      where: { id: borrowerId }
    })

    if (!borrower || borrower.trustTokenBalance < 1) {
      return NextResponse.json(
        { error: 'Insufficient tokens' },
        { status: 400 }
      )
    }

    // Create transaction
    const transaction = await db.transaction.create({
      data: {
        itemId,
        borrowerId,
        lenderId: item.ownerId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'requested'
      },
      include: {
        item: {
          include: {
            owner: {
              select: {
                id: true,
                displayName: true,
                averageRating: true
              }
            }
          }
        },
        borrower: {
          select: {
            id: true,
            displayName: true,
            averageRating: true
          }
        },
        lender: {
          select: {
            id: true,
            displayName: true,
            averageRating: true
          }
        }
      }
    })

    return NextResponse.json(
      { 
        message: 'Transaction request created successfully',
        transaction
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create transaction error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}