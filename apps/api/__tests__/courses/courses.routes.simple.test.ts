import request from 'supertest'
import { Pool } from 'pg'
import express from 'express'
import { createCoursesRouter } from '../../src/courses/courses.routes'
import { CoursesService } from '../../src/courses/courses.service'

// Mock service
jest.mock('../../src/courses/courses.service')
const MockCoursesService = CoursesService as jest.MockedClass<typeof CoursesService>

describe('Courses API Routes - Simple Tests', () => {
  let app: express.Application
  let mockService: jest.Mocked<CoursesService>
  
  const validUUID = '550e8400-e29b-41d4-a716-446655440000'
  const validUserUUID = '550e8400-e29b-41d4-a716-446655440001'

  beforeEach(() => {
    // Mock service
    mockService = {
      createCourse: jest.fn(),
      getCourses: jest.fn(),
      getCourseById: jest.fn(),
      updateCourse: jest.fn(),
      deleteCourse: jest.fn(),
      createClass: jest.fn(),
      getClassesByCourse: jest.fn(),
      enrollUserInCourse: jest.fn(),
      getCourseEnrollments: jest.fn(),
      getAllStudents: jest.fn(),
    } as any

    MockCoursesService.mockImplementation(() => mockService)

    // Setup express app
    app = express()
    app.use(express.json())
    
    // Mock auth middleware
    app.use((req, res, next) => {
      req.user = { userId: validUserUUID, email: 'admin@test.com', role: 'admin' }
      next()
    })
    
    const service = new CoursesService({} as Pool)
    app.use('/courses', createCoursesRouter(service))
  })

  it('should create a course successfully', async () => {
    const mockCourse = {
      id: validUUID,
      title: 'Test Course',
      description: 'Test description',
      capacity: 25,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }

    mockService.createCourse.mockResolvedValue(mockCourse)

    const response = await request(app)
      .post('/courses')
      .send({
        title: 'Test Course',
        description: 'Test description',
        capacity: 25
      })
      .expect(201)

    expect(response.body.success).toBe(true)
    expect(response.body.data).toEqual(mockCourse)
    expect(mockService.createCourse).toHaveBeenCalledWith({
      title: 'Test Course',
      description: 'Test description',
      capacity: 25
    })
  })

  it('should get all courses', async () => {
    const mockCourses = [{
      id: validUUID,
      title: 'Test Course',
      description: 'Test description',
      capacity: 25,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }]

    mockService.getCourses.mockResolvedValue(mockCourses)

    const response = await request(app)
      .get('/courses')
      .expect(200)

    expect(response.body.success).toBe(true)
    expect(response.body.data).toEqual(mockCourses)
    expect(response.body.count).toBe(1)
  })

  it('should validate course creation input', async () => {
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
})