import { Pool } from 'pg'

// Create database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/shikhilab',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Test the connection
pool.on('connect', () => {
  console.log('📊 Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err)
})

export default pool