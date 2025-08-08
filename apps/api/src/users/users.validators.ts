import { z } from 'zod'

export const createUserSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(255),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['student', 'admin']).default('student'),
  ai_credits: z.number().int().min(0).default(500),
  target_band_score: z.number().min(0).max(9).optional(),
  target_test_date: z.string().optional(),
  interface_language: z.string().default('en'),
  ai_feedback_language: z.string().default('bn'),
  gamification_opt_out: z.boolean().default(false),
  gamification_is_anonymous: z.boolean().default(false)
})

export const setPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
})

export type CreateUserRequest = z.infer<typeof createUserSchema>
export type SetPasswordRequest = z.infer<typeof setPasswordSchema>