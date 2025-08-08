import { Router, Request, Response } from 'express'
import { Pool } from 'pg'
import rateLimit from 'express-rate-limit'
import { AuthService } from './auth.service'
import { loginSchema, refreshTokenSchema } from './auth.validators'

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many login attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
})

export function createAuthRoutes(db: Pool): Router {
  const router = Router()
  const authService = new AuthService(db)

  // POST /auth/login
  router.post('/login', authLimiter, async (req: Request, res: Response) => {
    try {
      // Validate request
      const validation = loginSchema.safeParse({ body: req.body })
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: validation.error.errors
        })
      }

      const { user, accessToken, refreshToken } = await authService.login(req.body)

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      res.json({
        success: true,
        user,
        accessToken
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      })
    }
  })

  // POST /auth/refresh
  router.post('/refresh', authLimiter, async (req: Request, res: Response) => {
    try {
      // Validate request
      const validation = refreshTokenSchema.safeParse({ cookies: req.cookies })
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token required'
        })
      }

      const { refreshToken } = req.cookies
      const accessToken = await authService.refreshAccessToken(refreshToken)

      res.json({
        success: true,
        accessToken
      })
    } catch (error) {
      console.error('Token refresh error:', error)
      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Token refresh failed'
      })
    }
  })

  // POST /auth/logout
  router.post('/logout', (req: Request, res: Response) => {
    // Clear refresh token cookie
    res.clearCookie('refreshToken')
    res.json({
      success: true,
      message: 'Logged out successfully'
    })
  })

  return router
}