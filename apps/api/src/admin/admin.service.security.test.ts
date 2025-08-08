import { AdminService } from './admin.service'
import { Pool } from 'pg'
import crypto from 'crypto'

// Mock dependencies
const mockDb = {
  query: jest.fn(),
  connect: jest.fn()
} as unknown as Pool

const mockEmailService = {
  sendEmail: jest.fn()
}

describe('AdminService - Security Tests', () => {
  let adminService: AdminService
  let originalConsoleError: any

  beforeEach(() => {
    adminService = new AdminService(mockDb, mockEmailService as any)
    jest.clearAllMocks()
    originalConsoleError = console.error
    console.error = jest.fn() // Suppress error logs in tests
  })

  afterEach(() => {
    console.error = originalConsoleError
  })

  describe('Password Setup Token Security', () => {
    describe('createPasswordSetupToken', () => {
      it('should generate cryptographically secure tokens', async () => {
        const mockQuery = jest.fn().mockResolvedValue({ rows: [] })
        ;(mockDb.query as jest.Mock) = mockQuery

        const email = 'test@example.com'
        const token1 = await adminService.createPasswordSetupToken(email)
        const token2 = await adminService.createPasswordSetupToken(email)

        // Tokens should be different
        expect(token1).not.toBe(token2)
        
        // Tokens should be 64 characters (32 bytes hex encoded)
        expect(token1).toHaveLength(64)
        expect(token2).toHaveLength(64)
        
        // Tokens should be hex strings
        expect(/^[0-9a-f]{64}$/.test(token1)).toBe(true)
        expect(/^[0-9a-f]{64}$/.test(token2)).toBe(true)
      })

      it('should set proper expiration time (24 hours)', async () => {
        const mockQuery = jest.fn().mockResolvedValue({ rows: [] })
        ;(mockDb.query as jest.Mock) = mockQuery

        const email = 'test@example.com'
        const beforeTime = new Date(Date.now() + 23.9 * 60 * 60 * 1000) // 23.9 hours from now
        
        await adminService.createPasswordSetupToken(email)
        
        expect(mockQuery).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO password_setup_tokens'),
          expect.arrayContaining([
            expect.any(String), // token
            email,
            expect.any(Date) // expires_at
          ])
        )

        const callArgs = mockQuery.mock.calls[0][1]
        const expiresAt = callArgs[2]
        
        // Should expire approximately 24 hours from now
        expect(expiresAt.getTime()).toBeGreaterThan(beforeTime.getTime())
        expect(expiresAt.getTime()).toBeLessThan(Date.now() + 24.1 * 60 * 60 * 1000)
      })
    })

    describe('validatePasswordSetupToken - Timing Attack Prevention', () => {
      it('should use constant-time comparison for token validation', async () => {
        const validToken = 'a'.repeat(64)
        const invalidToken = 'b'.repeat(64)

        // Mock database response for valid token
        const mockQuery = jest.fn()
          .mockResolvedValueOnce({
            rows: [{
              token: validToken,
              email: 'test@example.com',
              expires_at: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
            }]
          })
          .mockResolvedValueOnce({ rows: [] }) // Invalid token response

        ;(mockDb.query as jest.Mock) = mockQuery

        // Measure timing for valid and invalid tokens
        const timeValidToken = async () => {
          const start = process.hrtime.bigint()
          await adminService.validatePasswordSetupToken(validToken)
          const end = process.hrtime.bigint()
          return Number(end - start)
        }

        const timeInvalidToken = async () => {
          const start = process.hrtime.bigint()
          await adminService.validatePasswordSetupToken(invalidToken)
          const end = process.hrtime.bigint()
          return Number(end - start)
        }

        const validTime = await timeValidToken()
        const invalidTime = await timeInvalidToken()

        // Times should be similar (within reasonable variance for testing)
        // This test ensures we're not leaking timing information
        const timeDifference = Math.abs(validTime - invalidTime)
        const averageTime = (validTime + invalidTime) / 2
        const variancePercentage = (timeDifference / averageTime) * 100

        // Allow for some variance due to system factors, but should be minimal
        expect(variancePercentage).toBeLessThan(50) // Less than 50% variance
      })

      it('should clean up expired tokens', async () => {
        const expiredToken = 'expired-token'
        const mockQuery = jest.fn()
          .mockResolvedValueOnce({
            rows: [{
              token: expiredToken,
              email: 'test@example.com',
              expires_at: new Date(Date.now() - 60 * 1000) // Expired 1 minute ago
            }]
          })
          .mockResolvedValueOnce({ rows: [] }) // DELETE response

        ;(mockDb.query as jest.Mock) = mockQuery

        const result = await adminService.validatePasswordSetupToken(expiredToken)

        expect(result.valid).toBe(false)
        expect(result.error).toBe('Token has expired')
        
        // Should have called DELETE to clean up expired token
        expect(mockQuery).toHaveBeenCalledWith(
          'DELETE FROM password_setup_tokens WHERE token = $1',
          [expiredToken]
        )
      })

      it('should handle non-existent tokens securely', async () => {
        const nonExistentToken = 'non-existent-token'
        const mockQuery = jest.fn().mockResolvedValue({ rows: [] })
        ;(mockDb.query as jest.Mock) = mockQuery

        const result = await adminService.validatePasswordSetupToken(nonExistentToken)

        expect(result.valid).toBe(false)
        expect(result.error).toBe('Invalid token')
      })
    })

    describe('consumePasswordSetupToken', () => {
      it('should remove token after successful validation', async () => {
        const validToken = 'valid-token'
        
        // Mock validatePasswordSetupToken to return valid
        const mockValidate = jest.spyOn(adminService, 'validatePasswordSetupToken')
          .mockResolvedValue({ valid: true, email: 'test@example.com' })
        
        const mockQuery = jest.fn().mockResolvedValue({ rows: [] })
        ;(mockDb.query as jest.Mock) = mockQuery

        const result = await adminService.consumePasswordSetupToken(validToken)

        expect(result.success).toBe(true)
        expect(result.email).toBe('test@example.com')
        
        // Should delete the token
        expect(mockQuery).toHaveBeenCalledWith(
          'DELETE FROM password_setup_tokens WHERE token = $1',
          [validToken]
        )

        mockValidate.mockRestore()
      })

      it('should not remove invalid tokens', async () => {
        const invalidToken = 'invalid-token'
        
        // Mock validatePasswordSetupToken to return invalid
        const mockValidate = jest.spyOn(adminService, 'validatePasswordSetupToken')
          .mockResolvedValue({ valid: false, error: 'Invalid token' })
        
        const mockQuery = jest.fn()
        ;(mockDb.query as jest.Mock) = mockQuery

        const result = await adminService.consumePasswordSetupToken(invalidToken)

        expect(result.success).toBe(false)
        expect(result.error).toBe('Invalid token')
        
        // Should NOT delete anything
        expect(mockQuery).not.toHaveBeenCalledWith(
          expect.stringContaining('DELETE'),
          expect.any(Array)
        )

        mockValidate.mockRestore()
      })
    })
  })

  describe('Enrollment Approval Security', () => {
    it('should prevent duplicate approvals', async () => {
      const enrollmentId = 'test-enrollment-id'
      
      const mockClient = {
        query: jest.fn()
          .mockResolvedValueOnce(undefined) // BEGIN
          .mockResolvedValueOnce({ rows: [] }) // No pending enrollment found
          .mockResolvedValueOnce(undefined), // ROLLBACK
        release: jest.fn()
      }

      const mockConnect = jest.fn().mockResolvedValue(mockClient)
      ;(mockDb.connect as jest.Mock) = mockConnect

      const result = await adminService.approveEnrollment(enrollmentId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Enrollment not found or already processed')
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK')
    })

    it('should enforce capacity limits', async () => {
      const enrollmentId = 'test-enrollment-id'
      
      const mockClient = {
        query: jest.fn()
          .mockResolvedValueOnce(undefined) // BEGIN
          .mockResolvedValueOnce({ // Enrollment found
            rows: [{
              id: enrollmentId,
              course_id: 'course-id',
              full_name: 'Test User',
              email: 'test@example.com'
            }]
          })
          .mockResolvedValueOnce(undefined), // ROLLBACK
        release: jest.fn()
      }

      const mockConnect = jest.fn().mockResolvedValue(mockClient)
      ;(mockDb.connect as jest.Mock) = mockConnect

      // Mock getEnrollmentCapacityInfo to return no available slots
      const mockCapacityInfo = jest.spyOn(adminService, 'getEnrollmentCapacityInfo')
        .mockResolvedValue({
          total_capacity: 50,
          current_approved: 45,
          current_pending: 5,
          available_slots: 0
        })

      const result = await adminService.approveEnrollment(enrollmentId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Course capacity exceeded')
      expect(mockClient.query).toHaveBeenCalledWith('ROLLBACK')

      mockCapacityInfo.mockRestore()
    })
  })

  describe('Error Handling Security', () => {
    it('should not leak sensitive information in error messages', async () => {
      const mockQuery = jest.fn().mockRejectedValue(new Error('Database connection failed: password=secret123'))
      ;(mockDb.query as jest.Mock) = mockQuery

      const result = await adminService.validatePasswordSetupToken('any-token')

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Internal server error')
      expect(result.error).not.toContain('password=secret123')
      expect(result.error).not.toContain('Database connection failed')
    })

    it('should handle database errors gracefully in approval process', async () => {
      const enrollmentId = 'test-id'
      
      const mockClient = {
        query: jest.fn()
          .mockResolvedValueOnce(undefined) // BEGIN
          .mockRejectedValueOnce(new Error('Database error with sensitive info: user=admin password=secret')),
        release: jest.fn()
      }

      const mockConnect = jest.fn().mockResolvedValue(mockClient)
      ;(mockDb.connect as jest.Mock) = mockConnect

      const result = await adminService.approveEnrollment(enrollmentId)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Internal server error during approval')
      expect(result.error).not.toContain('sensitive info')
      expect(result.error).not.toContain('password=secret')
    })
  })
})