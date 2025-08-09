import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AdminPanel from './AdminPanel'

// Mock the EnrollmentTable component
jest.mock('./EnrollmentTable', () => ({
  EnrollmentTable: function MockEnrollmentTable({ enrollments, onEnrollmentAction }: any) {
    return (
      <div data-testid="enrollment-table">
        <span>Enrollments: {enrollments.length}</span>
        <button 
          onClick={() => onEnrollmentAction('test-id', 'approve')}
          data-testid="mock-approve-btn"
        >
          Mock Approve
        </button>
      </div>
    )
  }
}))

// Mock fetch
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('AdminPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<AdminPanel />)
    
    expect(screen.getByText('Loading admin panel...')).toBeInTheDocument()
  })

  it('renders capacity information and enrollment table', async () => {
    const mockEnrollments = [
      {
        id: '1',
        full_name: 'John Doe',
        email: 'john@example.com',
        transaction_id: 'TXN123',
        created_at: '2025-01-08T10:00:00Z',
        course_title: 'IELTS Course'
      }
    ]

    const mockCapacity = {
      total_capacity: 50,
      current_approved: 20,
      current_pending: 5,
      available_slots: 25
    }

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEnrollments })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockCapacity })
      } as Response)

    render(<AdminPanel />)

    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument() // Total capacity
      expect(screen.getByText('20')).toBeInTheDocument() // Approved
      expect(screen.getByText('5')).toBeInTheDocument()  // Pending
      expect(screen.getByText('25')).toBeInTheDocument() // Available
    })

    expect(screen.getByTestId('enrollment-table')).toBeInTheDocument()
    expect(screen.getByText('Enrollments: 1')).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('API Error'))

    render(<AdminPanel />)

    await waitFor(() => {
      expect(screen.getByText('Error loading admin data')).toBeInTheDocument()
      expect(screen.getByText(/Failed to load admin data/)).toBeInTheDocument()
    })

    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('handles enrollment actions with optimistic updates', async () => {
    const mockEnrollments = [
      {
        id: 'test-id',
        full_name: 'John Doe',
        email: 'john@example.com',
        transaction_id: 'TXN123',
        created_at: '2025-01-08T10:00:00Z',
        course_title: 'IELTS Course'
      }
    ]

    const mockCapacity = {
      total_capacity: 50,
      current_approved: 20,
      current_pending: 5,
      available_slots: 25
    }

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEnrollments })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockCapacity })
      } as Response)

    render(<AdminPanel />)

    await waitFor(() => {
      expect(screen.getByText('Enrollments: 1')).toBeInTheDocument()
    })

    // Simulate enrollment action
    const approveBtn = screen.getByTestId('mock-approve-btn')
    fireEvent.click(approveBtn)

    // Should update the UI optimistically
    await waitFor(() => {
      expect(screen.getByText('Enrollments: 0')).toBeInTheDocument()
    })
  })

  it('displays refresh functionality', async () => {
    const mockEnrollments: any[] = []
    const mockCapacity = {
      total_capacity: 50,
      current_approved: 20,
      current_pending: 0,
      available_slots: 30
    }

    mockFetch
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockEnrollments })
      } as Response)
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockCapacity })
      } as Response)

    render(<AdminPanel />)

    await waitFor(() => {
      expect(screen.getByText('Refresh')).toBeInTheDocument()
    })

    const refreshBtn = screen.getByText('Refresh')
    fireEvent.click(refreshBtn)

    expect(screen.getByText('Refreshing...')).toBeInTheDocument()
  })

  it('shows appropriate colors for available slots', async () => {
    const mockCapacityFull = {
      total_capacity: 50,
      current_approved: 50,
      current_pending: 0,
      available_slots: 0
    }

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockCapacityFull })
      } as Response)

    render(<AdminPanel />)

    await waitFor(() => {
      // When capacity is full, available slots should be displayed in red
      const availableElement = screen.getByText('0')
      expect(availableElement.parentElement).toHaveClass('text-red-600')
    }, { timeout: 10000 })
  })
})