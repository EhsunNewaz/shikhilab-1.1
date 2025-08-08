import { Request, Response, NextFunction } from 'express'
import { createAuthMiddleware, requireRole } from './auth.middleware'
import { Pool } from 'pg'

// Mock AuthService
jest.mock('./auth.service')

describe('Auth Middleware', () => {
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let mockNext: NextFunction
  let mockDb: Pool

  beforeEach(() => {
    mockReq = {
      headers: {},
      user: undefined
    }
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
    
    mockNext = jest.fn()
    mockDb = {} as Pool
    
    jest.clearAllMocks()
  })

  describe('createAuthMiddleware', () => {
    it('should authenticate valid token', () => {
      // Arrange
      mockReq.headers = { authorization: 'Bearer valid-token' }
      
      const { AuthService } = require('./auth.service')
      AuthService.prototype.verifyAccessToken = jest.fn().mockReturnValue({
        userId: 'test-user-id',
        email: 'test@example.com',
        role: 'student'
      })

      const middleware = createAuthMiddleware(mockDb)

      // Act
      middleware(mockReq as Request, mockRes as Response, mockNext)

      // Assert
      expect(AuthService.prototype.verifyAccessToken).toHaveBeenCalledWith('valid-token')
      expect(mockReq.user).toEqual({
        userId: 'test-user-id',
        email: 'test@example.com',
        role: 'student'
      })
      expect(mockNext).toHaveBeenCalled()
      expect(mockRes.status).not.toHaveBeenCalled()
    })

    it('should return 401 when no token provided', () => {
      // Arrange
      mockReq.headers = {}
      const middleware = createAuthMiddleware(mockDb)

      // Act
      middleware(mockReq as Request, mockRes as Response, mockNext)

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Access token required'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return 401 when authorization header is malformed', () => {
      // Arrange
      mockReq.headers = { authorization: 'InvalidFormat' }
      const middleware = createAuthMiddleware(mockDb)

      // Act
      middleware(mockReq as Request, mockRes as Response, mockNext)

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Access token required'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return 403 for invalid token', () => {
      // Arrange
      mockReq.headers = { authorization: 'Bearer invalid-token' }
      
      const { AuthService } = require('./auth.service')
      AuthService.prototype.verifyAccessToken = jest.fn().mockImplementation(() => {
        throw new Error('Invalid token')
      })

      const middleware = createAuthMiddleware(mockDb)

      // Act
      middleware(mockReq as Request, mockRes as Response, mockNext)

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(403)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid or expired token'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('requireRole', () => {
    it('should allow access for user with required role', () => {
      // Arrange
      mockReq.user = {
        userId: 'test-user-id',
        email: 'test@example.com',
        role: 'admin'
      }

      const middleware = requireRole(['admin'])

      // Act
      middleware(mockReq as Request, mockRes as Response, mockNext)

      // Assert
      expect(mockNext).toHaveBeenCalled()
      expect(mockRes.status).not.toHaveBeenCalled()
    })

    it('should allow access when user has one of multiple required roles', () => {
      // Arrange
      mockReq.user = {
        userId: 'test-user-id',
        email: 'test@example.com',
        role: 'student'
      }

      const middleware = requireRole(['admin', 'student'])

      // Act
      middleware(mockReq as Request, mockRes as Response, mockNext)

      // Assert
      expect(mockNext).toHaveBeenCalled()
      expect(mockRes.status).not.toHaveBeenCalled()
    })

    it('should return 401 when user is not authenticated', () => {
      // Arrange
      mockReq.user = undefined
      const middleware = requireRole(['admin'])

      // Act
      middleware(mockReq as Request, mockRes as Response, mockNext)

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Authentication required'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('should return 403 when user does not have required role', () => {
      // Arrange
      mockReq.user = {
        userId: 'test-user-id',
        email: 'test@example.com',
        role: 'student'
      }

      const middleware = requireRole(['admin'])

      // Act
      middleware(mockReq as Request, mockRes as Response, mockNext)

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(403)
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Insufficient permissions'
      })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})