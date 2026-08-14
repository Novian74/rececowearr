import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { comparePassword, signJwtToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 })
    }

    const admin = await db.adminUser.findUnique({
      where: { username },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    const isMatch = await comparePassword(password, admin.passwordHash)

    if (!isMatch) {
      return NextResponse.json({ error: 'Username atau password salah' }, { status: 401 })
    }

    const token = signJwtToken({ username: admin.username, userId: admin.id })

    const response = NextResponse.json({ success: true, message: 'Berhasil login' })
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}
