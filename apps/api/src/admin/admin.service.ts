import { Pool } from 'pg'
import { UsersService } from '../users/users.service'
import { AdminEnrollmentView, EnrollmentCapacity } from 'shared'
import { EmailService } from '../email'
import crypto from 'crypto'

export class AdminService {
  private db: Pool
  private usersService: UsersService
  private emailService: EmailService

  constructor(db: Pool, emailService: EmailService) {
    this.db = db
    this.usersService = new UsersService(db)
    this.emailService = emailService
  }

  async getPendingEnrollments(): Promise<AdminEnrollmentView[]> {
    const query = `
      SELECT 
        e.id,
        e.full_name,
        e.email,
        e.transaction_id,
        e.created_at,
        c.title as course_title
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.status = 'pending'
      ORDER BY e.created_at ASC
    `
    
    const result = await this.db.query(query)
    return result.rows
  }

  async getEnrollmentCapacityInfo(courseId?: string): Promise<EnrollmentCapacity> {
    let capacityQuery: string
    let queryParams: any[] = []

    if (courseId) {
      capacityQuery = `
        SELECT 
          c.capacity as total_capacity,
          COUNT(CASE WHEN e.status = 'approved' THEN 1 END) as current_approved,
          COUNT(CASE WHEN e.status = 'pending' THEN 1 END) as current_pending
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
        WHERE c.id = $1
        GROUP BY c.capacity
      `
      queryParams = [courseId]
    } else {
      // Get aggregate capacity across all courses
      capacityQuery = `
        SELECT 
          SUM(c.capacity) as total_capacity,
          COUNT(CASE WHEN e.status = 'approved' THEN 1 END) as current_approved,
          COUNT(CASE WHEN e.status = 'pending' THEN 1 END) as current_pending
        FROM courses c
        LEFT JOIN enrollments e ON c.id = e.course_id
      `
    }

    const result = await this.db.query(capacityQuery, queryParams)
    const row = result.rows[0]

    const totalCapacity = parseInt(row.total_capacity) || 0
    const currentApproved = parseInt(row.current_approved) || 0
    const currentPending = parseInt(row.current_pending) || 0
    const availableSlots = Math.max(0, totalCapacity - currentApproved - currentPending)

    return {
      total_capacity: totalCapacity,
      current_approved: currentApproved,
      current_pending: currentPending,
      available_slots: availableSlots
    }
  }

  async approveEnrollment(enrollmentId: string): Promise<{ success: boolean; error?: string; passwordToken?: string; emailSent?: boolean }> {
    const client = await this.db.connect()
    
    try {
      await client.query('BEGIN')

      // Get enrollment details
      const enrollmentResult = await client.query(
        'SELECT * FROM enrollments WHERE id = $1 AND status = $2',
        [enrollmentId, 'pending']
      )

      if (enrollmentResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return { success: false, error: 'Enrollment not found or already processed' }
      }

      const enrollment = enrollmentResult.rows[0]

      // Check capacity
      const capacityInfo = await this.getEnrollmentCapacityInfo(enrollment.course_id)
      if (capacityInfo.available_slots <= 0) {
        await client.query('ROLLBACK')
        return { success: false, error: 'Course capacity exceeded' }
      }

      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [enrollment.email]
      )

      let userId: string

      if (existingUser.rows.length > 0) {
        userId = existingUser.rows[0].id
        
        // Update enrollment status
        await client.query(
          'UPDATE enrollments SET status = $1, updated_at = NOW() WHERE id = $2',
          ['approved', enrollmentId]
        )
      } else {
        // Generate temporary password and create user
        const tempPassword = crypto.randomBytes(12).toString('base64')
        
        try {
          const newUser = await this.usersService.createUser({
            full_name: enrollment.full_name,
            email: enrollment.email,
            password: tempPassword,
            role: 'student',
            ai_credits: 500,
            interface_language: 'en',
            ai_feedback_language: 'bn',
            gamification_opt_out: false,
            gamification_is_anonymous: false
          })
          userId = newUser.id

          // Update enrollment status
          await client.query(
            'UPDATE enrollments SET status = $1, updated_at = NOW() WHERE id = $2',
            ['approved', enrollmentId]
          )

          // Generate password setup token
          const passwordToken = crypto.randomBytes(32).toString('hex')
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

          await client.query(
            `INSERT INTO password_setup_tokens (token, email, expires_at) 
             VALUES ($1, $2, $3)
             ON CONFLICT (email) 
             DO UPDATE SET token = $1, expires_at = $3, created_at = NOW()`,
            [passwordToken, enrollment.email, expiresAt]
          )

          await client.query('COMMIT')

          // Send password setup email with resilient error handling  
          let emailResult: { success: boolean; error?: string } = { success: false, error: 'Not attempted' }
          
          try {
            const setupUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/password-setup?token=${passwordToken}`
            
            emailResult = await this.emailService.sendEmail({
              to: enrollment.email,
              template: 'password-setup',
              templateData: {
                fullName: enrollment.full_name,
                email: enrollment.email,
                setupUrl: setupUrl,
                expiryHours: 24
              }
            })

            if (!emailResult.success) {
              console.error(`Failed to send password setup email to ${enrollment.email}:`, emailResult.error)
              
              // Store failed email attempt for retry mechanism
              await this.storeFailedEmailAttempt({
                type: 'password-setup',
                recipient: enrollment.email,
                data: {
                  fullName: enrollment.full_name,
                  email: enrollment.email,
                  setupUrl: setupUrl,
                  expiryHours: 24
                },
                enrollmentId: enrollmentId,
                userId: userId
              })
            }
          } catch (emailError) {
            console.error(`Error sending password setup email to ${enrollment.email}:`, emailError)
            emailResult = { success: false, error: emailError instanceof Error ? emailError.message : 'Unknown error' }
            
            // Store failed email attempt for retry mechanism
            await this.storeFailedEmailAttempt({
              type: 'password-setup',
              recipient: enrollment.email,
              data: {
                fullName: enrollment.full_name,
                email: enrollment.email,
                setupUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/password-setup?token=${passwordToken}`,
                expiryHours: 24
              },
              enrollmentId: enrollmentId,
              userId: userId
            })
          }

