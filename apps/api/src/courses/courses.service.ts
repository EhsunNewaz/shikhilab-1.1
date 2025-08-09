import { Pool } from 'pg'
import { Course, Class, CourseEnrollment, User } from 'shared'

export interface CreateCourseData {
  title: string
  description?: string
  capacity?: number
}

export interface UpdateCourseData {
  title?: string
  description?: string
  capacity?: number
}

export interface CreateClassData {
  title: string
  order_number: number
  release_date?: string
}

export interface UpdateClassData {
  title?: string
  order_number?: number
  release_date?: string
}

export class CoursesService {
  private db: Pool

  constructor(db: Pool) {
    this.db = db
  }

  // Course CRUD operations
  async createCourse(data: CreateCourseData): Promise<Course> {
    const query = `
      INSERT INTO courses (title, description, capacity)
      VALUES ($1, $2, $3)
      RETURNING *
    `
    const values = [data.title, data.description || null, data.capacity || 50]
    
    const result = await this.db.query(query, values)
    return result.rows[0] as Course
  }

  async getCourses(): Promise<Course[]> {
    const query = 'SELECT * FROM courses WHERE deleted_at IS NULL ORDER BY created_at DESC'
    const result = await this.db.query(query)
    return result.rows as Course[]
  }

  async getCourseById(courseId: string): Promise<Course | null> {
    const query = 'SELECT * FROM courses WHERE id = $1 AND deleted_at IS NULL'
    const result = await this.db.query(query, [courseId])
    return result.rows.length > 0 ? result.rows[0] as Course : null
  }

