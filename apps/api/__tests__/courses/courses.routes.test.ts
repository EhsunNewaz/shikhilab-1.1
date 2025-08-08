import request from 'supertest'
import { Pool } from 'pg'
import express from 'express'
import { createCoursesRouter, createAdminUsersRouter } from '../../src/courses/courses.routes'
import { CoursesService } from '../../src/courses/courses.service'
import { createAuthMiddleware, requireRole } from '../../src/auth/auth.middleware'

// Mock dependencies
jest.mock('../../src/courses/courses.service')
jest.mock('../../src/auth/auth.middleware')

const MockCoursesService = CoursesService as jest.MockedClass<typeof CoursesService>
const mockCreateAuthMiddleware = createAuthMiddleware as jest.MockedFunction<typeof createAuthMiddleware>
const mockRequireRole = requireRole as jest.MockedFunction<typeof requireRole>

describe('Courses API Routes', () => {
  let app: express.Application
  let mockService: jest.Mocked<CoursesService>
  let mockDb: jest.Mocked<Pool>

  const mockCourse = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'IELTS Preparation Course',
    description: 'Comprehensive IELTS preparation',
    capacity: 25,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  const mockClass = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    course_id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Introduction to IELTS',
    order_number: 1,
    release_date: '2024-02-01',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  const mockEnrollment = {
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    course_id: '550e8400-e29b-41d4-a716-446655440000',
    enrolled_at: '2024-01-01T00:00:00Z'
  }

  const mockUser = {
    id: '550e8400-e29b-41d4-a716-446655440002',
    full_name: 'Test Student',
    email: 'student@example.com',
    role: 'student' as const,
    ai_credits: 500,
    interface_language: 'en',
    ai_feedback_language: 'bn',
    gamification_opt_out: false,
    gamification_is_anonymous: false,
    current_streak: 0,
    points_balance: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock database
    mockDb = {
      query: jest.fn(),
      end: jest.fn(),
    } as any

    // Mock service
    mockService = {
      createCourse: jest.fn(),
      getCourses: jest.fn(),
      getCourseById: jest.fn(),
      updateCourse: jest.fn(),
      deleteCourse: jest.fn(),
      createClass: jest.fn(),
      getClassesByCourse: jest.fn(),
      getClassById: jest.fn(),
      updateClass: jest.fn(),
      deleteClass: jest.fn(),
      enrollUserInCourse: jest.fn(),
      getCourseEnrollments: jest.fn(),
      removeUserFromCourse: jest.fn(),
      getAllStudents: jest.fn(),
      getCourseWithStats: jest.fn(),
    } as any

    MockCoursesService.mockImplementation(() => mockService)

    // Mock auth middleware to pass through
    mockCreateAuthMiddleware.mockReturnValue((req, res, next) => {
      req.user = { userId: '550e8400-e29b-41d4-a716-446655440003', email: 'admin@test.com', role: 'admin' }
      next()
    })

    mockRequireRole.mockReturnValue((req, res, next) => next())

    // Setup express app
    app = express()
    app.use(express.json())
    
    const service = new CoursesService(mockDb)
    const authMiddleware = createAuthMiddleware(mockDb)
    
    app.use('/courses', authMiddleware, requireRole(['admin']), createCoursesRouter(service))
    app.use('/admin', authMiddleware, requireRole(['admin']), createAdminUsersRouter(service))
  })

  describe('Course endpoints', () => {
    describe('POST /courses', () => {
      it('should create a course successfully', async () => {
        mockService.createCourse.mockResolvedValue(mockCourse)

        const response = await request(app)
          .post('/courses')
          .send({
            title: 'IELTS Preparation Course',
            description: 'Comprehensive IELTS preparation',
            capacity: 25
          })
          .expect(201)

        expect(response.body).toEqual({
          success: true,
          data: mockCourse,
          message: 'Course created successfully'
        })

        expect(mockService.createCourse).toHaveBeenCalledWith({
          title: 'IELTS Preparation Course',
          description: 'Comprehensive IELTS preparation',
          capacity: 25
        })
      })

      it('should return 400 for invalid course data', async () => {
        const response = await request(app)
          .post('/courses')
          .send({
            title: '', // Invalid: empty title
            capacity: -1 // Invalid: negative capacity
          })
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Validation failed')
      })

      it('should handle service errors', async () => {
        mockService.createCourse.mockRejectedValue(new Error('Database error'))

        const response = await request(app)
          .post('/courses')
          .send({
            title: 'Test Course',
            capacity: 25
          })
          .expect(500)

        expect(response.body).toEqual({
          success: false,
          error: 'Internal server error',
          message: 'Failed to create course'
        })
      })
    })

    describe('GET /courses', () => {
      it('should return all courses', async () => {
        mockService.getCourses.mockResolvedValue([mockCourse])

        const response = await request(app)
          .get('/courses')
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          data: [mockCourse],
          count: 1
        })

        expect(mockService.getCourses).toHaveBeenCalled()
      })
    })

    describe('GET /courses/:id', () => {
      it('should return a specific course', async () => {
        mockService.getCourseById.mockResolvedValue(mockCourse)

        const response = await request(app)
          .get('/courses/550e8400-e29b-41d4-a716-446655440000')
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          data: mockCourse
        })

        expect(mockService.getCourseById).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000')
      })

      it('should return 404 when course not found', async () => {
        mockService.getCourseById.mockResolvedValue(null)

        const response = await request(app)
          .get('/courses/nonexistent-uuid')
          .expect(404)

        expect(response.body).toEqual({
          success: false,
          error: 'Course not found',
          message: 'The requested course does not exist'
        })
      })

      it('should return 400 for invalid UUID', async () => {
        const response = await request(app)
          .get('/courses/invalid-uuid')
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Invalid course ID format')
      })
    })

    describe('PUT /courses/:id', () => {
      it('should update a course successfully', async () => {
        const updatedCourse = { ...mockCourse, title: 'Updated Course' }
        mockService.updateCourse.mockResolvedValue(updatedCourse)

        const response = await request(app)
          .put('/courses/course-uuid')
          .send({ title: 'Updated Course' })
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          data: updatedCourse,
          message: 'Course updated successfully'
        })

        expect(mockService.updateCourse).toHaveBeenCalledWith('course-uuid', {
          title: 'Updated Course'
        })
      })

      it('should return 404 when course not found', async () => {
        mockService.updateCourse.mockResolvedValue(null)

        const response = await request(app)
          .put('/courses/nonexistent-uuid')
          .send({ title: 'Updated Course' })
          .expect(404)

        expect(response.body).toEqual({
          success: false,
          error: 'Course not found',
          message: 'The requested course does not exist'
        })
      })
    })

    describe('DELETE /courses/:id', () => {
      it('should delete a course successfully', async () => {
        mockService.deleteCourse.mockResolvedValue(true)

        const response = await request(app)
          .delete('/courses/course-uuid')
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Course deleted successfully'
        })

        expect(mockService.deleteCourse).toHaveBeenCalledWith('course-uuid')
      })

      it('should return 404 when course not found', async () => {
        mockService.deleteCourse.mockResolvedValue(false)

        const response = await request(app)
          .delete('/courses/nonexistent-uuid')
          .expect(404)

        expect(response.body).toEqual({
          success: false,
          error: 'Course not found',
          message: 'The requested course does not exist'
        })
      })
    })
  })

  describe('Class endpoints', () => {
    describe('POST /courses/:id/classes', () => {
      it('should create a class successfully', async () => {
        mockService.createClass.mockResolvedValue(mockClass)

        const response = await request(app)
          .post('/courses/course-uuid/classes')
          .send({
            title: 'Introduction to IELTS',
            order_number: 1,
            release_date: '2024-02-01T00:00:00.000Z'
          })
          .expect(201)

        expect(response.body).toEqual({
          success: true,
          data: mockClass,
          message: 'Class created successfully'
        })
      })

      it('should return 404 when course not found', async () => {
        mockService.createClass.mockRejectedValue(new Error('Course not found'))

        const response = await request(app)
          .post('/courses/nonexistent-uuid/classes')
          .send({
            title: 'Test Class',
            order_number: 1
          })
          .expect(404)

        expect(response.body).toEqual({
          success: false,
          error: 'Course not found',
          message: 'The specified course does not exist'
        })
      })

      it('should return 409 for order number conflict', async () => {
        mockService.createClass.mockRejectedValue(new Error('Order number already exists for this course'))

        const response = await request(app)
          .post('/courses/course-uuid/classes')
          .send({
            title: 'Test Class',
            order_number: 1
          })
          .expect(409)

        expect(response.body).toEqual({
          success: false,
          error: 'Order number conflict',
          message: 'A class with this order number already exists for this course'
        })
      })
    })

    describe('GET /courses/:id/classes', () => {
      it('should return classes for a course', async () => {
        mockService.getCourseById.mockResolvedValue(mockCourse)
        mockService.getClassesByCourse.mockResolvedValue([mockClass])

        const response = await request(app)
          .get('/courses/course-uuid/classes')
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          data: [mockClass],
          count: 1
        })

        expect(mockService.getClassesByCourse).toHaveBeenCalledWith('course-uuid')
      })

      it('should return 404 when course not found', async () => {
        mockService.getCourseById.mockResolvedValue(null)

        const response = await request(app)
          .get('/courses/nonexistent-uuid/classes')
          .expect(404)

        expect(response.body).toEqual({
          success: false,
          error: 'Course not found',
          message: 'The requested course does not exist'
        })
      })
    })
  })

  describe('Enrollment endpoints', () => {
    describe('POST /courses/:id/enrollments', () => {
      it('should enroll a student successfully', async () => {
        mockService.enrollUserInCourse.mockResolvedValue(mockEnrollment)

        const response = await request(app)
          .post('/courses/course-uuid/enrollments')
          .send({ user_id: 'user-uuid' })
          .expect(201)

        expect(response.body).toEqual({
          success: true,
          data: mockEnrollment,
          message: 'Student enrolled successfully'
        })

        expect(mockService.enrollUserInCourse).toHaveBeenCalledWith('course-uuid', 'user-uuid')
      })

      it('should return 409 when student already enrolled', async () => {
        mockService.enrollUserInCourse.mockRejectedValue(new Error('User is already enrolled in this course'))

        const response = await request(app)
          .post('/courses/course-uuid/enrollments')
          .send({ user_id: 'user-uuid' })
          .expect(409)

        expect(response.body).toEqual({
          success: false,
          error: 'Already enrolled',
          message: 'The user is already enrolled in this course'
        })
      })

      it('should return 409 when course is full', async () => {
        mockService.enrollUserInCourse.mockRejectedValue(new Error('Course has reached maximum capacity'))

        const response = await request(app)
          .post('/courses/course-uuid/enrollments')
          .send({ user_id: 'user-uuid' })
          .expect(409)

        expect(response.body).toEqual({
          success: false,
          error: 'Course full',
          message: 'The course has reached its maximum capacity'
        })
      })

      it('should return 400 for invalid user ID', async () => {
        const response = await request(app)
          .post('/courses/course-uuid/enrollments')
          .send({ user_id: 'invalid-uuid' })
          .expect(400)

        expect(response.body.success).toBe(false)
        expect(response.body.error).toBe('Validation failed')
      })
    })

    describe('GET /courses/:id/enrollments', () => {
      it('should return enrollments for a course', async () => {
        mockService.getCourseById.mockResolvedValue(mockCourse)
        mockService.getCourseEnrollments.mockResolvedValue([mockEnrollment])

        const response = await request(app)
          .get('/courses/course-uuid/enrollments')
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          data: [mockEnrollment],
          count: 1
        })
      })
    })
  })

  describe('Admin endpoints', () => {
    describe('GET /admin/users', () => {
      it('should return all students', async () => {
        mockService.getAllStudents.mockResolvedValue([mockUser])

        const response = await request(app)
          .get('/admin/users')
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          data: [mockUser],
          count: 1
        })

        expect(mockService.getAllStudents).toHaveBeenCalled()
      })

      it('should handle service errors', async () => {
        mockService.getAllStudents.mockRejectedValue(new Error('Database error'))

        const response = await request(app)
          .get('/admin/users')
          .expect(500)

        expect(response.body).toEqual({
          success: false,
          error: 'Internal server error',
          message: 'Failed to fetch students'
        })
      })
    })
  })
})