          // Log enrollment approval for audit
          console.log(`Enrollment approved: ID=${enrollmentId}, Email=${enrollment.email}, UserID=${userId}, EmailSent=${emailResult.success}`)

          return { 
            success: true, 
            passwordToken,
            emailSent: emailResult.success
          }
        } catch (userCreationError) {
          await client.query('ROLLBACK')
          console.error('Error creating user during enrollment approval:', userCreationError)
          return { success: false, error: 'Failed to create user account' }
        }
      }

      await client.query('COMMIT')
      console.log(`Enrollment approved: ID=${enrollmentId}, Email=${enrollment.email}, UserID=${userId}`)
      
      return { success: true, emailSent: false }
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error approving enrollment:', error)
      return { success: false, error: 'Internal server error during approval' }
    } finally {
      client.release()
    }
  }

  async rejectEnrollment(enrollmentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Verify enrollment exists and is pending
      const checkResult = await this.db.query(
        'SELECT id, email FROM enrollments WHERE id = $1 AND status = $2',
        [enrollmentId, 'pending']
      )

      if (checkResult.rows.length === 0) {
        return { success: false, error: 'Enrollment not found or already processed' }
      }

      const enrollment = checkResult.rows[0]

      // Update enrollment status to rejected
      await this.db.query(
        'UPDATE enrollments SET status = $1, updated_at = NOW() WHERE id = $2',
        ['rejected', enrollmentId]
      )

      // Log enrollment rejection for audit
      console.log(`Enrollment rejected: ID=${enrollmentId}, Email=${enrollment.email}`)

      return { success: true }
    } catch (error) {
      console.error('Error rejecting enrollment:', error)
      return { success: false, error: 'Internal server error during rejection' }
    }
  }

  async createPasswordSetupToken(email: string): Promise<string> {
    // Generate cryptographically secure random token
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store token securely - consider hashing if storing in production
    await this.db.query(
      `INSERT INTO password_setup_tokens (token, email, expires_at) 
       VALUES ($1, $2, $3)
       ON CONFLICT (email) 
       DO UPDATE SET token = $1, expires_at = $3, created_at = NOW()`,
      [token, email, expiresAt]
    )

    // Log token creation for security audit
    console.log(`Password setup token created for email: ${email}, expires: ${expiresAt.toISOString()}`)

    return token
  }

  async validatePasswordSetupToken(token: string): Promise<{ valid: boolean; email?: string; error?: string }> {
    try {
      // Use constant-time comparison to prevent timing attacks
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
      
      const result = await this.db.query(
        'SELECT email, expires_at, token FROM password_setup_tokens WHERE token = $1',
        [token]
      )

      // Constant-time validation to prevent timing attacks
      let isValidToken = false
      let tokenEmail = ''
      let expiresAt = new Date()
      
      if (result && result.rows && result.rows.length > 0) {
        const tokenData = result.rows[0]
        // Check if token data exists and is valid
        if (tokenData && tokenData.token) {
          // Use crypto.timingSafeEqual for constant-time comparison
          const storedTokenHash = crypto.createHash('sha256').update(tokenData.token).digest('hex')
          isValidToken = crypto.timingSafeEqual(Buffer.from(hashedToken), Buffer.from(storedTokenHash))
          tokenEmail = tokenData.email
          expiresAt = new Date(tokenData.expires_at)
        }
      }

      // Always check expiration, even for invalid tokens
      const isExpired = new Date() > expiresAt
      
      if (!isValidToken) {
        return { valid: false, error: 'Invalid token' }
      }
      
      if (isExpired) {
        // Clean up expired token
        await this.db.query('DELETE FROM password_setup_tokens WHERE token = $1', [token])
        return { valid: false, error: 'Token has expired' }
      }

      return { valid: true, email: tokenEmail }
    } catch (error) {
      console.error('Error validating password setup token:', error)
      return { valid: false, error: 'Internal server error' }
    }
  }

  async consumePasswordSetupToken(token: string): Promise<{ success: boolean; email?: string; error?: string }> {
    try {
      const validation = await this.validatePasswordSetupToken(token)
      
      if (!validation.valid) {
        return { success: false, error: validation.error }
      }

      // Remove the token after successful validation
      await this.db.query('DELETE FROM password_setup_tokens WHERE token = $1', [token])
      
      return { success: true, email: validation.email }
    } catch (error) {
      console.error('Error consuming password setup token:', error)
      return { success: false, error: 'Internal server error' }
    }
  }

  private async storeFailedEmailAttempt(attempt: {
    type: string;
    recipient: string;
    data: Record<string, any>;
    enrollmentId: string;
    userId: string;
  }): Promise<void> {
    try {
      await this.db.query(
        `INSERT INTO failed_email_attempts (type, recipient, data, enrollment_id, user_id, created_at, retry_count)
         VALUES ($1, $2, $3, $4, $5, NOW(), 0)`,
        [
          attempt.type,
          attempt.recipient,
          JSON.stringify(attempt.data),
          attempt.enrollmentId,
          attempt.userId
        ]
      )
      console.log(`Stored failed email attempt for retry: ${attempt.recipient}`)
    } catch (error) {
      console.error('Failed to store failed email attempt:', error)
      // Don't throw here to prevent cascading failures
    }
  }

  async retryFailedEmails(maxRetries = 3): Promise<{ processed: number; succeeded: number; failed: number }> {
    try {
      const result = await this.db.query(
        `SELECT * FROM failed_email_attempts 
         WHERE retry_count < $1 AND created_at > NOW() - INTERVAL '7 days'
         ORDER BY created_at ASC
         LIMIT 100`,
        [maxRetries]
      )

      let processed = 0
      let succeeded = 0
      let failed = 0

      for (const attempt of result.rows) {
        processed++
        
        try {
          const emailResult = await this.emailService.sendEmail({
            to: attempt.recipient,
            template: attempt.type,
            templateData: JSON.parse(attempt.data)
          })

          if (emailResult.success) {
            // Remove successful attempt
            await this.db.query(
              'DELETE FROM failed_email_attempts WHERE id = $1',
              [attempt.id]
            )
            succeeded++
            console.log(`Email retry succeeded: ${attempt.recipient}`)
          } else {
            // Increment retry count
            await this.db.query(
              'UPDATE failed_email_attempts SET retry_count = retry_count + 1, last_retry = NOW() WHERE id = $1',
              [attempt.id]
            )
            failed++
            console.log(`Email retry failed: ${attempt.recipient}, attempt ${attempt.retry_count + 1}`)
          }
        } catch (error) {
          // Increment retry count on error
          await this.db.query(
            'UPDATE failed_email_attempts SET retry_count = retry_count + 1, last_retry = NOW() WHERE id = $1',
            [attempt.id]
          )
          failed++
          console.error(`Email retry error: ${attempt.recipient}`, error)
        }
      }

      return { processed, succeeded, failed }
    } catch (error) {
      console.error('Error during email retry process:', error)
      return { processed: 0, succeeded: 0, failed: 0 }
    }
  }
}