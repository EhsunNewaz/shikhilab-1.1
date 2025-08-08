/* eslint-disable no-unused-vars */
import type { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'
import { Pool } from 'pg'

// Extend Express Request interface
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: string
      email: string
      role: string
    }
  }
}

export function createAuthMiddleware(db: Pool) {
  const authService = new AuthService(db)

  return function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      })
    }

    try {
      const user = authService.verifyAccessToken(token)
      req.user = user
      next()
    } catch (error) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired token'
      })
    }
  }
}

export function requireRole(roles: string[]) {
  return function(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      })
    }

    next()
  }
}