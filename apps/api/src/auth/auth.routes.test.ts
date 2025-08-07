import request from 'supertest'
import express from 'express'
import cookieParser from 'cookie-parser'
import { Pool } from 'pg'
import { createAuthRoutes } from './auth.routes'

// Mock AuthService
jest.mock('./auth.service', () => {
  return {
    AuthService: jest.fn().mockImplementation(() => ({
      login: jest.fn(),
      refreshAccessToken: jest.fn(),
      verifyAccessToken: jest.fn()
    }))
  }
})

const app = express()
app.use(express.json())
app.use(cookieParser())

const mockDb = {
  query: jest.fn(),
  end: jest.fn()
} as any

app.use('/auth', createAuthRoutes(mockDb))

describe('Auth Routes', () => {
  let mockAuthService: any

  beforeEach(() => {
    jest.clearAllMocks()
    const { AuthService } = require('./auth.service')
    mockAuthService = new AuthService()
  })

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: 'test-user-id',
        full_name: 'Test User',
        email: 'test@example.com',
        role: 'student'
      }

      // Mock successful login
      mockAuthService.login.mockResolvedValue({
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      })

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.user.email).toBe('test@example.com')
      expect(response.body.accessToken).toBe('access-token')
      expect(response.headers['set-cookie']).toBeDefined()
    })

    it('should return 400 for invalid request body', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'invalid-email' }) // Missing password

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Validation failed')
    })

    it('should return 401 for invalid credentials', async () => {
      mockAuthService.login.mockRejectedValue(new Error('Invalid email or password'))

      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid email or password')
    })

    it('should apply rate limiting', async () => {
      // This test would need to be run with a real rate limiter
      // For now, we'll just verify the structure
      const response = await request(app).post('/auth/login')
      expect(response.headers['x-ratelimit-limit']).toBeDefined()
    })
  })

  describe('POST /auth/refresh', () => {
    it('should refresh token successfully with valid refresh token', async () => {
      mockAuthService.refreshAccessToken.mockResolvedValue('new-access-token')

      const response = await request(app)
        .post('/auth/refresh')
        .set('Cookie', ['refreshToken=valid-refresh-token'])

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.accessToken).toBe('new-access-token')
    })

    it('should return 400 when refresh token is missing', async () => {
      const response = await request(app).post('/auth/refresh')

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Refresh token required')
    })

    it('should return 401 for invalid refresh token', async () => {
      mockAuthService.refreshAccessToken.mockRejectedValue(new Error('Invalid refresh token'))

      const response = await request(app)
        .post('/auth/refresh')
        .set('Cookie', ['refreshToken=invalid-refresh-token'])

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid refresh token')
    })
  })

  describe('POST /auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app).post('/auth/logout')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Logged out successfully')
      
      // Verify that the cookie is cleared
      const cookies = response.headers['set-cookie']
      expect(cookies).toBeDefined()
      expect(cookies[0]).toContain('refreshToken=')
    })
  })
})