import { Router, Request, Response } from 'express'
import { CoursesService } from './courses.service'
import { 
  CreateCourseRequestSchema,
  UpdateCourseRequestSchema,
  CreateClassRequestSchema,
  UpdateClassRequestSchema,
  CreateCourseEnrollmentRequestSchema,
  UUIDParamSchema 
} from './courses.validators'

export const createCoursesRouter = (coursesService: CoursesService) => {
  const router = Router()

  // Course endpoints
  
  // POST /courses - Create a new course
  router.post('/', async (req: Request, res: Response) => {
    const adminUserId = req.user?.userId
    const adminEmail = req.user?.email

    try {
      console.log('ADMIN_OPERATION', {
        action: 'CREATE_COURSE',
        admin_user_id: adminUserId,
        admin_email: adminEmail,
        timestamp: new Date().toISOString(),
        ip: req.ip,
        user_agent: req.get('User-Agent'),
        data: { title: req.body.title, capacity: req.body.capacity }
      })

      const validationResult = CreateCourseRequestSchema.safeParse(req.body)
      
      if (!validationResult.success) {
        console.log('ADMIN_OPERATION_FAILED', {
          action: 'CREATE_COURSE',
          admin_user_id: adminUserId,
          error: 'VALIDATION_FAILED',
          validation_errors: validationResult.error.errors
        })
        
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validationResult.error.errors.map(e => e.message).join(', ')
        })
      }

      const course = await coursesService.createCourse(validationResult.data)

      console.log('ADMIN_OPERATION_SUCCESS', {
        action: 'CREATE_COURSE',
        admin_user_id: adminUserId,
        course_id: course.id,
        course_title: course.title
      })

      return res.status(201).json({
        success: true,
        data: course,
        message: 'Course created successfully'
      })

    } catch (error) {
      console.error('ADMIN_OPERATION_ERROR', {
        action: 'CREATE_COURSE',
        admin_user_id: adminUserId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create course'
      })
    }
  })

  // GET /courses - Get all courses
  router.get('/', async (req: Request, res: Response) => {
    try {
      const courses = await coursesService.getCourses()

      return res.status(200).json({
        success: true,
        data: courses,
        count: courses.length
      })

    } catch (error) {
      console.error('Error fetching courses:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch courses'
      })
    }
  })

  // GET /courses/:id - Get a specific course with enrollment stats
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const courseIdValidation = UUIDParamSchema.safeParse(req.params.id)
      
      if (!courseIdValidation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid course ID format',
          message: 'Course ID must be a valid UUID'
        })
      }

      const courseWithStats = await coursesService.getCourseWithStats(courseIdValidation.data)

      if (!courseWithStats) {
        return res.status(404).json({
          success: false,
          error: 'Course not found',
          message: 'The requested course does not exist'
        })
      }

      return res.status(200).json({
        success: true,
        data: courseWithStats
      })

    } catch (error) {
      console.error('Error fetching course:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch course'
      })
    }
  })

  // PUT /courses/:id - Update a course
  router.put('/:id', async (req: Request, res: Response) => {
    try {
      const courseIdValidation = UUIDParamSchema.safeParse(req.params.id)
      
      if (!courseIdValidation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid course ID format',
          message: 'Course ID must be a valid UUID'
        })
      }

      const validationResult = UpdateCourseRequestSchema.safeParse(req.body)
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validationResult.error.errors.map(e => e.message).join(', ')
        })
      }

      const course = await coursesService.updateCourse(courseIdValidation.data, validationResult.data)

      if (!course) {
        return res.status(404).json({
          success: false,
          error: 'Course not found',
          message: 'The requested course does not exist'
        })
      }

      return res.status(200).json({
        success: true,
        data: course,
        message: 'Course updated successfully'
      })

    } catch (error) {
      console.error('Error updating course:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to update course'
      })
    }
  })

  // DELETE /courses/:id - Delete a course
  router.delete('/:id', async (req: Request, res: Response) => {
    const adminUserId = req.user?.userId
    const courseId = req.params.id

    try {
      console.log('ADMIN_OPERATION', {
        action: 'DELETE_COURSE',
        admin_user_id: adminUserId,
        course_id: courseId,
        timestamp: new Date().toISOString(),
        ip: req.ip,
        user_agent: req.get('User-Agent')
      })

      const courseIdValidation = UUIDParamSchema.safeParse(req.params.id)
      
      if (!courseIdValidation.success) {
        console.log('ADMIN_OPERATION_FAILED', {
          action: 'DELETE_COURSE',
          admin_user_id: adminUserId,
          course_id: courseId,
          error: 'INVALID_UUID'
        })

        return res.status(400).json({
          success: false,
          error: 'Invalid course ID format',
          message: 'Course ID must be a valid UUID'
        })
      }

      const deleted = await coursesService.deleteCourse(courseIdValidation.data)

      if (!deleted) {
        console.log('ADMIN_OPERATION_FAILED', {
          action: 'DELETE_COURSE',
          admin_user_id: adminUserId,
          course_id: courseId,
          error: 'COURSE_NOT_FOUND'
        })

        return res.status(404).json({
          success: false,
          error: 'Course not found',
          message: 'The requested course does not exist'
        })
      }

      console.log('ADMIN_OPERATION_SUCCESS', {
        action: 'DELETE_COURSE',
        admin_user_id: adminUserId,
        course_id: courseId,
        note: 'Course soft deleted'
      })

      return res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
      })

    } catch (error) {
      console.error('ADMIN_OPERATION_ERROR', {
        action: 'DELETE_COURSE',
        admin_user_id: adminUserId,
        course_id: courseId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to delete course'
      })
    }
  })

  // Class endpoints
  
  // POST /courses/:id/classes - Add a class to a course
  router.post('/:id/classes', async (req: Request, res: Response) => {
    try {
      const courseIdValidation = UUIDParamSchema.safeParse(req.params.id)
      
      if (!courseIdValidation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid course ID format',
          message: 'Course ID must be a valid UUID'
        })
      }

      const validationResult = CreateClassRequestSchema.safeParse(req.body)
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validationResult.error.errors.map(e => e.message).join(', ')
        })
      }

      const newClass = await coursesService.createClass(courseIdValidation.data, validationResult.data)

      return res.status(201).json({
        success: true,
        data: newClass,
        message: 'Class created successfully'
      })

    } catch (error) {
      console.error('Error creating class:', error)
      
      if (error instanceof Error) {
        if (error.message === 'Course not found') {
          return res.status(404).json({
            success: false,
            error: 'Course not found',
            message: 'The specified course does not exist'
          })
        }
        
        if (error.message === 'Order number already exists for this course') {
          return res.status(409).json({
            success: false,
            error: 'Order number conflict',
            message: 'A class with this order number already exists for this course'
          })
        }
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to create class'
      })
    }
  })

  // GET /courses/:id/classes - Get all classes for a course
  router.get('/:id/classes', async (req: Request, res: Response) => {
    try {
      const courseIdValidation = UUIDParamSchema.safeParse(req.params.id)
      
      if (!courseIdValidation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid course ID format',
          message: 'Course ID must be a valid UUID'
        })
      }

      // Verify course exists
      const course = await coursesService.getCourseById(courseIdValidation.data)
      if (!course) {
        return res.status(404).json({
          success: false,
          error: 'Course not found',
          message: 'The requested course does not exist'
        })
      }

      const classes = await coursesService.getClassesByCourse(courseIdValidation.data)

      return res.status(200).json({
        success: true,
        data: classes,
        count: classes.length
      })

    } catch (error) {
      console.error('Error fetching classes:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch classes'
      })
    }
  })

  // Course enrollment endpoints
  
  // POST /courses/:id/enrollments - Enroll a student in a course
  router.post('/:id/enrollments', async (req: Request, res: Response) => {
    try {
      const courseIdValidation = UUIDParamSchema.safeParse(req.params.id)
      
      if (!courseIdValidation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid course ID format',
          message: 'Course ID must be a valid UUID'
        })
      }

      const validationResult = CreateCourseEnrollmentRequestSchema.safeParse(req.body)
      
      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validationResult.error.errors.map(e => e.message).join(', ')
        })
      }

      const enrollment = await coursesService.enrollUserInCourse(
        courseIdValidation.data, 
        validationResult.data.user_id
      )

      return res.status(201).json({
        success: true,
        data: enrollment,
        message: 'Student enrolled successfully'
      })

    } catch (error) {
      console.error('Error enrolling student:', error)
      
      if (error instanceof Error) {
        if (error.message === 'Course not found') {
          return res.status(404).json({
            success: false,
            error: 'Course not found',
            message: 'The specified course does not exist'
          })
        }
        
        if (error.message === 'User not found') {
          return res.status(404).json({
            success: false,
            error: 'User not found',
            message: 'The specified user does not exist'
          })
        }
        
        if (error.message === 'User is already enrolled in this course') {
          return res.status(409).json({
            success: false,
            error: 'Already enrolled',
            message: 'The user is already enrolled in this course'
          })
        }
        
        if (error.message === 'Course has reached maximum capacity') {
          return res.status(409).json({
            success: false,
            error: 'Course full',
            message: 'The course has reached its maximum capacity'
          })
        }
      }

      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to enroll student'
      })
    }
  })

  // GET /courses/:id/enrollments - Get all enrollments for a course
  router.get('/:id/enrollments', async (req: Request, res: Response) => {
    try {
      const courseIdValidation = UUIDParamSchema.safeParse(req.params.id)
      
      if (!courseIdValidation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid course ID format',
          message: 'Course ID must be a valid UUID'
        })
      }

      // Verify course exists
      const course = await coursesService.getCourseById(courseIdValidation.data)
      if (!course) {
        return res.status(404).json({
          success: false,
          error: 'Course not found',
          message: 'The requested course does not exist'
        })
      }

      const enrollments = await coursesService.getCourseEnrollments(courseIdValidation.data)

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
        message: 'Failed to fetch enrollments'
      })
    }
  })

  return router
}

// Admin endpoint for getting all students (separate router for admin routes)
export const createAdminUsersRouter = (coursesService: CoursesService) => {
  const router = Router()

  // GET /admin/users - Get all students for enrollment assignment
  router.get('/users', async (req: Request, res: Response) => {
    try {
      const students = await coursesService.getAllStudents()

      return res.status(200).json({
        success: true,
        data: students,
        count: students.length
      })

    } catch (error) {
      console.error('Error fetching students:', error)
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch students'
      })
    }
  })

  return router
}