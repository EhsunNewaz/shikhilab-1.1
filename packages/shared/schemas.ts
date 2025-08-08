import { z } from 'zod'

export const HealthResponseSchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  timestamp: z.string(),
  uptime: z.number(),
  environment: z.string(),
  version: z.string(),
})

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

export const EnrollmentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(255),
  email: z.string().email('Please enter a valid email address'),
  transactionId: z.string().min(1, 'Transaction ID is required').max(255),
  courseId: z.string().uuid('Invalid course ID'),
})

export const EnrollmentResponseSchema = z.object({
  id: z.string().uuid(),
  courseId: z.string().uuid(),
  fullName: z.string(),
  email: z.string().email(),
  transactionId: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const UserRoleSchema = z.enum(['student', 'admin'])

export const UserSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(255),
  email: z.string().email('Please enter a valid email address'),
  password_hash: z.string(),
  role: UserRoleSchema,
  ai_credits: z.number().int().min(0),
  target_band_score: z.number().min(0).max(9).optional(),
  target_test_date: z.string().optional(),
  interface_language: z.string().length(2, 'Language code must be 2 characters'),
  ai_feedback_language: z.string().length(2, 'Language code must be 2 characters'),
  gamification_opt_out: z.boolean(),
  gamification_is_anonymous: z.boolean(),
  current_streak: z.number().int().min(0),
  points_balance: z.number().int().min(0),
  created_at: z.string(),
  updated_at: z.string(),
})

export const LoginRequestSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const UserCreateSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(255),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: UserRoleSchema.default('student'),
})