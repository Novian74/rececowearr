import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'lynk_id_rececowear_secret_key_2026_super_secure'

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signJwtToken(payload: { username: string; userId: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyJwtToken(token: string): { username: string; userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { username: string; userId: string }
  } catch {
    return null
  }
}
