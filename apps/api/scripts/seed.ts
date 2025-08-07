import { Pool } from 'pg'
import { UsersService } from '../src/users/users.service'
import { generateSecurePassword } from './utils/password-generator'

async function seed() {
  const db = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/shikhilab',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  })

  const usersService = new UsersService(db)

  try {
    console.log('🌱 Starting database seeding...')

    // Check if admin user already exists
    const existingAdmin = await usersService.getUserByEmail('admin@shikhilab.com')
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists. Skipping seed.')
      return
    }

    // Generate secure password for admin
    const adminPassword = generateSecurePassword()
    
    // Create admin user
    const adminUser = await usersService.createUser({
      full_name: 'System Administrator',
      email: 'admin@shikhilab.com',
      password: adminPassword,
      role: 'admin',
      ai_credits: 10000, // Give admin more credits
      interface_language: 'en',
      ai_feedback_language: 'en', // Admin uses English for both
      gamification_opt_out: true, // Admin opts out of gamification
      gamification_is_anonymous: false
    })

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', adminUser.email)
    console.log('🔑 Password:', adminPassword)
    console.log('⚠️  IMPORTANT: Save this password! It will not be shown again.')
    
    // Create a test student user for development
    if (process.env.NODE_ENV === 'development') {
      const existingStudent = await usersService.getUserByEmail('student@test.com')
      
      if (!existingStudent) {
        await usersService.createUser({
          full_name: 'Test Student',
          email: 'student@test.com',
          password: 'testpassword123',
          role: 'student',
          target_band_score: 7.5,
          interface_language: 'en',
          ai_feedback_language: 'bn'
        })
        console.log('✅ Test student user created!')
        console.log('📧 Student Email: student@test.com')
        console.log('🔑 Student Password: testpassword123')
      }
    }

    console.log('🌱 Database seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during seeding:', error)
    process.exit(1)
  } finally {
    await db.end()
  }
}

// Run seeding
seed()