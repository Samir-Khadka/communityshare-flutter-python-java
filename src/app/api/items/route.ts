import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const location = searchParams.get('location')

    // Build where clause
    const where: any = {
      isAvailable: true
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (location) {
      where.OR = [
        { locationCity: { contains: location, mode: 'insensitive' } },
        { locationPostcode: { contains: location, mode: 'insensitive' } }
      ]
    }

    const items = await db.item.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            averageRating: true,
            totalLendingCount: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform items to include owner rating and format image URLs
    const transformedItems = items.map(item => ({
      ...item,
      imageUrls: JSON.parse(item.imageUrls || '[]'),
      owner: {
        ...item.owner,
        rating: item.owner.averageRating
      }
    }))

    return NextResponse.json(transformedItems)
  } catch (error) {
    console.error('Get items error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      ownerId,
      title,
      description,
      category,
      imageUrls,
      locationCity,
      locationPostcode,
      availabilitySchedule
    } = await request.json()

    // Validate required fields
    if (!ownerId || !title || !description || !category || !locationCity || !locationPostcode) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Create item
    const item = await db.item.create({
      data: {
        ownerId,
        title,
        description,
        category,
        imageUrls: JSON.stringify(imageUrls || []),
        locationCity,
        locationPostcode,
        availabilitySchedule: JSON.stringify(availabilitySchedule || {}),
        isAvailable: true
      },
      include: {
        owner: {
          select: {
            id: true,
            displayName: true,
            averageRating: true,
            totalLendingCount: true
          }
        }
      }
    })

    // Transform response
    const transformedItem = {
      ...item,
      imageUrls: JSON.parse(item.imageUrls),
      availabilitySchedule: JSON.parse(item.availabilitySchedule),
      owner: {
        ...item.owner,
        rating: item.owner.averageRating
      }
    }

    return NextResponse.json(
      { 
        message: 'Item created successfully',
        item: transformedItem
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}