import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthService } from './auth.service'
import { User } from 'shared'

// Mock dependencies
jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
const mockJwt = jwt as jest.Mocked<typeof jwt>

describe('AuthService', () => {
  let authService: AuthService
  let mockDb: jest.Mocked<Pool>
  let mockUser: User

  beforeEach(() => {
    // Mock database
    mockDb = {
      query: jest.fn(),
      end: jest.fn(),
    } as any

    // Mock environment variables
    process.env.JWT_SECRET = 'test-secret'
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret'

    authService = new AuthService(mockDb, 'test-secret', 'test-refresh-secret', '15m', '7d')

    // Mock user data
    mockUser = {
      id: 'test-user-id',
      full_name: 'Test User',
      email: 'test@example.com',
      password_hash: 'hashedpassword',
      role: 'student',
      ai_credits: 500,
      target_band_score: 7.0,
      target_test_date: '2024-12-01',
      interface_language: 'en',
      ai_feedback_language: 'bn',
      gamification_opt_out: false,
      gamification_is_anonymous: false,
      current_streak: 0,
      points_balance: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const credentials = { email: 'test@example.com', password: 'password123' }
      mockDb.query.mockResolvedValue({ rows: [mockUser] })
      mockBcrypt.compare.mockResolvedValue(true)
      mockJwt.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token')

      // Act
      const result = await authService.login(credentials)

      // Assert
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM users WHERE email = $1', ['test@example.com'])
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword')
      expect(result.user.email).toBe('test@example.com')
      expect(result.user).not.toHaveProperty('password_hash')
      expect(result.accessToken).toBe('access-token')
      expect(result.refreshToken).toBe('refresh-token')
    })

    it('should throw error for non-existent user', async () => {
      // Arrange
      const credentials = { email: 'nonexistent@example.com', password: 'password123' }
      mockDb.query.mockResolvedValue({ rows: [] })

      // Act & Assert
      await expect(authService.login(credentials)).rejects.toThrow('Invalid email or password')
      expect(mockBcrypt.compare).not.toHaveBeenCalled()
    })

    it('should throw error for invalid password', async () => {
      // Arrange
      const credentials = { email: 'test@example.com', password: 'wrongpassword' }
      mockDb.query.mockResolvedValue({ rows: [mockUser] })
      mockBcrypt.compare.mockResolvedValue(false)

      // Act & Assert
      await expect(authService.login(credentials)).rejects.toThrow('Invalid email or password')
    })
  })

  describe('refreshAccessToken', () => {
    it('should successfully refresh access token with valid refresh token', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token'
      mockJwt.verify.mockReturnValue({ userId: 'test-user-id' })
      mockDb.query.mockResolvedValue({ rows: [mockUser] })
      mockJwt.sign.mockReturnValue('new-access-token')

      // Act
      const result = await authService.refreshAccessToken(refreshToken)

      // Assert
      expect(mockJwt.verify).toHaveBeenCalledWith(refreshToken, 'test-refresh-secret')
      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = $1', ['test-user-id'])
      expect(result).toBe('new-access-token')
    })

    it('should throw error for invalid refresh token', async () => {
      // Arrange
      const refreshToken = 'invalid-refresh-token'
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      // Act & Assert
      await expect(authService.refreshAccessToken(refreshToken)).rejects.toThrow('Invalid refresh token')
    })

    it('should throw error when user not found', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token'
      mockJwt.verify.mockReturnValue({ userId: 'nonexistent-user-id' })
      mockDb.query.mockResolvedValue({ rows: [] })

      // Act & Assert
      await expect(authService.refreshAccessToken(refreshToken)).rejects.toThrow('User not found')
    })
  })

  describe('verifyAccessToken', () => {
    it('should successfully verify valid access token', () => {
      // Arrange
      const token = 'valid-access-token'
      const mockDecoded = { userId: 'test-user-id', email: 'test@example.com', role: 'student' }
      mockJwt.verify.mockReturnValue(mockDecoded)

      // Act
      const result = authService.verifyAccessToken(token)

      // Assert
      expect(mockJwt.verify).toHaveBeenCalledWith(token, 'test-secret')
      expect(result).toEqual(mockDecoded)
    })

    it('should throw error for invalid access token', () => {
      // Arrange
      const token = 'invalid-access-token'
      mockJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token')
      })

      // Act & Assert
      expect(() => authService.verifyAccessToken(token)).toThrow('Invalid access token')
    })
  })
})