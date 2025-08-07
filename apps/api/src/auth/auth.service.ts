import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Pool } from 'pg'
import { User, UserRole } from 'shared'
import { LoginRequest } from './auth.validators'

export class AuthService {
  private db: Pool
  private jwtSecret: string
  private jwtRefreshSecret: string
  private jwtExpiry: string
  private jwtRefreshExpiry: string

  constructor(
    db: Pool,
    jwtSecret: string = process.env.JWT_SECRET || 'default-secret',
    jwtRefreshSecret: string = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    jwtExpiry: string = process.env.JWT_EXPIRY || '15m',
    jwtRefreshExpiry: string = process.env.JWT_REFRESH_EXPIRY || '7d'
  ) {
    this.db = db
    this.jwtSecret = jwtSecret
    this.jwtRefreshSecret = jwtRefreshSecret
    this.jwtExpiry = jwtExpiry
    this.jwtRefreshExpiry = jwtRefreshExpiry
  }

  async login(credentials: LoginRequest): Promise<{
    user: Omit<User, 'password_hash'>
    accessToken: string
    refreshToken: string
  }> {
    const { email, password } = credentials

    // Find user by email
    const query = 'SELECT * FROM users WHERE email = $1'
    const result = await this.db.query(query, [email])

    if (result.rows.length === 0) {
      throw new Error('Invalid email or password')
    }

    const user = result.rows[0] as User

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      throw new Error('Invalid email or password')
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user)
    const refreshToken = this.generateRefreshToken(user)

    // Remove password_hash from user object
    const { password_hash, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as any
      
      // Fetch fresh user data
      const query = 'SELECT * FROM users WHERE id = $1'
      const result = await this.db.query(query, [decoded.userId])
      
      if (result.rows.length === 0) {
        throw new Error('User not found')
      }

      const user = result.rows[0] as User
      return this.generateAccessToken(user)
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        throw error
      }
      throw new Error('Invalid refresh token')
    }
  }

  private generateAccessToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    }

    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiry })
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email
    }

    return jwt.sign(payload, this.jwtRefreshSecret, { expiresIn: this.jwtRefreshExpiry })
  }

  verifyAccessToken(token: string): { userId: string; email: string; role: UserRole } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    } catch (error) {
      throw new Error('Invalid access token')
    }
  }
}