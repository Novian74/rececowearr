import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/auth'

export async function GET() {
  try {
    const admin = await db.adminUser.findFirst()
    if (!admin) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const { passwordHash, ...safeProfile } = admin
    return NextResponse.json(safeProfile, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    // Auth Check: Verify JWT Admin Token
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token || !verifyJwtToken(token)) {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak' }, { status: 401 })
    }

    const body = await request.json()
    const admin = await db.adminUser.findFirst()

    if (!admin) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const updated = await db.adminUser.update({
      where: { id: admin.id },
      data: {
        displayName: body.displayName ?? admin.displayName,
        username: body.username ?? admin.username,
        avatarUrl: body.avatarUrl ?? admin.avatarUrl,
        bio: body.bio ?? admin.bio,
        backgroundColor: body.backgroundColor ?? admin.backgroundColor,
        cardBackgroundColor: body.cardBackgroundColor ?? admin.cardBackgroundColor,
        cardTextColor: body.cardTextColor ?? admin.cardTextColor,
      },
    })

    const { passwordHash, ...safeProfile } = updated
    return NextResponse.json(safeProfile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
