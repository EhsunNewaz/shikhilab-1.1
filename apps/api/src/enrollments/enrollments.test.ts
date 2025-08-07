import request from 'supertest'
import app from '../index'
import { enrollmentService } from './enrollments.service'

describe('Enrollments API', () => {
  beforeEach(() => {
    // Reset the in-memory store before each test
    enrollmentService.clearTestData()
  })

  describe('POST /enrollments', () => {
    const validEnrollmentData = {
      fullName: 'Test User',
      email: 'test@example.com',
      transactionId: 'TXN123456789',
      courseId: '00000000-0000-0000-0000-000000000001'
    }

    it('should create a new enrollment with valid data', async () => {
      const response = await request(app)
        .post('/enrollments')
        .send(validEnrollmentData)
        .expect(201)

      expect(response.body).toMatchObject({
        success: true,
        message: expect.stringContaining('Application submitted successfully')
      })

      expect(response.body.data).toMatchObject({
        id: expect.any(String),
        courseId: validEnrollmentData.courseId,
        fullName: validEnrollmentData.fullName,
        email: validEnrollmentData.email,
        transactionId: validEnrollmentData.transactionId,
        status: 'pending',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      })
    })

    it('should reject enrollment with missing required fields', async () => {
      const incompleteData = {
        fullName: 'Test User',
        // Missing email, transactionId, courseId
      }

      const response = await request(app)
        .post('/enrollments')
        .send(incompleteData)
        .expect(400)

      expect(response.body).toMatchObject({
        success: false,
        error: 'Validation failed'
      })
    })

    it('should reject enrollment with invalid email', async () => {
      const invalidEmailData = {
        ...validEnrollmentData,
        email: 'invalid-email'
      }

      const response = await request(app)
        .post('/enrollments')
        .send(invalidEmailData)
        .expect(400)

      expect(response.body).toMatchObject({
        success: false,
        error: 'Validation failed'
      })
    })

    it('should reject enrollment with short name', async () => {
      const shortNameData = {
        ...validEnrollmentData,
        fullName: 'A'
      }

      const response = await request(app)
        .post('/enrollments')
        .send(shortNameData)
        .expect(400)

      expect(response.body).toMatchObject({
        success: false,
        error: 'Validation failed',
        message: expect.stringContaining('Full name must be at least 2 characters')
      })
    })

    it('should reject enrollment for non-existent course', async () => {
      const invalidCourseData = {
        ...validEnrollmentData,
        courseId: '00000000-0000-0000-0000-999999999999'
      }

      const response = await request(app)
        .post('/enrollments')
        .send(invalidCourseData)
        .expect(400)

      expect(response.body).toMatchObject({
        success: false,
        error: 'Course not found'
      })
    })

    it('should reject duplicate enrollment for same email and course', async () => {
      // First enrollment should succeed
      await request(app)
        .post('/enrollments')
        .send(validEnrollmentData)
        .expect(201)

      // Second enrollment with same email should fail
      const response = await request(app)
        .post('/enrollments')
        .send(validEnrollmentData)
        .expect(409)

      expect(response.body).toMatchObject({
        success: false,
        error: 'You have already applied for this course'
      })
    })

    it('should reject enrollment when batch is full', async () => {
      // Fill up the batch (capacity is 25, so we need 25 enrollments)
      const promises = []
      for (let i = 0; i < 25; i++) {
        const enrollmentData = {
          ...validEnrollmentData,
          email: `test${i}@example.com`,
          transactionId: `TXN12345678${i}`
        }
        promises.push(
          request(app)
            .post('/enrollments')
            .send(enrollmentData)
            .expect(201)
        )
      }
      await Promise.all(promises)

      // This enrollment should be rejected due to capacity
      const response = await request(app)
        .post('/enrollments')
        .send({
          ...validEnrollmentData,
          email: 'final@example.com',
          transactionId: 'TXNFINAL'
        })
        .expect(409)

      expect(response.body).toMatchObject({
        success: false,
        error: 'Batch is full',
        message: expect.stringContaining('maximum capacity')
      })
    })
  })

  describe('GET /enrollments/capacity/:courseId', () => {
    it('should return capacity information for valid course', async () => {
      // Add some test data first
      enrollmentService.seedTestData()

      const response = await request(app)
        .get('/enrollments/capacity/00000000-0000-0000-0000-000000000001')
        .expect(200)

      expect(response.body).toMatchObject({
        success: true,
        data: {
          capacity: 25,
          current: expect.any(Number),
          available: expect.any(Number)
        }
      })

      // With seeded data, we should have 2 enrollments
      expect(response.body.data.current).toBe(2)
      expect(response.body.data.available).toBe(23)
    })

    it('should return 404 for non-existent course', async () => {
      const response = await request(app)
        .get('/enrollments/capacity/00000000-0000-0000-0000-999999999999')
        .expect(404)

      expect(response.body).toMatchObject({
        success: false,
        error: 'Course not found'
      })
    })

    it('should reject invalid UUID format', async () => {
      const response = await request(app)
        .get('/enrollments/capacity/invalid-uuid')
        .expect(400)

      expect(response.body).toMatchObject({
        success: false,
        error: 'Invalid course ID format'
      })
    })
  })

  describe('GET /enrollments', () => {
    beforeEach(async () => {
      // Add some test enrollments
      const testData = [
        {
          fullName: 'Alice Johnson',
          email: 'alice@example.com',
          transactionId: 'TXNALICE123',
          courseId: '00000000-0000-0000-0000-000000000001'
        },
        {
          fullName: 'Bob Smith',
          email: 'bob@example.com',
          transactionId: 'TXNBOB456',
          courseId: '00000000-0000-0000-0000-000000000001'
        }
      ]

      for (const data of testData) {
        await request(app)
          .post('/enrollments')
          .send(data)
      }
    })

    it('should return all enrollments', async () => {
      const response = await request(app)
        .get('/enrollments')
        .expect(200)

      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array),
        count: expect.any(Number)
      })

      // Should have our test data (2) = 2 total (no seeded data in this context)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.count).toBe(2)
    })

    it('should filter enrollments by courseId', async () => {
      const response = await request(app)
        .get('/enrollments?courseId=00000000-0000-0000-0000-000000000001')
        .expect(200)

      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array),
        count: 2
      })

      // All enrollments should have the specified courseId
      response.body.data.forEach((enrollment: any) => {
        expect(enrollment.courseId).toBe('00000000-0000-0000-0000-000000000001')
      })
    })

    it('should filter enrollments by status', async () => {
      const response = await request(app)
        .get('/enrollments?status=pending&courseId=00000000-0000-0000-0000-000000000001')
        .expect(200)

      expect(response.body).toMatchObject({
        success: true,
        data: expect.any(Array)
      })

      // All enrollments should have pending status
      response.body.data.forEach((enrollment: any) => {
        expect(enrollment.status).toBe('pending')
      })
    })
  })

  describe('Error handling', () => {
    it('should handle very large payloads gracefully', async () => {
      const largePayload = {
        fullName: 'A'.repeat(10000),
        email: 'test@example.com',
        transactionId: 'TXN123',
        courseId: '00000000-0000-0000-0000-000000000001'
      }

      const response = await request(app)
        .post('/enrollments')
        .send(largePayload)
        .expect(400)

      expect(response.body).toMatchObject({
        success: false,
        error: 'Validation failed'
      })
    })
  })
})