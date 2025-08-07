import type { Enrollment } from '../../../../packages/shared/types'

// Mock database - In production, this would use a real database like PostgreSQL
interface EnrollmentRecord extends Omit<Enrollment, 'id' | 'createdAt' | 'updatedAt' | 'status'> {
  id?: string
  createdAt?: string
  updatedAt?: string
}

interface Course {
  id: string
  name: string
  capacity: number
}

// Mock data store
const enrollments: Enrollment[] = []
const courses: Course[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'IELTS Preparation Course',
    capacity: 25
  }
]

// Generate UUID v4 (mock implementation)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export class EnrollmentService {
  async createEnrollment(enrollmentData: EnrollmentRecord): Promise<{ success: boolean; enrollment?: Enrollment; error?: string }> {
    try {
      // Check if course exists
      const course = courses.find(c => c.id === enrollmentData.courseId)
      if (!course) {
        return { success: false, error: 'Course not found' }
      }

      // Check capacity
      const currentEnrollments = enrollments.filter(
        e => e.courseId === enrollmentData.courseId && 
        (e.status === 'pending' || e.status === 'approved')
      ).length

      if (currentEnrollments >= course.capacity) {
        return { success: false, error: 'Batch is full' }
      }

      // Check for duplicate email in the same course
      const existingEnrollment = enrollments.find(
        e => e.email === enrollmentData.email && 
        e.courseId === enrollmentData.courseId &&
        e.status !== 'rejected'
      )

      if (existingEnrollment) {
        return { success: false, error: 'You have already applied for this course' }
      }

      // Create new enrollment
      const now = new Date().toISOString()
      const newEnrollment: Enrollment = {
        id: generateUUID(),
        courseId: enrollmentData.courseId,
        fullName: enrollmentData.fullName,
        email: enrollmentData.email,
        transactionId: enrollmentData.transactionId,
        status: 'pending',
        createdAt: now,
        updatedAt: now
      }

      enrollments.push(newEnrollment)

      return { success: true, enrollment: newEnrollment }
    } catch (error) {
      console.error('Error creating enrollment:', error)
      return { success: false, error: 'Internal server error' }
    }
  }

  async getEnrollmentsByStatus(courseId: string, status?: string): Promise<Enrollment[]> {
    return enrollments.filter(e => {
      if (e.courseId !== courseId) return false
      if (status && e.status !== status) return false
      return true
    })
  }

  async getEnrollmentCapacityInfo(courseId: string): Promise<{ capacity: number; current: number; available: number } | null> {
    const course = courses.find(c => c.id === courseId)
    if (!course) return null

    const currentEnrollments = enrollments.filter(
      e => e.courseId === courseId && 
      (e.status === 'pending' || e.status === 'approved')
    ).length

    return {
      capacity: course.capacity,
      current: currentEnrollments,
      available: Math.max(0, course.capacity - currentEnrollments)
    }
  }

  async getAllEnrollments(): Promise<Enrollment[]> {
    return [...enrollments]
  }

  // Helper method to seed some test data
  seedTestData(): void {
    // Add some test enrollments to simulate partial capacity
    const testEnrollments: Enrollment[] = [
      {
        id: generateUUID(),
        courseId: '00000000-0000-0000-0000-000000000001',
        fullName: 'John Doe',
        email: 'john@example.com',
        transactionId: 'TXN123456789',
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: generateUUID(),
        courseId: '00000000-0000-0000-0000-000000000001',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        transactionId: 'TXN987654321',
        status: 'pending',
        createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        updatedAt: new Date(Date.now() - 43200000).toISOString()
      }
    ]

    enrollments.push(...testEnrollments)
  }

  // Test helper to reset data
  clearTestData(): void {
    enrollments.length = 0
  }
}

// Create a singleton instance
export const enrollmentService = new EnrollmentService()

// Seed some test data for development
if (process.env.NODE_ENV === 'development') {
  enrollmentService.seedTestData()
}