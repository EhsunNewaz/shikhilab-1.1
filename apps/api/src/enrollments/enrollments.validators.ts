import { z } from 'zod'
import { EnrollmentSchema } from '../../../../packages/shared/schemas'

// Request validation schema
export const CreateEnrollmentRequestSchema = EnrollmentSchema

// Response validation schemas
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

export const CreateEnrollmentResponseSchema = z.object({
  success: z.boolean(),
  data: EnrollmentResponseSchema.optional(),
  message: z.string().optional(),
  error: z.string().optional(),
})

export const CapacityInfoResponseSchema = z.object({
  capacity: z.number(),
  current: z.number(),
  available: z.number(),
})

// Type exports for TypeScript
export type CreateEnrollmentRequest = z.infer<typeof CreateEnrollmentRequestSchema>
export type EnrollmentResponse = z.infer<typeof EnrollmentResponseSchema>
export type CreateEnrollmentResponse = z.infer<typeof CreateEnrollmentResponseSchema>
export type CapacityInfoResponse = z.infer<typeof CapacityInfoResponseSchema>