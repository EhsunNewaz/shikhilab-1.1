import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import { UsersService } from './users.service'

jest.mock('bcryptjs')

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>

describe('UsersService', () => {
  let usersService: UsersService
  let mockDb: jest.Mocked<Pool>

  beforeEach(() => {
    mockDb = {
      query: jest.fn(),
      end: jest.fn(),
    } as any

    usersService = new UsersService(mockDb)

    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'student' as const,
      }

      const mockCreatedUser = {
        id: 'new-user-id',
        full_name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        ai_credits: 500,
        target_band_score: null,
        target_test_date: null,
        interface_language: 'en',
        ai_feedback_language: 'bn',
        gamification_opt_out: false,
        gamification_is_anonymous: false,
        current_streak: 0,
        points_balance: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      // Mock database queries
      mockDb.query
        .mockResolvedValueOnce({ rows: [] }) // Check existing user
        .mockResolvedValueOnce({ rows: [mockCreatedUser] }) // Insert new user

      mockBcrypt.hash.mockResolvedValue('hashed-password')

      const result = await usersService.createUser(userData)

      expect(mockDb.query).toHaveBeenCalledTimes(2)
      expect(mockBcrypt.hash).toHaveBeenCalledWith('password123', 12)
      expect(result.email).toBe('john@example.com')
      expect(result).not.toHaveProperty('password_hash')
    })

    it('should throw error when user with email already exists', async () => {
      const userData = {
        full_name: 'John Doe',
        email: 'existing@example.com',
        password: 'password123',
        role: 'student' as const,
      }

      // Mock existing user found
      mockDb.query.mockResolvedValue({ rows: [{ id: 'existing-id' }] })

      await expect(usersService.createUser(userData)).rejects.toThrow('User with this email already exists')
      expect(mockBcrypt.hash).not.toHaveBeenCalled()
    })

    it('should create user with custom parameters', async () => {
      const userData = {
        full_name: 'Admin User',
        email: 'admin@example.com',
        password: 'adminpass123',
        role: 'admin' as const,
        ai_credits: 1000,
        target_band_score: 8.5,
        interface_language: 'es',
        ai_feedback_language: 'es',
        gamification_opt_out: true
      }

      const mockCreatedUser = {
        id: 'admin-user-id',
        ...userData,
        current_streak: 0,
        points_balance: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      mockDb.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [mockCreatedUser] })

      mockBcrypt.hash.mockResolvedValue('hashed-password')

      const result = await usersService.createUser(userData)

      expect(result.role).toBe('admin')
      expect(result.ai_credits).toBe(1000)
      expect(result.target_band_score).toBe(8.5)
      expect(result.gamification_opt_out).toBe(true)
    })
  })

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: 'test-user-id',
        full_name: 'Test User',
        email: 'test@example.com',
        role: 'student',
        ai_credits: 500,
        current_streak: 5,
        points_balance: 100,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      mockDb.query.mockResolvedValue({ rows: [mockUser] })

      const result = await usersService.getUserById('test-user-id')

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, full_name, email'),
        ['test-user-id']
      )
      expect(result).toEqual(mockUser)
    })

    it('should return null when user not found', async () => {
      mockDb.query.mockResolvedValue({ rows: [] })

      const result = await usersService.getUserById('nonexistent-id')

      expect(result).toBeNull()
    })
  })

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        role: 'student'
      }

      mockDb.query.mockResolvedValue({ rows: [mockUser] })

      const result = await usersService.getUserByEmail('test@example.com')

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('FROM users WHERE email = $1'),
        ['test@example.com']
      )
      expect(result).toEqual(mockUser)
    })

    it('should return null when user not found', async () => {
      mockDb.query.mockResolvedValue({ rows: [] })

      const result = await usersService.getUserByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })
  })

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updates = {
        full_name: 'Updated Name',
        target_band_score: 7.5
      }

      const mockUpdatedUser = {
        id: 'test-user-id',
        full_name: 'Updated Name',
        email: 'test@example.com',
        target_band_score: 7.5,
        updated_at: '2024-01-02T00:00:00Z'
      }

      mockDb.query.mockResolvedValue({ rows: [mockUpdatedUser] })

      const result = await usersService.updateUser('test-user-id', updates)

      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        ['Updated Name', 7.5, 'test-user-id']
      )
      expect(result.full_name).toBe('Updated Name')
      expect(result.target_band_score).toBe(7.5)
    })

    it('should throw error when no valid fields to update', async () => {
      const updates = { invalid_field: 'value' } as any

      await expect(usersService.updateUser('test-user-id', updates)).rejects.toThrow('No valid fields to update')
      expect(mockDb.query).not.toHaveBeenCalled()
    })

    it('should throw error when user not found', async () => {
      const updates = { full_name: 'Updated Name' }

      mockDb.query.mockResolvedValue({ rows: [] })

      await expect(usersService.updateUser('nonexistent-id', updates)).rejects.toThrow('User not found')
    })
  })
})