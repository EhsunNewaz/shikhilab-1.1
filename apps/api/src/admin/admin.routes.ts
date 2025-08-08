import { Router } from 'express'
import type { Request, Response } from 'express'
import { Pool } from 'pg'
import { AdminService } from './admin.service'
import { createEmailService } from '../email'
import { 
  approveEnrollmentSchema,
  rejectEnrollmentSchema,
  getEnrollmentsQuerySchema 
} from './admin.validators'
import { createAuthMiddleware, requireRole } from '../auth/auth.middleware'

export function createAdminRoutes(db: Pool): Router {
  const router = Router()
  const emailService = createEmailService()
  const adminService = new AdminService(db, emailService)
  const authMiddleware = createAuthMiddleware(db)

  // Apply authentication and admin role requirement to all routes
  router.use(authMiddleware)
  router.use(requireRole(['admin']))

  // GET /admin/enrollments - Fetch pending enrollments
  router.get('/enrollments', async (req: Request, res: Response) => {
    try {
      const queryValidation = getEnrollmentsQuerySchema.safeParse(req.query)
      
      if (!queryValidation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid query parameters',
          details: queryValidation.error.errors
        })
      }

      const enrollments = await adminService.getPendingEnrollments()
      
      res.json({
        success: true,
        data: enrollments,
        count: enrollments.length
      })
    } catch (error) {
      console.error('Error fetching pending enrollments:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      })
    }
  })

  // GET /admin/dashboard - Get capacity and stats
  router.get('/dashboard', async (req: Request, res: Response) => {
    try {
      const capacityInfo = await adminService.getEnrollmentCapacityInfo()
      
      res.json({
        success: true,
        data: capacityInfo
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      })
    }
  })

  // PATCH /admin/enrollments/:id/approve - Approve enrollment
  router.patch('/enrollments/:id/approve', async (req: Request, res: Response) => {
    try {
      const validation = approveEnrollmentSchema.safeParse({ 
        enrollmentId: req.params.id 
      })
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid enrollment ID format',
          details: validation.error.errors
        })
      }

      const result = await adminService.approveEnrollment(validation.data.enrollmentId)
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        })
      }

      let message = 'Enrollment approved successfully'
      if (result.passwordToken && !result.emailSent) {
        message += ' (Warning: Password setup email could not be sent)'
      }

      res.json({
        success: true,
        message,
        data: {
          enrollmentId: validation.data.enrollmentId,
          passwordTokenGenerated: !!result.passwordToken,
          emailSent: result.emailSent || false
        }
      })
    } catch (error) {
      console.error('Error approving enrollment:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error during approval'
      })
    }
  })

  // PATCH /admin/enrollments/:id/reject - Reject enrollment
  router.patch('/enrollments/:id/reject', async (req: Request, res: Response) => {
    try {
      const validation = rejectEnrollmentSchema.safeParse({ 
        enrollmentId: req.params.id 
      })
      
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid enrollment ID format',
          details: validation.error.errors
        })
      }

      const result = await adminService.rejectEnrollment(validation.data.enrollmentId)
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: result.error
        })
      }

      res.json({
        success: true,
        message: 'Enrollment rejected successfully',
        data: {
          enrollmentId: validation.data.enrollmentId
        }
      })
    } catch (error) {
      console.error('Error rejecting enrollment:', error)
      res.status(500).json({
        success: false,
        error: 'Internal server error during rejection'
      })
    }
  })

  return router
}