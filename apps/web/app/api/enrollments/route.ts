import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error proxying enrollment request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Network error',
        message: 'Failed to connect to the server. Please try again later.',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    const status = searchParams.get('status')

    let url = `${API_BASE_URL}/enrollments`
    const params = new URLSearchParams()
    
    if (courseId) params.append('courseId', courseId)
    if (status) params.append('status', status)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error proxying enrollment GET request:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Network error',
        message: 'Failed to connect to the server. Please try again later.',
      },
      { status: 500 }
    )
  }
}