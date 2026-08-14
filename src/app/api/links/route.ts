import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyJwtToken } from '@/lib/auth'

export async function GET() {
  try {
    const links = await db.linkBlock.findMany({
      orderBy: { position: 'asc' },
    })
    return NextResponse.json(links, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Auth Check: Verify JWT Admin Token
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token || !verifyJwtToken(token)) {
      return NextResponse.json({ error: 'Unauthorized: Akses ditolak' }, { status: 401 })
    }

    const body = await request.json()
    const { title, url, imageUrl } = body

    if (!title || !url) {
      return NextResponse.json({ error: 'Judul dan Link Shopee wajib diisi' }, { status: 400 })
    }

    const count = await db.linkBlock.count()

    const newLink = await db.linkBlock.create({
      data: {
        title,
        url,
        imageUrl: imageUrl || '',
        position: count + 1,
      },
    })

    return NextResponse.json(newLink, { status: 201 })
  } catch (error) {
    console.error('Error creating link block:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
