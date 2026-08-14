import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lynk_id_rececowear_secret_key_2026_super_secure'
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes and login page
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/click') ||
    !pathname.startsWith('/admin')
  ) {
    return NextResponse.next()
  }

  // Protect /admin routes
  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  try {
    await jwtVerify(token, JWT_SECRET)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
