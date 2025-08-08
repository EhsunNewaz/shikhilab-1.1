import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { healthRouter } from './routes/health'
import { enrollmentsRouter } from './enrollments/enrollments.routes'
import { createAuthRoutes } from './auth'
import { createAdminRoutes } from './admin'
import { createUsersRoutes } from './users/users.routes'
import { CoursesService, createCoursesRouter, createAdminUsersRouter } from './courses'
import { createAuthMiddleware, requireRole } from './auth/auth.middleware'
import db from './db'

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(cors())

// Rate limiting middleware
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

const enrollmentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // limit each IP to 3 enrollment attempts per 5 minutes
  message: {
    error: 'Too many enrollment attempts',
    message: 'Too many enrollment attempts from this IP, please wait 5 minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
})

// Apply rate limiting only in production/development, not in tests
if (process.env.NODE_ENV !== 'test') {
  app.use(generalLimiter)
}

// Logging middleware
app.use(morgan('combined'))

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Initialize services
const coursesService = new CoursesService(db)
const authMiddleware = createAuthMiddleware(db)

// Routes
app.use('/health', healthRouter)
app.use('/auth', createAuthRoutes(db))
app.use('/admin', createAdminRoutes(db))
app.use('/admin', authMiddleware, requireRole(['admin']), createAdminUsersRouter(coursesService))
app.use('/users', createUsersRoutes(db))
app.use('/courses', authMiddleware, requireRole(['admin']), createCoursesRouter(coursesService))
if (process.env.NODE_ENV !== 'test') {
  app.use('/enrollments', enrollmentLimiter, enrollmentsRouter)
} else {
  app.use('/enrollments', enrollmentsRouter)
}

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  })
})

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message,
  })
})

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 API server running on port ${PORT}`)
    console.log(`📊 Health check: http://localhost:${PORT}/health`)
  })
}

export default app