import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const {
      transactionId,
      reviewerId,
      revieweeId,
      rating,
      comment
    } = await request.json()

    // Validate required fields
    if (!transactionId || !reviewerId || !revieweeId || !rating) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Check if review already exists
    const existingReview = await db.review.findFirst({
      where: {
        transactionId,
        reviewerId
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already exists for this transaction' },
        { status: 409 }
      )
    }

    // Create review
    const review = await db.review.create({
      data: {
        transactionId,
        reviewerId,
        revieweeId,
        rating,
        comment
      },
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
    })

    // Update reviewee's average rating
    const allReviews = await db.review.findMany({
      where: {
        revieweeId
      }
    })

    const averageRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length

    await db.user.update({
      where: { id: revieweeId },
      data: {
        averageRating
      }
    })

    return NextResponse.json(
      { 
        message: 'Review created successfully',
        review,
        newAverageRating: averageRating
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}