import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    const transactionId = params.id

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Get current transaction
    const currentTransaction = await db.transaction.findUnique({
      where: { id: transactionId },
      include: {
        borrower: true,
        lender: true
      }
    })

    if (!currentTransaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Handle different status updates
    if (status === 'accepted') {
      // Deduct token from borrower and place in escrow
      if (currentTransaction.borrower.trustTokenBalance < 1) {
        return NextResponse.json(
          { error: 'Borrower has insufficient tokens' },
          { status: 400 }
        )
      }

      await db.user.update({
        where: { id: currentTransaction.borrowerId },
        data: {
          trustTokenBalance: {
            decrement: 1
          }
        }
      })

      // Mark item as unavailable
      await db.item.update({
        where: { id: currentTransaction.itemId },
        data: {
          isAvailable: false
        }
      })
    } else if (status === 'completed') {
      // Return token to lender
      await db.user.update({
        where: { id: currentTransaction.lenderId },
        data: {
          trustTokenBalance: {
            increment: 1
          },
          totalLendingCount: {
            increment: 1
          }
        }
      })

      // Update borrower stats
      await db.user.update({
        where: { id: currentTransaction.borrowerId },
        data: {
          totalBorrowingCount: {
            increment: 1
          }
        }
      })

      // Mark item as available again
      await db.item.update({
        where: { id: currentTransaction.itemId },
        data: {
          isAvailable: true
        }
      })
    } else if (status === 'cancelled') {
      // Return token to borrower if it was deducted
      if (currentTransaction.status === 'accepted') {
        await db.user.update({
          where: { id: currentTransaction.borrowerId },
          data: {
            trustTokenBalance: {
              increment: 1
            }
          }
        })
      }

      // Mark item as available again
      await db.item.update({
        where: { id: currentTransaction.itemId },
        data: {
          isAvailable: true
        }
      })
    }

    // Update transaction status
    const updatedTransaction = await db.transaction.update({
      where: { id: transactionId },
      data: { status },
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
            averageRating: true,
            trustTokenBalance: true
          }
        },
        lender: {
          select: {
            id: true,
            displayName: true,
            averageRating: true,
            trustTokenBalance: true
          }
        }
      }
    })

    return NextResponse.json(
      { 
        message: `Transaction ${status} successfully`,
        transaction: updatedTransaction
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update transaction status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}