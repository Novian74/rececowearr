import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/auth'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth Check: Verify JWT Admin Token
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token || !verifyJwtToken(token)) {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const updated = await db.linkBlock.update({
      where: { id },
      data: {
        title: body.title,
        url: body.url,
        imageUrl: body.imageUrl,
        isActive: body.isActive,
        position: body.position,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating link:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth Check: Verify JWT Admin Token
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token || !verifyJwtToken(token)) {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak' }, { status: 401 })
    }

    const { id } = await params
    await db.linkBlock.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
