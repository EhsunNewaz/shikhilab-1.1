import { createGetProxy } from '../../../../lib/api-proxy'

// Use the reusable proxy utility with authentication required
export const GET = createGetProxy('/admin/enrollments', { 
  requireAuth: true,
  timeout: 8000,
  retries: 1
})