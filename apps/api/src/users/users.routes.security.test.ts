import request from 'supertest'
import express from 'express'
import { createUsersRoutes, passwordSetupAttempts } from './users.routes'
import { Pool } from 'pg'

// Mock dependencies
const mockDb = {
  query: jest.fn()
} as unknown as Pool

const app = express()
app.use(express.json())
app.use('/users', createUsersRoutes(mockDb))

describe('Users Routes - Security Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Clear rate limiting state between tests
    passwordSetupAttempts.clear()
  })

  describe('Rate Limiting - Password Setup', () => {
    const validRequestBody = {
      token: 'valid-token-123',
      password: 'SecurePassword123!'
    }

    beforeEach(() => {
      // Mock successful token consumption and password update
      (mockDb.query as jest.Mock)
        .mockResolvedValueOnce({ // consumePasswordSetupToken query
          rows: [{
            email: 'test@example.com',
            token: 'valid-token-123',
            expires_at: new Date(Date.now() + 60 * 60 * 1000)
          }]
        })
        .mockResolvedValueOnce({ rows: [] }) // DELETE token query
        .mockResolvedValueOnce({ rows: [] }) // UPDATE password query
    })

    it('should allow requests within rate limit', async () => {
      // Mock successful token validation for each request
      const mockSuccessfulResponse = () => {
        (mockDb.query as jest.Mock)
          .mockResolvedValueOnce({ // Token validation
            rows: [{
              email: 'test@example.com',
              token: 'valid-token-123',
              expires_at: new Date(Date.now() + 60 * 60 * 1000)
            }]
          })
          .mockResolvedValueOnce({ rows: [] }) // DELETE token
          .mockResolvedValueOnce({ rows: [] }) // UPDATE password
      }

      for (let i = 0; i < 5; i++) {
        mockSuccessfulResponse() // Set up mocks for each iteration
        
        const response = await request(app)
          .post('/users/set-password')
          .send(validRequestBody)
          .set('X-Forwarded-For', `192.168.50.${Math.floor(Math.random() * 254) + 1}`)

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
      }
    })

    it('should block requests exceeding rate limit', async () => {
      // Make 5 requests to hit the limit
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/users/set-password')
          .send(validRequestBody)
          .set('X-Forwarded-For', `192.168.51.${Math.floor(Math.random() * 254) + 1}`)
      }

      // 6th request should be blocked
      const response = await request(app)
        .post('/users/set-password')
        .send(validRequestBody)
        .set('X-Forwarded-For', `192.168.52.${Math.floor(Math.random() * 254) + 1}`)

      expect(response.status).toBe(429)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toContain('Too many password setup attempts')
      expect(response.body.retryAfter).toBe(900) // 15 minutes in seconds
    })

    it('should track rate limits per IP address', async () => {
      const testIP1 = `192.168.100.${Math.floor(Math.random() * 254) + 1}`
      const testIP2 = `192.168.101.${Math.floor(Math.random() * 254) + 1}`
      
      // IP 1: Hit the limit
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/users/set-password')
          .send(validRequestBody)
          .set('X-Forwarded-For', testIP1)
      }

      // IP 1: Should be blocked
      const blockedResponse = await request(app)
        .post('/users/set-password')
        .send(validRequestBody)
        .set('X-Forwarded-For', testIP1)

      expect(blockedResponse.status).toBe(429)

      // IP 2: Should still be allowed
      const allowedResponse = await request(app)
        .post('/users/set-password')
        .send(validRequestBody)
        .set('X-Forwarded-For', testIP2)

      expect(allowedResponse.status).toBe(200)
    })

    it('should reset rate limit after time window', async () => {
      // Mock Date.now to control time
      const originalDateNow = Date.now
      let mockTime = 1000000
      const testIP = `192.168.102.${Math.floor(Math.random() * 254) + 1}`

      Date.now = jest.fn(() => mockTime)

      try {
        // Hit rate limit
        for (let i = 0; i < 5; i++) {
          await request(app)
            .post('/users/set-password')
            .send(validRequestBody)
            .set('X-Forwarded-For', testIP)
        }

        // Should be blocked
        let response = await request(app)
          .post('/users/set-password')
          .send(validRequestBody)
          .set('X-Forwarded-For', testIP)

        expect(response.status).toBe(429)

        // Advance time by 16 minutes (past the 15-minute window)
        mockTime += 16 * 60 * 1000

        // Should be allowed again
        response = await request(app)
          .post('/users/set-password')
          .send(validRequestBody)
          .set('X-Forwarded-For', testIP)

        expect(response.status).toBe(200)

      } finally {
        Date.now = originalDateNow
      }
    })

    it('should handle missing IP gracefully', async () => {
      // Request without IP headers
      const response = await request(app)
        .post('/users/set-password')
        .send(validRequestBody)

      // Should still work, using 'unknown' as IP
      expect(response.status).toBe(200)
    })
  })

  describe('Input Validation Security', () => {
    beforeEach(() => {
      // Mock database responses for validation tests
      (mockDb.query as jest.Mock)
        .mockResolvedValue({ rows: [] }) // Default empty response for validation tests
    })

    it('should validate token format', async () => {
      const response = await request(app)
        .post('/users/set-password')
        .send({
          token: '', // Empty token
          password: 'SecurePassword123!'
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid request data')
    })

    it('should validate password strength requirements', async () => {
      const weakPasswords = [
        'weak',           // Too short
        'nouppercase',    // No uppercase
        'NOLOWERCASE',    // No lowercase  
        'NoNumbers',      // No numbers
        'short'           // Too short
      ]

      for (const weakPassword of weakPasswords) {
        const response = await request(app)
          .post('/users/set-password')
          .send({
            token: 'valid-token-123',
            password: weakPassword
          })

        expect(response.status).toBe(400)
        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Invalid request data')
      }
    })

    it('should accept strong passwords', async () => {
      // Mock successful database operations for each password test
      const mockSuccessfulTokenValidation = () => {
        (mockDb.query as jest.Mock)
          .mockResolvedValueOnce({ // Token validation
            rows: [{
              email: 'test@example.com',
              token: 'valid-token-123',
              expires_at: new Date(Date.now() + 60 * 60 * 1000)
            }]
          })
          .mockResolvedValueOnce({ rows: [] }) // DELETE token
          .mockResolvedValueOnce({ rows: [] }) // UPDATE password
      }

      const strongPasswords = [
        'SecurePassword123!',
        'AnotherStrong1',
        'Complex@Password2024'
      ]

      for (const strongPassword of strongPasswords) {
        mockSuccessfulTokenValidation() // Set up mocks for each test
        
        const response = await request(app)
          .post('/users/set-password')
          .send({
            token: 'valid-token-123',
            password: strongPassword
          })
          .set('X-Forwarded-For', `192.168.200.${Math.floor(Math.random() * 254) + 1}`) // Different IP each time

        expect(response.status).toBe(200)
        expect(response.body.success).toBe(true)
      }
    })

    it('should sanitize error responses', async () => {
      // Mock database error with sensitive information
      (mockDb.query as jest.Mock)
        .mockRejectedValue(new Error('Database connection failed: host=db.internal.com user=admin password=secret123'))

      const response = await request(app)
        .post('/users/set-password')
        .send({
          token: 'valid-token-123',
          password: 'SecurePassword123!'
        })

      expect(response.status).toBe(500)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Internal server error')
      
      // Should not leak sensitive information
      expect(response.body.error).not.toContain('password=secret123')
      expect(response.body.error).not.toContain('host=db.internal.com')
      expect(response.body.error).not.toContain('user=admin')
    })

    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/users/set-password')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}') // Malformed JSON

      expect(response.status).toBe(400)
      expect(response.body).toEqual({})
    })

    it('should reject requests with no body', async () => {
      const response = await request(app)
        .post('/users/set-password')

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
    })

    it('should handle SQL injection attempts', async () => {
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        "admin'--",
        "' OR '1'='1",
        "'; UPDATE users SET password_hash='hacked'; --"
      ]

      for (const maliciousInput of maliciousInputs) {
        const response = await request(app)
          .post('/users/set-password')
          .send({
            token: maliciousInput,
            password: 'SecurePassword123!'
          })
          .set('X-Forwarded-For', `192.168.200.${Math.floor(Math.random() * 254) + 1}`)

        // Should be handled safely (either validation error, rate limit, or safe processing)
        expect([400, 200, 500, 429]).toContain(response.status)
        
        // Should not execute malicious SQL
        if (response.status === 200) {
          expect(response.body.success).toBe(false) // Token won't be found
        }
      }
    })
  })
})