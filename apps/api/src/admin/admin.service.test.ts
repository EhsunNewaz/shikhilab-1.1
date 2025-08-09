import { Pool } from 'pg'
import { AdminService } from './admin.service'
import { EmailService, MockEmailProvider } from '../email'
import { UsersService } from '../users/users.service'

// Mock the UsersService
jest.mock('../users/users.service')
const MockedUsersService = UsersService as jest.MockedClass<typeof UsersService>

// Mock the database
const mockDb = {
  connect: jest.fn(),
  query: jest.fn(),
} as unknown as Pool

const mockClient = {
  query: jest.fn(),
  release: jest.fn()
}

describe('AdminService', () => {
  let adminService: AdminService
  let emailService: EmailService
  let mockEmailProvider: MockEmailProvider
  let mockUsersService: jest.Mocked<UsersService>

  beforeEach(() => {
    jest.clearAllMocks()
    mockEmailProvider = new MockEmailProvider()
    emailService = new EmailService(mockEmailProvider, 'test@example.com')
    
    // Mock UsersService
    mockUsersService = {
      createUser: jest.fn().mockResolvedValue({ id: 'new-user-id' }),
      getUserByEmail: jest.fn().mockResolvedValue(null)
    } as any
    MockedUsersService.mockImplementation(() => mockUsersService)
    
    adminService = new AdminService(mockDb, emailService)
    
    // Mock the connect method to return our mock client
    ;(mockDb.connect as jest.Mock).mockResolvedValue(mockClient)
  })

  describe('getPendingEnrollments', () => {
    it('should return pending enrollments with course information', async () => {
      const mockEnrollments = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          full_name: 'John Doe',
          email: 'john@example.com',
          transaction_id: 'TXN123456789',
          created_at: '2025-01-08T10:00:00Z',
          course_title: 'IELTS Preparation Course'
        }
      ]

      ;(mockDb.query as jest.Mock).mockResolvedValue({ rows: mockEnrollments })

      const result = await adminService.getPendingEnrollments()

      expect(result).toEqual(mockEnrollments)
      expect(mockDb.query).toHaveBeenCalledWith(expect.stringContaining('WHERE e.status = \'pending\''))
    })

    it('should return empty array when no pending enrollments', async () => {
      (mockDb.query as jest.Mock).mockResolvedValue({ rows: [] })

      const result = await adminService.getPendingEnrollments()

      expect(result).toEqual([])
    })
  })

  describe('getEnrollmentCapacityInfo', () => {
    it('should return capacity information for specific course', async () => {
      const courseId = '123e4567-e89b-12d3-a456-426614174000'
      const mockCapacityData = {
        total_capacity: '50',
        current_approved: '20',
        current_pending: '5'
      }

      ;(mockDb.query as jest.Mock).mockResolvedValue({ rows: [mockCapacityData] })

      const result = await adminService.getEnrollmentCapacityInfo(courseId)

      expect(result).toEqual({
        total_capacity: 50,
        current_approved: 20,
        current_pending: 5,
        available_slots: 25
      })
    })

    it('should return aggregate capacity when no courseId provided', async () => {
      const mockCapacityData = {
        total_capacity: '100',
        current_approved: '40',
        current_pending: '10'
      }

      ;(mockDb.query as jest.Mock).mockResolvedValue({ rows: [mockCapacityData] })

      const result = await adminService.getEnrollmentCapacityInfo()

      expect(result.available_slots).toBe(50)
    })
  })

  describe('approveEnrollment', () => {
    const enrollmentId = '123e4567-e89b-12d3-a456-426614174000'
    const mockEnrollment = {
      id: enrollmentId,
      course_id: '456e7890-e89b-12d3-a456-426614174001',
      full_name: 'John Doe',
      email: 'john@example.com',
      transaction_id: 'TXN123456789',
      status: 'pending'
    }

    beforeEach(() => {
      // Reset all mocks before each test
      jest.clearAllMocks()
      mockClient.query.mockReset()
      
      // Reset the UsersService mock
      mockUsersService.createUser.mockReset().mockResolvedValue({ id: 'new-user-id' })
      mockUsersService.getUserByEmail.mockReset().mockResolvedValue(null)
      
      // Reset email provider mock
      jest.restoreAllMocks()
      mockEmailProvider.send = jest.fn().mockResolvedValue({ success: true })
      
      // Mock capacity info to allow enrollment
      jest.spyOn(adminService, 'getEnrollmentCapacityInfo').mockReset().mockResolvedValue({
        total_capacity: 100,
        current_enrollments: 50,
        available_slots: 50
      })
      
      // Mock successful transaction flow
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [mockEnrollment] }) // Get enrollment
        .mockResolvedValueOnce({ rows: [] }) // Check existing user
        .mockResolvedValueOnce({ rows: [{ id: 'new-user-id' }] }) // Create user (mocked via UsersService)
        .mockResolvedValueOnce(undefined) // Update enrollment status
        .mockResolvedValueOnce(undefined) // Insert password token
        .mockResolvedValueOnce(undefined) // COMMIT
    })

    it('should approve enrollment and send password setup email', async () => {
      const result = await adminService.approveEnrollment(enrollmentId)

      expect(result.success).toBe(true)
      expect(result.passwordToken).toBeDefined()
      expect(result.emailSent).toBe(true)
      expect(mockClient.query).toHaveBeenCalledWith('BEGIN')
      expect(mockClient.query).toHaveBeenCalledWith('COMMIT')
    })

    it('should handle email sending failures gracefully', async () => {
      // Mock email failure
      jest.spyOn(mockEmailProvider, 'send').mockResolvedValue({
        success: false,
        error: 'Email service unavailable',
        retryable: true
      })

      const result = await adminService.approveEnrollment(enrollmentId)

      expect(result.success).toBe(true)
      expect(result.emailSent).toBe(false)
    })

    it('should rollback transaction on user creation failure', async () => {
      // Mock user service to throw error during user creation
      mockUsersService.createUser.mockRejectedValueOnce(
        new Error('User with this email already exists')
      )

      const result = await adminService.approveEnrollment(enrollmentId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Failed to create user account')
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK')
    })

    it('should return error when enrollment not found', async () => {
      // Create fresh service instance for this test to avoid mock pollution
      const freshEmailProvider = new MockEmailProvider()
      const freshEmailService = new EmailService(freshEmailProvider, 'test@example.com')
      const freshAdminService = new AdminService(mockDb, freshEmailService)
      
      // Clear and set up fresh mocks
      const freshMockClient = {
        query: jest.fn(),
        release: jest.fn()
      }
      
      ;(mockDb.connect as jest.Mock).mockResolvedValueOnce(freshMockClient)
      
      freshMockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // Get enrollment (not found)
        .mockResolvedValueOnce(undefined) // ROLLBACK

      const result = await freshAdminService.approveEnrollment(enrollmentId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Enrollment not found or already processed')
      expect(freshMockClient.query).toHaveBeenCalledWith('ROLLBACK')
    })
  })

  describe('rejectEnrollment', () => {
    const enrollmentId = '123e4567-e89b-12d3-a456-426614174000'

    it('should reject enrollment successfully', async () => {
      const mockEnrollment = {
        id: enrollmentId,
        email: 'john@example.com'
      }

      ;(mockDb.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockEnrollment] }) // Check enrollment exists
        .mockResolvedValueOnce(undefined) // Update enrollment status

      const result = await adminService.rejectEnrollment(enrollmentId)

      expect(result.success).toBe(true)
      expect(mockDb.query).toHaveBeenCalledWith(
        'UPDATE enrollments SET status = $1, updated_at = NOW() WHERE id = $2',
        ['rejected', enrollmentId]
      )
    })

    it('should return error when enrollment not found', async () => {
      (mockDb.query as jest.Mock).mockResolvedValueOnce({ rows: [] })

      const result = await adminService.rejectEnrollment(enrollmentId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Enrollment not found or already processed')
    })
  })

  describe('validatePasswordSetupToken', () => {
    const validToken = 'valid-token-123'
    const expiredToken = 'expired-token-123'

    it('should validate non-expired token', async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      
      ;(mockDb.query as jest.Mock).mockResolvedValue({
        rows: [{ 
          email: 'john@example.com', 
          expires_at: futureDate,
          token: validToken  // Include the token field that the method expects
        }]
      })

      const result = await adminService.validatePasswordSetupToken(validToken)

      expect(result.valid).toBe(true)
      expect(result.email).toBe('john@example.com')
    })

    it('should invalidate expired token', async () => {
      const pastDate = new Date(Date.now() - 1000).toISOString()
      
      ;(mockDb.query as jest.Mock)
        .mockResolvedValueOnce({ 
          rows: [{ 
            email: 'john@example.com', 
            expires_at: pastDate,
            token: expiredToken  // Include the token field that the method expects
          }] 
        })
        .mockResolvedValueOnce(undefined) // Delete expired token

      const result = await adminService.validatePasswordSetupToken(expiredToken)

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Token has expired')
    })

    it('should return error for invalid token', async () => {
      (mockDb.query as jest.Mock).mockResolvedValue({ rows: [] })

      const result = await adminService.validatePasswordSetupToken('invalid-token')

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Invalid token')
    })
  })
})