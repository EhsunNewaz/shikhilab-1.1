import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { User } from 'shared'
import { CreateUserRequest } from './users.validators'

export class UsersService {
  private db: Pool

  constructor(db: Pool) {
    this.db = db
  }

  async createUser(userData: CreateUserRequest): Promise<Omit<User, 'password_hash'>> {
    const {
      full_name,
      email,
      password,
      role = 'student',
      ai_credits = 500,
      target_band_score,
      target_test_date,
      interface_language = 'en',
      ai_feedback_language = 'bn',
      gamification_opt_out = false,
      gamification_is_anonymous = false
    } = userData

    // Check if user with email already exists
    const existingUser = await this.db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      throw new Error('User with this email already exists')
    }

    // Hash the password
    const saltRounds = 12
    const password_hash = await bcrypt.hash(password, saltRounds)

    // Insert new user
    const insertQuery = `
      INSERT INTO users (
        full_name, email, password_hash, role, ai_credits,
        target_band_score, target_test_date, interface_language,
        ai_feedback_language, gamification_opt_out, gamification_is_anonymous
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, full_name, email, role, ai_credits, target_band_score,
                target_test_date, interface_language, ai_feedback_language,
                gamification_opt_out, gamification_is_anonymous, current_streak,
                points_balance, created_at, updated_at
    `

    const values = [
      full_name,
      email,
      password_hash,
      role,
      ai_credits,
      target_band_score || null,
      target_test_date || null,
      interface_language,
      ai_feedback_language,
      gamification_opt_out,
      gamification_is_anonymous
    ]

    const result = await this.db.query(insertQuery, values)
    const newUser = result.rows[0]

    // Log user creation for audit purposes (PII access logging per security constraints)
    console.log(`User created: ID=${newUser.id}, Email=${email}, Role=${role}`)

    return newUser
  }

  async getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    const query = `
      SELECT id, full_name, email, role, ai_credits, target_band_score,
             target_test_date, interface_language, ai_feedback_language,
             gamification_opt_out, gamification_is_anonymous, current_streak,
             points_balance, created_at, updated_at
      FROM users WHERE id = $1
    `
    
    const result = await this.db.query(query, [id])
    
    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  }

  async getUserByEmail(email: string): Promise<Omit<User, 'password_hash'> | null> {
    const query = `
      SELECT id, full_name, email, role, ai_credits, target_band_score,
             target_test_date, interface_language, ai_feedback_language,
             gamification_opt_out, gamification_is_anonymous, current_streak,
             points_balance, created_at, updated_at
      FROM users WHERE email = $1
    `
    
    const result = await this.db.query(query, [email])
    
    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  }

  async updateUser(id: string, updates: Partial<CreateUserRequest>): Promise<Omit<User, 'password_hash'>> {
    // Build dynamic update query
    const allowedFields = [
      'full_name', 'target_band_score', 'target_test_date', 
      'interface_language', 'ai_feedback_language',
      'gamification_opt_out', 'gamification_is_anonymous'
    ]
    
    const setClauses: string[] = []
    const values: any[] = []
    let paramIndex = 1

    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key) && value !== undefined) {
        setClauses.push(`${key} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }
    })

    if (setClauses.length === 0) {
      throw new Error('No valid fields to update')
    }

    setClauses.push(`updated_at = NOW()`)
    values.push(id) // Add id as the last parameter

    const query = `
      UPDATE users 
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, full_name, email, role, ai_credits, target_band_score,
                target_test_date, interface_language, ai_feedback_language,
                gamification_opt_out, gamification_is_anonymous, current_streak,
                points_balance, created_at, updated_at
    `

    const result = await this.db.query(query, values)
    
    if (result.rows.length === 0) {
      throw new Error('User not found')
    }

    return result.rows[0]
  }
}