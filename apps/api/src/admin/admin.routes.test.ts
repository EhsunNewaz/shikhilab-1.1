import request from 'supertest'
import express from 'express'
import { Pool } from 'pg'
import { createAdminRoutes } from './admin.routes'
import { createAuthMiddleware, requireRole } from '../auth/auth.middleware'

// Mock the auth middleware
jest.mock('../auth/auth.middleware')
const mockCreateAuthMiddleware = createAuthMiddleware as jest.Mock
const mockRequireRole = requireRole as jest.Mock

// Mock database
const mockDb = {
  query: jest.fn(),
  connect: jest.fn()
} as unknown as Pool

const mockClient = {
  query: jest.fn(),
  release: jest.fn()
}

describe('Admin Routes', () => {
  let app: express.Application

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock auth middleware to pass through
    mockCreateAuthMiddleware.mockReturnValue((req: any, res: any, next: any) => {
      req.user = { userId: 'admin-user-id', email: 'admin@example.com', role: 'admin' }
      next()
    })
    mockRequireRole.mockReturnValue((req: any, res: any, next: any) => next())
    
    // Setup Express app with admin routes
    app = express()
    app.use(express.json())
    app.use('/admin', createAdminRoutes(mockDb))

    ;(mockDb.connect as jest.Mock).mockResolvedValue(mockClient)
  })

  describe('GET /admin/enrollments', () => {
    it('should return pending enrollments', async () => {
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

      const response = await request(app)
        .get('/admin/enrollments')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toEqual(mockEnrollments)
      expect(response.body.count).toBe(1)
    })

    it('should handle database errors', async () => {
      (mockDb.query as jest.Mock).mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .get('/admin/enrollments')
        .expect(500)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Internal server error')
    })
  })

  describe('GET /admin/dashboard', () => {
    it('should return capacity information', async () => {
      const mockCapacity = {
        total_capacity: '50',
        current_approved: '20',
        current_pending: '5'
      }

      ;(mockDb.query as jest.Mock).mockResolvedValue({ rows: [mockCapacity] })

      const response = await request(app)
        .get('/admin/dashboard')
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('total_capacity')
      expect(response.body.data).toHaveProperty('available_slots')
    })
  })

  describe('PATCH /admin/enrollments/:id/approve', () => {
    const enrollmentId = '123e4567-e89b-12d3-a456-426614174000'

    it('should approve enrollment successfully', async () => {
      const mockEnrollment = {
        id: enrollmentId,
        course_id: '456e7890-e89b-12d3-a456-426614174001',
        full_name: 'John Doe',
        email: 'john@example.com',
        transaction_id: 'TXN123456789',
        status: 'pending'
      }

      // Mock successful transaction flow
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [mockEnrollment] }) // Get enrollment
        .mockResolvedValueOnce({ rows: [] }) // Check existing user
        .mockResolvedValueOnce({ rows: [{ id: 'new-user-id' }] }) // Create user
        .mockResolvedValueOnce(undefined) // Update enrollment status
        .mockResolvedValueOnce(undefined) // Insert password token
        .mockResolvedValueOnce(undefined) // COMMIT

      const response = await request(app)
        .patch(`/admin/enrollments/${enrollmentId}/approve`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('approved successfully')
      expect(response.body.data.enrollmentId).toBe(enrollmentId)
      expect(response.body.data.passwordTokenGenerated).toBe(true)
    })

    it('should return error for invalid enrollment ID', async () => {
      const response = await request(app)
        .patch('/admin/enrollments/invalid-id/approve')
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid enrollment ID format')
    })

    it('should handle approval failures', async () => {
      mockClient.query
        .mockResolvedValueOnce(undefined) // BEGIN
        .mockResolvedValueOnce({ rows: [] }) // Get enrollment (not found)

      const response = await request(app)
        .patch(`/admin/enrollments/${enrollmentId}/approve`)
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Enrollment not found or already processed')
    })
  })

  describe('PATCH /admin/enrollments/:id/reject', () => {
    const enrollmentId = '123e4567-e89b-12d3-a456-426614174000'

    it('should reject enrollment successfully', async () => {
      const mockEnrollment = {
        id: enrollmentId,
        email: 'john@example.com'
      }

      ;(mockDb.query as jest.Mock)
        .mockResolvedValueOnce({ rows: [mockEnrollment] }) // Check enrollment exists
        .mockResolvedValueOnce(undefined) // Update enrollment status

      const response = await request(app)
        .patch(`/admin/enrollments/${enrollmentId}/reject`)
        .expect(200)

      expect(response.body.success).toBe(true)
      expect(response.body.message).toContain('rejected successfully')
      expect(response.body.data.enrollmentId).toBe(enrollmentId)
    })

    it('should return error for invalid enrollment ID', async () => {
      const response = await request(app)
        .patch('/admin/enrollments/invalid-id/reject')
        .expect(400)

      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid enrollment ID format')
    })
  })

  describe('Authentication and Authorization', () => {
    it('should require authentication', async () => {
      // Mock auth middleware to reject request
      mockCreateAuthMiddleware.mockReturnValue((req: any, res: any, _next: any) => {
        res.status(401).json({ success: false, error: 'Access token required' })
      })

      // Recreate app with new middleware
      const newApp = express()
      newApp.use(express.json())
      newApp.use('/admin', createAdminRoutes(mockDb))

      const response = await request(newApp)
        .get('/admin/enrollments')
        .expect(401)

      expect(response.body.error).toBe('Access token required')
    })

    it('should require admin role', async () => {
      mockRequireRole.mockReturnValue((req: any, res: any, _next: any) => {
        res.status(403).json({ success: false, error: 'Insufficient permissions' })
      })

      // Recreate app with new middleware
      const newApp = express()
      newApp.use(express.json())
      newApp.use('/admin', createAdminRoutes(mockDb))

      const response = await request(newApp)
        .get('/admin/enrollments')
        .expect(403)

      expect(response.body.error).toBe('Insufficient permissions')
    })
  })
})