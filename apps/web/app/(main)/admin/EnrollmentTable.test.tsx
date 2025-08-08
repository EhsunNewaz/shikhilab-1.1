import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { EnrollmentTable } from './EnrollmentTable'

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(() => 'mock-jwt-token'),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
  writable: true,
})

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('EnrollmentTable', () => {
  const mockEnrollments = [
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      full_name: 'John Doe',
      email: 'john@example.com',
      transaction_id: 'TXN123456789',
      created_at: '2025-01-08T10:00:00Z',
      course_title: 'IELTS Preparation Course'
    },
    {
      id: '456e7890-e89b-12d3-a456-426614174001',
      full_name: 'Jane Smith',
      email: 'jane@example.com',
      transaction_id: 'TXN987654321',
      created_at: '2025-01-08T11:00:00Z',
      course_title: 'IELTS Preparation Course'
    }
  ]

  const mockOnEnrollmentAction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    } as Response)
  })

  it('renders enrollment table with data', () => {
    render(
      <EnrollmentTable 
        enrollments={mockEnrollments} 
        onEnrollmentAction={mockOnEnrollmentAction} 
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('TXN123456789')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    
    // Check for approve and reject buttons
    expect(screen.getAllByText('Approve')).toHaveLength(2)
    expect(screen.getAllByText('Reject')).toHaveLength(2)
  })

  it('renders empty state when no enrollments', () => {
    render(
      <EnrollmentTable 
        enrollments={[]} 
        onEnrollmentAction={mockOnEnrollmentAction} 
      />
    )

    expect(screen.getByText('No pending enrollments')).toBeInTheDocument()
    expect(screen.getByText('All enrollments have been processed.')).toBeInTheDocument()
  })

  it('shows confirmation dialog before approval', async () => {
    render(
      <EnrollmentTable 
        enrollments={mockEnrollments} 
        onEnrollmentAction={mockOnEnrollmentAction} 
      />
    )

    const approveButtons = screen.getAllByText('Approve')
    fireEvent.click(approveButtons[0])

    expect(screen.getByText('Approve Enrollment')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to approve the enrollment for/)).toBeInTheDocument()
    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
    expect(screen.getByText(/This will create a student account and send a password setup email/)).toBeInTheDocument()
  })

  it('shows confirmation dialog before rejection', async () => {
    render(
      <EnrollmentTable 
        enrollments={mockEnrollments} 
        onEnrollmentAction={mockOnEnrollmentAction} 
      />
    )

    const rejectButtons = screen.getAllByText('Reject')
    fireEvent.click(rejectButtons[0])

    expect(screen.getByText('Reject Enrollment')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to reject the enrollment for/)).toBeInTheDocument()
    expect(screen.getByText(/John Doe/)).toBeInTheDocument()
  })

  it('handles successful approval action', async () => {
    render(
      <EnrollmentTable 
        enrollments={mockEnrollments} 
        onEnrollmentAction={mockOnEnrollmentAction} 
      />
    )

    const approveButtons = screen.getAllByText('Approve')
    fireEvent.click(approveButtons[0])

    // Confirm the action
    const confirmButton = screen.getByText('Approve')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/admin/enrollments/123e4567-e89b-12d3-a456-426614174000/approve',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      )
    })

    expect(mockOnEnrollmentAction).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
      'approve'
    )
  })

  it('handles successful rejection action', async () => {
    render(
      <EnrollmentTable 
        enrollments={mockEnrollments} 
        onEnrollmentAction={mockOnEnrollmentAction} 
      />
    )

    const rejectButtons = screen.getAllByText('Reject')
    fireEvent.click(rejectButtons[0])

    // Confirm the action
    const confirmButton = screen.getByText('Reject')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/admin/enrollments/123e4567-e89b-12d3-a456-426614174000/reject',
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-jwt-token'
          })
        })
      )
    })

    expect(mockOnEnrollmentAction).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
      'reject'
    )
  })

  it('shows loading state during action processing', async () => {
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(
      <EnrollmentTable 
        enrollments={mockEnrollments} 
        onEnrollmentAction={mockOnEnrollmentAction} 
      />
    )

    const approveButtons = screen.getAllByText('Approve')
    fireEvent.click(approveButtons[0])

    // Confirm the action
    const confirmButton = screen.getByText('Approve')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.getByText('Approving...')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('API Error'))
    
    // Mock alert
    jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(
      <EnrollmentTable 
        enrollments={mockEnrollments} 
        onEnrollmentAction={mockOnEnrollmentAction} 
      />
    )

    const approveButtons = screen.getAllByText('Approve')
    fireEvent.click(approveButtons[0])

    // Confirm the action
    const confirmButton = screen.getByText('Approve')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Failed to approve enrollment. Please try again.')
    })
  })

  it('can cancel confirmation dialog', () => {
    render(
      <EnrollmentTable 
        enrollments={mockEnrollments} 
        onEnrollmentAction={mockOnEnrollmentAction} 
      />
    )

    const approveButtons = screen.getAllByText('Approve')
    fireEvent.click(approveButtons[0])

    expect(screen.getByText('Approve Enrollment')).toBeInTheDocument()

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(screen.queryByText('Approve Enrollment')).not.toBeInTheDocument()
    expect(mockOnEnrollmentAction).not.toHaveBeenCalled()
  })

  it('formats dates correctly', () => {
    render(
      <EnrollmentTable 
        enrollments={mockEnrollments} 
        onEnrollmentAction={mockOnEnrollmentAction} 
      />
    )

    // Check that dates are formatted properly
    expect(screen.getByText(/Jan 8, 2025/)).toBeInTheDocument()
  })

  it('disables buttons during processing', async () => {
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(
      <EnrollmentTable 
        enrollments={mockEnrollments} 
        onEnrollmentAction={mockOnEnrollmentAction} 
      />
    )

    const approveButtons = screen.getAllByText('Approve')
    fireEvent.click(approveButtons[0])

    // Confirm the action
    const confirmButton = screen.getByText('Approve')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      const buttons = screen.getAllByRole('button')
      const disabledButtons = buttons.filter(btn => btn.hasAttribute('disabled'))
      expect(disabledButtons.length).toBeGreaterThan(0)
    })
  })
})