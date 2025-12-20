import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, displayName, locationCity, locationPostcode, password } = await request.json()

    // Validate required fields
    if (!email || !displayName || !locationCity || !locationPostcode || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        displayName,
        locationCity,
        locationPostcode,
        password: hashedPassword,
        trustTokenBalance: 5, // Start with 5 tokens
        averageRating: 0.0,
        totalLendingCount: 0,
        totalBorrowingCount: 0,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        locationCity: true,
        locationPostcode: true,
        trustTokenBalance: true,
        averageRating: true,
        totalLendingCount: true,
        totalBorrowingCount: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}