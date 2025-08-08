import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// Secure JWT verification using jose library
async function verifyJWT(token: string): Promise<{ userId: string; email: string; role: string } | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret')
    const { payload } = await jwtVerify(token, secret)
    
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as string
    }
  } catch (error) {
    console.warn('JWT verification failed:', error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check if accessing admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('accessToken')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      // Redirect to login page with return URL
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    const user = await verifyJWT(token)
    if (!user) {
      // Token is invalid, redirect to login
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    if (user.role !== 'admin') {
      // User doesn't have admin role, return 403
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin role required.' },
        { status: 403 }
      )
    }
    
    // Add user info to headers for the page component
    const response = NextResponse.next()
    response.headers.set('x-user-id', user.userId)
    response.headers.set('x-user-email', user.email)
    response.headers.set('x-user-role', user.role)
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    // Add other protected routes as needed
  ]
}