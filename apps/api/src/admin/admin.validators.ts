import { z } from 'zod'

export const approveEnrollmentSchema = z.object({
  enrollmentId: z.string().uuid('Invalid enrollment ID format')
})

export const rejectEnrollmentSchema = z.object({
  enrollmentId: z.string().uuid('Invalid enrollment ID format')
})

export const getEnrollmentsQuerySchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  offset: z.string().regex(/^\d+$/).transform(Number).optional()
})

export const courseIdSchema = z.object({
  courseId: z.string().uuid('Invalid course ID format')
})

export type ApproveEnrollmentRequest = z.infer<typeof approveEnrollmentSchema>
export type RejectEnrollmentRequest = z.infer<typeof rejectEnrollmentSchema>
export type GetEnrollmentsQuery = z.infer<typeof getEnrollmentsQuerySchema>
export type CourseIdRequest = z.infer<typeof courseIdSchema>