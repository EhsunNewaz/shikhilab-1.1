import { NextRequest } from 'next/server'
import { proxyToBackend } from '../../../../../../lib/api-proxy'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  
  return proxyToBackend(request, `/admin/enrollments/${id}/approve`, {
    requireAuth: true,
    timeout: 15000, // Longer timeout for email operations
    retries: 0 // Don't retry approval operations to avoid duplicates
  })
}