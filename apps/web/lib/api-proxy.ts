import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001'

interface ProxyOptions {
  requireAuth?: boolean
  timeout?: number
  retries?: number
}

/**
 * Reusable API proxy utility that handles authentication, retries, and error handling
 */
export async function proxyToBackend(
  request: NextRequest,
  endpoint: string,
  options: ProxyOptions = {}
): Promise<NextResponse> {
  const { requireAuth = true, timeout = 10000, retries = 2 } = options

  try {
    // Extract and validate authorization if required
    let headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (requireAuth) {
      const authorization = request.headers.get('authorization')
      if (!authorization) {
        return NextResponse.json(
          { success: false, error: 'Authorization header required' },
          { status: 401 }
        )
      }
      headers['Authorization'] = authorization
    }

    // Copy other relevant headers
    const userAgent = request.headers.get('user-agent')
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    
    if (userAgent) headers['User-Agent'] = userAgent
    if (clientIp) headers['X-Client-IP'] = clientIp

    // Get request body if present
    let body: string | undefined
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      try {
        const requestBody = await request.json()
        body = JSON.stringify(requestBody)
      } catch (error) {
        // Request might not have a body or might not be JSON
        body = undefined
      }
    }

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    let lastError: Error | null = null
    let attempt = 0

    // Retry logic
    while (attempt <= retries) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: request.method,
          headers,
          body,
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        // Forward the response
        const data = await response.json()
        return NextResponse.json(data, { 
          status: response.status,
          headers: {
            'X-Proxy-Attempt': String(attempt + 1)
          }
        })

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        attempt++
        
        // Don't retry on certain errors
        if (error instanceof Error && (
          error.name === 'AbortError' ||
          error.message.includes('401') ||
          error.message.includes('403')
        )) {
          break
        }

        // Exponential backoff for retries
        if (attempt <= retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100))
        }
      }
    }

    clearTimeout(timeoutId)

    // Handle final error
    console.error(`API proxy failed after ${attempt} attempts to ${endpoint}:`, lastError)
    
    if (lastError?.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'Request timeout' },
        { status: 408 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Backend service unavailable' },
      { status: 503 }
    )

  } catch (error) {
    console.error('Error in API proxy setup:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Helper for common GET proxy pattern
 */
export function createGetProxy(endpoint: string, options?: ProxyOptions) {
  return async function GET(request: NextRequest) {
    return proxyToBackend(request, endpoint, options)
  }
}

/**
 * Helper for common POST proxy pattern
 */
export function createPostProxy(endpoint: string, options?: ProxyOptions) {
  return async function POST(request: NextRequest) {
    return proxyToBackend(request, endpoint, options)
  }
}

/**
 * Helper for common PATCH proxy pattern
 */
export function createPatchProxy(endpoint: string, options?: ProxyOptions) {
  return async function PATCH(request: NextRequest) {
    return proxyToBackend(request, endpoint, options)
  }
}