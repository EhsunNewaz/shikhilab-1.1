import { Pool } from 'pg'
import { CoursesService } from '../../src/courses/courses.service'
import { Course, Class, CourseEnrollment, User } from 'shared'

describe('CoursesService', () => {
  let coursesService: CoursesService
  let mockDb: jest.Mocked<Pool>
  let mockCourse: Course
  let mockClass: Class
  let mockUser: Omit<User, 'password_hash'>
  let mockEnrollment: CourseEnrollment

  beforeEach(() => {
    // Mock database
    mockDb = {
      query: jest.fn(),
      end: jest.fn(),
    } as any

    coursesService = new CoursesService(mockDb)

    // Mock data
    mockCourse = {
      id: 'course-uuid',
      title: 'IELTS Preparation Course',
      description: 'Comprehensive IELTS preparation',
      capacity: 25,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }

    mockClass = {
      id: 'class-uuid',
      course_id: 'course-uuid',
      title: 'Introduction to IELTS',
      order_number: 1,
      release_date: '2024-02-01',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }

    mockUser = {
      id: 'user-uuid',
      full_name: 'Test Student',
      email: 'student@example.com',
      role: 'student',
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

    mockEnrollment = {
      user_id: 'user-uuid',
      course_id: 'course-uuid',
      enrolled_at: '2024-01-01T00:00:00Z'
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Course operations', () => {
    describe('createCourse', () => {
      it('should create a course successfully', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [mockCourse],
          rowCount: 1
        } as any)

        const result = await coursesService.createCourse({
          title: 'IELTS Preparation Course',
          description: 'Comprehensive IELTS preparation',
          capacity: 25
        })

        expect(mockDb.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO courses'),
          ['IELTS Preparation Course', 'Comprehensive IELTS preparation', 25]
        )
        expect(result).toEqual(mockCourse)
      })

      it('should create a course with default capacity when not specified', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [{ ...mockCourse, capacity: 50 }],
          rowCount: 1
        } as any)

        await coursesService.createCourse({
          title: 'IELTS Preparation Course'
        })

        expect(mockDb.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO courses'),
          ['IELTS Preparation Course', null, 50]
        )
      })
    })

    describe('getCourses', () => {
      it('should return all courses ordered by created_at DESC', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [mockCourse],
          rowCount: 1
        } as any)

        const result = await coursesService.getCourses()

        expect(mockDb.query).toHaveBeenCalledWith(
          'SELECT * FROM courses WHERE deleted_at IS NULL ORDER BY created_at DESC'
        )
        expect(result).toEqual([mockCourse])
      })
    })

    describe('getCourseById', () => {
      it('should return a course when found', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [mockCourse],
          rowCount: 1
        } as any)

        const result = await coursesService.getCourseById('course-uuid')

        expect(mockDb.query).toHaveBeenCalledWith(
          'SELECT * FROM courses WHERE id = $1 AND deleted_at IS NULL',
          ['course-uuid']
        )
        expect(result).toEqual(mockCourse)
      })

      it('should return null when course not found', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 0
        } as any)

        const result = await coursesService.getCourseById('nonexistent-uuid')

        expect(result).toBeNull()
      })
    })

    describe('updateCourse', () => {
      it('should update course successfully', async () => {
        const updatedCourse = { ...mockCourse, title: 'Updated Course' }
        mockDb.query.mockResolvedValueOnce({
          rows: [updatedCourse],
          rowCount: 1
        } as any)

        const result = await coursesService.updateCourse('course-uuid', {
          title: 'Updated Course'
        })

        expect(mockDb.query).toHaveBeenCalledWith(
          expect.stringContaining('UPDATE courses'),
          ['Updated Course', 'course-uuid']
        )
        expect(result).toEqual(updatedCourse)
      })

      it('should return null when course not found', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 0
        } as any)

        const result = await coursesService.updateCourse('nonexistent-uuid', {
          title: 'Updated Course'
        })

        expect(result).toBeNull()
      })
    })

    describe('deleteCourse', () => {
      it('should delete course successfully', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 1
        } as any)

        const result = await coursesService.deleteCourse('course-uuid')

        expect(mockDb.query).toHaveBeenCalledWith(
          `
      UPDATE courses 
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `,
          ['course-uuid']
        )
        expect(result).toBe(true)
      })

      it('should return false when course not found', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 0
        } as any)

        const result = await coursesService.deleteCourse('nonexistent-uuid')

        expect(result).toBe(false)
      })
    })
  })

  describe('Class operations', () => {
    describe('createClass', () => {
      it('should create a class successfully', async () => {
        // Mock course exists
        mockDb.query.mockResolvedValueOnce({
          rows: [mockCourse],
          rowCount: 1
        } as any)

        // Mock order number check
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 0
        } as any)

        // Mock class creation
        mockDb.query.mockResolvedValueOnce({
          rows: [mockClass],
          rowCount: 1
        } as any)

        const result = await coursesService.createClass('course-uuid', {
          title: 'Introduction to IELTS',
          order_number: 1,
          release_date: '2024-02-01'
        })

        expect(result).toEqual(mockClass)
      })

      it('should throw error when course not found', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 0
        } as any)

        await expect(
          coursesService.createClass('nonexistent-uuid', {
            title: 'Test Class',
            order_number: 1
          })
        ).rejects.toThrow('Course not found')
      })

      it('should throw error when order number already exists', async () => {
        // Mock course exists
        mockDb.query.mockResolvedValueOnce({
          rows: [mockCourse],
          rowCount: 1
        } as any)

        // Mock order number already exists
        mockDb.query.mockResolvedValueOnce({
          rows: [{ id: 'existing-class-uuid' }],
          rowCount: 1
        } as any)

        await expect(
          coursesService.createClass('course-uuid', {
            title: 'Test Class',
            order_number: 1
          })
        ).rejects.toThrow('Order number already exists for this course')
      })
    })

    describe('getClassesByCourse', () => {
      it('should return classes ordered by order_number ASC', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [mockClass],
          rowCount: 1
        } as any)

        const result = await coursesService.getClassesByCourse('course-uuid')

        expect(mockDb.query).toHaveBeenCalledWith(
          expect.stringContaining('WHERE course_id = $1 AND deleted_at IS NULL'),
          ['course-uuid']
        )
        expect(result).toEqual([mockClass])
      })
    })
  })

  describe('Enrollment operations', () => {
    describe('enrollUserInCourse', () => {
      it('should enroll user successfully', async () => {
        // Mock course exists
        mockDb.query.mockResolvedValueOnce({
          rows: [mockCourse],
          rowCount: 1
        } as any)

        // Mock user exists
        mockDb.query.mockResolvedValueOnce({
          rows: [{ id: 'user-uuid' }],
          rowCount: 1
        } as any)

        // Mock user not already enrolled
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 0
        } as any)

        // Mock capacity check
        mockDb.query.mockResolvedValueOnce({
          rows: [{ enrolled_count: '10' }],
          rowCount: 1
        } as any)

        // Mock enrollment creation
        mockDb.query.mockResolvedValueOnce({
          rows: [mockEnrollment],
          rowCount: 1
        } as any)

        const result = await coursesService.enrollUserInCourse('course-uuid', 'user-uuid')

        expect(result).toEqual(mockEnrollment)
      })

      it('should throw error when course not found', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 0
        } as any)

        await expect(
          coursesService.enrollUserInCourse('nonexistent-course', 'user-uuid')
        ).rejects.toThrow('Course not found')
      })

      it('should throw error when user not found', async () => {
        // Mock course exists
        mockDb.query.mockResolvedValueOnce({
          rows: [mockCourse],
          rowCount: 1
        } as any)

        // Mock user not found
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 0
        } as any)

        await expect(
          coursesService.enrollUserInCourse('course-uuid', 'nonexistent-user')
        ).rejects.toThrow('User not found')
      })

      it('should throw error when user already enrolled', async () => {
        // Mock course exists
        mockDb.query.mockResolvedValueOnce({
          rows: [mockCourse],
          rowCount: 1
        } as any)

        // Mock user exists
        mockDb.query.mockResolvedValueOnce({
          rows: [{ id: 'user-uuid' }],
          rowCount: 1
        } as any)

        // Mock user already enrolled
        mockDb.query.mockResolvedValueOnce({
          rows: [mockEnrollment],
          rowCount: 1
        } as any)

        await expect(
          coursesService.enrollUserInCourse('course-uuid', 'user-uuid')
        ).rejects.toThrow('User is already enrolled in this course')
      })

      it('should throw error when course is at capacity', async () => {
        // Mock course exists
        mockDb.query.mockResolvedValueOnce({
          rows: [mockCourse],
          rowCount: 1
        } as any)

        // Mock user exists
        mockDb.query.mockResolvedValueOnce({
          rows: [{ id: 'user-uuid' }],
          rowCount: 1
        } as any)

        // Mock user not already enrolled
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 0
        } as any)

        // Mock capacity reached
        mockDb.query.mockResolvedValueOnce({
          rows: [{ enrolled_count: '25' }],
          rowCount: 1
        } as any)

        await expect(
          coursesService.enrollUserInCourse('course-uuid', 'user-uuid')
        ).rejects.toThrow('Course has reached maximum capacity')
      })
    })

    describe('getCourseEnrollments', () => {
      it('should return enrollments ordered by enrolled_at DESC', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [mockEnrollment],
          rowCount: 1
        } as any)

        const result = await coursesService.getCourseEnrollments('course-uuid')

        expect(mockDb.query).toHaveBeenCalledWith(
          expect.stringContaining('ORDER BY enrolled_at DESC'),
          ['course-uuid']
        )
        expect(result).toEqual([mockEnrollment])
      })
    })

    describe('removeUserFromCourse', () => {
      it('should remove enrollment successfully', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 1
        } as any)

        const result = await coursesService.removeUserFromCourse('course-uuid', 'user-uuid')

        expect(mockDb.query).toHaveBeenCalledWith(
          'DELETE FROM course_enrollments WHERE user_id = $1 AND course_id = $2',
          ['user-uuid', 'course-uuid']
        )
        expect(result).toBe(true)
      })

      it('should return false when enrollment not found', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 0
        } as any)

        const result = await coursesService.removeUserFromCourse('course-uuid', 'user-uuid')

        expect(result).toBe(false)
      })
    })
  })

  describe('Admin operations', () => {
    describe('getAllStudents', () => {
      it('should return students ordered by full_name ASC', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [mockUser],
          rowCount: 1
        } as any)

        const result = await coursesService.getAllStudents()

        expect(mockDb.query).toHaveBeenCalledWith(
          expect.stringContaining("WHERE role = 'student'")
        )
        expect(result).toEqual([mockUser])
      })

      it('should not include password_hash in results', async () => {
        // Mock returns user without password_hash (as it would in real query)
        mockDb.query.mockResolvedValueOnce({
          rows: [mockUser], // mockUser doesn't contain password_hash
          rowCount: 1
        } as any)

        const result = await coursesService.getAllStudents()

        expect(mockDb.query).toHaveBeenCalledWith(
          expect.not.stringContaining('password_hash')
        )
        expect(result[0]).not.toHaveProperty('password_hash')
      })
    })

    describe('getCourseWithStats', () => {
      it('should return course with enrollment count', async () => {
        const courseWithStats = { ...mockCourse, enrolled_count: 5 }
        mockDb.query.mockResolvedValueOnce({
          rows: [courseWithStats],
          rowCount: 1
        } as any)

        const result = await coursesService.getCourseWithStats('course-uuid')

        expect(mockDb.query).toHaveBeenCalledWith(
          expect.stringContaining('WHERE c.id = $1 AND c.deleted_at IS NULL'),
          ['course-uuid']
        )
        expect(result).toEqual(courseWithStats)
      })

      it('should return null when course not found', async () => {
        mockDb.query.mockResolvedValueOnce({
          rows: [],
          rowCount: 0
        } as any)

        const result = await coursesService.getCourseWithStats('nonexistent-uuid')

        expect(result).toBeNull()
      })
    })
  })
})