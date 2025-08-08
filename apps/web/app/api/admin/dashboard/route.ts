import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    // Extract authorization header
    const authorization = request.headers.get('authorization')
    
    if (!authorization) {
      return NextResponse.json(
        { success: false, error: 'Authorization header required' },
        { status: 401 }
      )
    }

    // Forward request to backend API
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error proxying admin dashboard request:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}