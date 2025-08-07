import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { enrollmentService } from './enrollments.service'
import { CreateEnrollmentRequestSchema } from './enrollments.validators'

export const enrollmentsRouter = Router()

// POST /enrollments - Create a new enrollment
enrollmentsRouter.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = CreateEnrollmentRequestSchema.safeParse(req.body)
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: validationResult.error.errors.map(e => e.message).join(', ')
      })
    }

    const enrollmentData = validationResult.data

    // Create enrollment using service
    const result = await enrollmentService.createEnrollment(enrollmentData)

    if (!result.success) {
      // Check if it's a capacity issue
      if (result.error === 'Batch is full') {
        return res.status(409).json({
          success: false,
          error: result.error,
          message: 'The batch has reached its maximum capacity. Please try again for the next batch.'
        })
      }

      // Check if it's a duplicate application
      if (result.error === 'You have already applied for this course') {
        return res.status(409).json({
          success: false,
          error: result.error,
          message: 'You have already submitted an application for this course.'
        })
      }

      // Other errors
      return res.status(400).json({
        success: false,
        error: result.error,
        message: 'Failed to process your application. Please try again.'
      })
    }

    // Success response
    return res.status(201).json({
      success: true,
      data: result.enrollment,
      message: 'Application submitted successfully! We will review your application and contact you soon.'
    })

  } catch (error) {
    console.error('Error processing enrollment:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again later.'
    })
  }
})

// GET /enrollments/capacity/:courseId - Get capacity information for a course
enrollmentsRouter.get('/capacity/:courseId', async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params

    // Validate courseId is a UUID
    const uuidSchema = z.string().uuid()
    const validationResult = uuidSchema.safeParse(courseId)

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid course ID format',
        message: 'Course ID must be a valid UUID'
      })
    }

    const capacityInfo = await enrollmentService.getEnrollmentCapacityInfo(courseId)

    if (!capacityInfo) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
        message: 'The requested course does not exist'
      })
    }

    return res.status(200).json({
      success: true,
      data: capacityInfo
    })

  } catch (error) {
    console.error('Error fetching capacity info:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again later.'
    })
  }
})

// GET /enrollments - Get all enrollments (for admin/testing purposes)
enrollmentsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { courseId, status } = req.query

    let enrollments
    if (courseId && typeof courseId === 'string') {
      enrollments = await enrollmentService.getEnrollmentsByStatus(
        courseId, 
        status && typeof status === 'string' ? status : undefined
      )
    } else {
      enrollments = await enrollmentService.getAllEnrollments()
    }

    return res.status(200).json({
      success: true,
      data: enrollments,
      count: enrollments.length
    })

  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again later.'
    })
  }
})