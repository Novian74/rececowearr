import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    // Auth Check: Verify JWT Admin Token
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token || !verifyJwtToken(token)) {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak' }, { status: 401 })
    }

    const { orderedIds } = await request.json()

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds must be an array' }, { status: 400 })
    }

    // Update positions sequentially
    await Promise.all(
      orderedIds.map((id: string, index: number) =>
        db.linkBlock.update({
          where: { id },
          data: { position: index + 1 },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering links:', error)
    return NextResponse.json({ error: 'Failed to reorder links' }, { status: 500 })
  }
}