  async updateCourse(courseId: string, data: UpdateCourseData): Promise<Course | null> {
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (data.title !== undefined) {
      updates.push(`title = $${paramCount}`)
      values.push(data.title)
      paramCount++
    }

    if (data.description !== undefined) {
      updates.push(`description = $${paramCount}`)
      values.push(data.description)
      paramCount++
    }

    if (data.capacity !== undefined) {
      updates.push(`capacity = $${paramCount}`)
      values.push(data.capacity)
      paramCount++
    }

    if (updates.length === 0) {
      return this.getCourseById(courseId)
    }

    updates.push(`updated_at = NOW()`)
    values.push(courseId)

    const query = `
      UPDATE courses 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await this.db.query(query, values)
    return result.rows.length > 0 ? result.rows[0] as Course : null
  }

  async deleteCourse(courseId: string): Promise<boolean> {
    // Soft delete - set deleted_at timestamp instead of actually deleting
    const query = `
      UPDATE courses 
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `
    const result = await this.db.query(query, [courseId])
    return result.rowCount !== null && result.rowCount > 0
  }

  // Class CRUD operations
  async createClass(courseId: string, data: CreateClassData): Promise<Class> {
    // Check if course exists
    const course = await this.getCourseById(courseId)
    if (!course) {
      throw new Error('Course not found')
    }

    // Check if order_number is already taken for this course
    const orderQuery = 'SELECT id FROM classes WHERE course_id = $1 AND order_number = $2'
    const orderResult = await this.db.query(orderQuery, [courseId, data.order_number])
    
    if (orderResult.rows.length > 0) {
      throw new Error('Order number already exists for this course')
    }

    const query = `
      INSERT INTO classes (course_id, title, order_number, release_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const values = [courseId, data.title, data.order_number, data.release_date || null]
    
    const result = await this.db.query(query, values)
    return result.rows[0] as Class
  }

  async getClassesByCourse(courseId: string): Promise<Class[]> {
    const query = `
      SELECT * FROM classes 
      WHERE course_id = $1 AND deleted_at IS NULL
      ORDER BY order_number ASC
    `
    const result = await this.db.query(query, [courseId])
    return result.rows as Class[]
  }

  async getClassById(classId: string): Promise<Class | null> {
    const query = 'SELECT * FROM classes WHERE id = $1 AND deleted_at IS NULL'
    const result = await this.db.query(query, [classId])
    return result.rows.length > 0 ? result.rows[0] as Class : null
  }

  async updateClass(classId: string, data: UpdateClassData): Promise<Class | null> {
    const currentClass = await this.getClassById(classId)
    if (!currentClass) {
      return null
    }

    // If updating order_number, check for conflicts
    if (data.order_number !== undefined && data.order_number !== currentClass.order_number) {
      const orderQuery = 'SELECT id FROM classes WHERE course_id = $1 AND order_number = $2 AND id != $3'
      const orderResult = await this.db.query(orderQuery, [currentClass.course_id, data.order_number, classId])
      
      if (orderResult.rows.length > 0) {
        throw new Error('Order number already exists for this course')
      }
    }

    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (data.title !== undefined) {
      updates.push(`title = $${paramCount}`)
      values.push(data.title)
      paramCount++
    }

    if (data.order_number !== undefined) {
      updates.push(`order_number = $${paramCount}`)
      values.push(data.order_number)
      paramCount++
    }

    if (data.release_date !== undefined) {
      updates.push(`release_date = $${paramCount}`)
      values.push(data.release_date)
      paramCount++
    }

    if (updates.length === 0) {
      return currentClass
    }

    updates.push(`updated_at = NOW()`)
    values.push(classId)

    const query = `
      UPDATE classes 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `

    const result = await this.db.query(query, values)
    return result.rows.length > 0 ? result.rows[0] as Class : null
  }

  async deleteClass(classId: string): Promise<boolean> {
    // Soft delete - set deleted_at timestamp instead of actually deleting
    const query = `
      UPDATE classes 
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
    `
    const result = await this.db.query(query, [classId])
    return result.rowCount !== null && result.rowCount > 0
  }

  // Course enrollment operations
  async enrollUserInCourse(courseId: string, userId: string): Promise<CourseEnrollment> {
    // Check if course exists
    const course = await this.getCourseById(courseId)
    if (!course) {
      throw new Error('Course not found')
    }

    // Check if user exists
    const userQuery = 'SELECT id FROM users WHERE id = $1'
    const userResult = await this.db.query(userQuery, [userId])
    if (userResult.rows.length === 0) {
      throw new Error('User not found')
    }

    // Check if user is already enrolled
    const enrollmentQuery = 'SELECT * FROM course_enrollments WHERE user_id = $1 AND course_id = $2'
    const enrollmentResult = await this.db.query(enrollmentQuery, [userId, courseId])
    
    if (enrollmentResult.rows.length > 0) {
      throw new Error('User is already enrolled in this course')
    }

    // Check course capacity
    const capacityQuery = `
      SELECT COUNT(*) as enrolled_count 
      FROM course_enrollments 
      WHERE course_id = $1
    `
    const capacityResult = await this.db.query(capacityQuery, [courseId])
    const enrolledCount = parseInt(capacityResult.rows[0].enrolled_count)

    if (enrolledCount >= course.capacity) {
      throw new Error('Course has reached maximum capacity')
    }

    // Create enrollment
    const insertQuery = `
      INSERT INTO course_enrollments (user_id, course_id)
      VALUES ($1, $2)
      RETURNING *
    `
    
    const result = await this.db.query(insertQuery, [userId, courseId])
    return result.rows[0] as CourseEnrollment
  }

  async getCourseEnrollments(courseId: string): Promise<CourseEnrollment[]> {
    const query = `
      SELECT * FROM course_enrollments 
      WHERE course_id = $1 
      ORDER BY enrolled_at DESC
    `
    const result = await this.db.query(query, [courseId])
    return result.rows as CourseEnrollment[]
  }

  async removeUserFromCourse(courseId: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM course_enrollments WHERE user_id = $1 AND course_id = $2'
    const result = await this.db.query(query, [userId, courseId])
    return result.rowCount !== null && result.rowCount > 0
  }

  // Admin helper - get all students for enrollment assignment
  async getAllStudents(): Promise<Omit<User, 'password_hash'>[]> {
    const query = `
      SELECT id, full_name, email, role, ai_credits, target_band_score, 
             target_test_date, interface_language, ai_feedback_language,
             gamification_opt_out, gamification_is_anonymous, current_streak,
             points_balance, created_at, updated_at
      FROM users 
      WHERE role = 'student'
      ORDER BY full_name ASC
    `
    const result = await this.db.query(query)
    return result.rows as Omit<User, 'password_hash'>[]
  }

  // Get course with enrollment count
  async getCourseWithStats(courseId: string): Promise<(Course & { enrolled_count: number }) | null> {
    const query = `
      SELECT c.*, 
             COALESCE(COUNT(ce.user_id), 0) as enrolled_count
      FROM courses c
      LEFT JOIN course_enrollments ce ON c.id = ce.course_id
      WHERE c.id = $1 AND c.deleted_at IS NULL
      GROUP BY c.id
    `
    const result = await this.db.query(query, [courseId])
    return result.rows.length > 0 ? result.rows[0] as (Course & { enrolled_count: number }) : null
  }
}