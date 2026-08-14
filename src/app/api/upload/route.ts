import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
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

    const contentType = request.headers.get('content-type') || ''

    // 1. Direct Compressed Base64 Payload (Fail-proof for Vercel)
    if (contentType.includes('application/json')) {
      const { imageBase64 } = await request.json()
      if (!imageBase64) {
        return NextResponse.json({ error: 'Tidak ada data gambar' }, { status: 400 })
      }
      return NextResponse.json({ imageUrl: imageBase64 })
    }

    // 2. Multipart Form Upload (Local File fallback)
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      const mimeType = file.type || 'image/jpeg'
      const base64String = buffer.toString('base64')
      const imageUrl = `data:${mimeType};base64,${base64String}`
      return NextResponse.json({ imageUrl })
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const fileExt = path.extname(file.name) || '.jpg'
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${fileExt}`
    const filePath = path.join(uploadsDir, fileName)

    await writeFile(filePath, buffer)
    return NextResponse.json({ imageUrl: `/uploads/${fileName}` })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Gagal mengunggah gambar' }, { status: 500 })
  }
}
