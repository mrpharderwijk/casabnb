import { NextRequest, NextResponse } from 'next/server'

import { getSession } from '@/actions/get-current-user'
import { HostListingParams } from '@/features/host/types/host-listing-params'
import { prisma } from '@/lib/prisma/db'

export async function POST(request: NextRequest, { params }: HostListingParams) {
  const session = await getSession()
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { listingId } = await params
  if (!listingId) {
    return NextResponse.json({ message: 'Listing ID is required' }, { status: 400 })
  }

  const { neighbourhoodDescription } = await request.json()
  if (!neighbourhoodDescription) {
    return NextResponse.json({ message: 'Neighbourhood description is required' }, { status: 400 })
  }

  try {
    const listing = await prisma.listing.update({
      where: {
        userId: session.user.id,
        id: listingId,
      },
      data: {
        neighbourhoodDescription,
      },
    })

    return NextResponse.json(listing)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Failed to create description' }, { status: 500 })
  }
}
