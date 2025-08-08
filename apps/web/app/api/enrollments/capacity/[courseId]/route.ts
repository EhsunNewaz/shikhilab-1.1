import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params

    const response = await fetch(`${API_BASE_URL}/enrollments/capacity/${courseId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error proxying capacity request:', error)
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