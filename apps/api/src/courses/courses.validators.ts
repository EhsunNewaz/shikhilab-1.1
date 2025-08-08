import { z } from 'zod'

// Date validation helper - ensures date is not in the past
const futureDateValidator = z.string().datetime('Invalid date format').refine((dateStr) => {
  const releaseDate = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset time to start of day for comparison
  return releaseDate >= today
}, {
  message: 'Release date cannot be in the past'
})

// Course validation schemas
export const CreateCourseRequestSchema = z.object({
  title: z.string().min(1, 'Course title is required').max(255),
  description: z.string().optional(),
  capacity: z.number().int().min(1, 'Capacity must be at least 1').default(50),
})

export const UpdateCourseRequestSchema = z.object({
  title: z.string().min(1, 'Course title is required').max(255).optional(),
  description: z.string().optional(),
  capacity: z.number().int().min(1, 'Capacity must be at least 1').optional(),
})

// Class validation schemas
export const CreateClassRequestSchema = z.object({
  title: z.string().min(1, 'Class title is required').max(255),
  order_number: z.number().int().min(1, 'Order number must be at least 1'),
  release_date: futureDateValidator.optional(),
})

export const UpdateClassRequestSchema = z.object({
  title: z.string().min(1, 'Class title is required').max(255).optional(),
  order_number: z.number().int().min(1, 'Order number must be at least 1').optional(),
  release_date: futureDateValidator.optional(),
})

// Course enrollment validation schemas
export const CreateCourseEnrollmentRequestSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
})

// UUID param validation
export const UUIDParamSchema = z.string().uuid('Invalid UUID format')