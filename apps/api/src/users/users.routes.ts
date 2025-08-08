import { Router } from 'express'
import type { Request, Response } from 'express'
import { Pool } from 'pg'
import { UsersService } from './users.service'
import { AdminService } from '../admin/admin.service'
import { setPasswordSchema } from './users.validators'
import bcrypt from 'bcryptjs'

// Rate limiting for password setup attempts
const passwordSetupAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const attempt = passwordSetupAttempts.get(ip)
  
  if (!attempt || now - attempt.lastAttempt > RATE_LIMIT_WINDOW) {
    passwordSetupAttempts.set(ip, { count: 1, lastAttempt: now })
    return true
  }
  
  if (attempt.count >= MAX_ATTEMPTS) {
    return false
  }
  
  attempt.count++
  attempt.lastAttempt = now
  return true
}

export function createUsersRoutes(db: Pool): Router {
  const router = Router()
  const _usersService = new UsersService(db)
  const adminService = new AdminService(db, {} as any) // Mock email service for now

  // POST /users/set-password - Public endpoint for password setup
  router.post('/set-password', async (req: Request, res: Response) => {
    try {
      // Rate limiting
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown'
      if (!checkRateLimit(clientIP)) {
        return res.status(429).json({
          success: false,
          error: 'Too many password setup attempts. Please try again later.',
          retryAfter: RATE_LIMIT_WINDOW / 1000
        })
      }

      const validation = setPasswordSchema.safeParse(req.body)
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: validation.error.errors
        })
      }

      const { token, password } = validation.data

      // Validate and consume the token
      const tokenResult = await adminService.consumePasswordSetupToken(token)
      
      if (!tokenResult.success) {
        return res.status(400).json({
          success: false,
          error: tokenResult.error
        })
      }

      const email = tokenResult.email!

      // Hash the new password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(password, saltRounds)

      // Update user's password
      await db.query(
        'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE email = $2',
        [passwordHash, email]
      )

      // Log password setup for audit
      console.log(`Password set for user: Email=${email}`)

      res.json({
        success: true,
        message: 'Password set successfully. You can now login with your new password.'
      })
    } catch (error) {
      console.error('Error setting password:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      })
    }
  })

  return router
}