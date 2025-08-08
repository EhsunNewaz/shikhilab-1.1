import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import AdminPanel from './AdminPanel'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

// Mock the EnrollmentTable component
jest.mock('./EnrollmentTable', () => {
  return function MockEnrollmentTable({ enrollments }: any) {
    return (
      <div role="table" aria-label="Enrollment applications table">
        <div role="row">
          <div role="columnheader">Name</div>
          <div role="columnheader">Email</div>
          <div role="columnheader">Actions</div>
        </div>
        {enrollments.map((enrollment: any) => (
          <div key={enrollment.id} role="row">
            <div role="cell">{enrollment.full_name}</div>
            <div role="cell">{enrollment.email}</div>
            <div role="cell">
              <button aria-label={`Approve enrollment for ${enrollment.full_name}`}>
                Approve
              </button>
              <button aria-label={`Reject enrollment for ${enrollment.full_name}`}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }
})

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('AdminPanel Accessibility', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should not have accessibility violations when loading', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    const { container } = render(<AdminPanel />)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations with data', async () => {
    const mockEnrollments = [
      {
        id: '1',
        full_name: 'John Doe',
        email: 'john@example.com',
        transaction_id: 'TXN123',
        created_at: '2025-01-08T10:00:00Z',
        course_title: 'IELTS Course'
      },
      {
        id: '2',
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        transaction_id: 'TXN456',
        created_at: '2025-01-08T11:00:00Z',
        course_title: 'IELTS Course'
      }
    ]

    const mockCapacity = {
      total_capacity: 50,
      current_approved: 20,
      current_pending: 2,
      available_slots: 28
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

    const { container } = render(<AdminPanel />)

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 100))

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should not have accessibility violations in error state', async () => {
    mockFetch.mockRejectedValue(new Error('API Error'))

    const { container } = render(<AdminPanel />)

    // Wait for error state
    await new Promise(resolve => setTimeout(resolve, 100))

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper ARIA labels for capacity cards', async () => {
    const mockCapacity = {
      total_capacity: 50,
      current_approved: 20,
      current_pending: 5,
      available_slots: 25
    }

    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: mockCapacity })
      } as Response)

    const { container, getByText } = render(<AdminPanel />)

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 100))

    // Verify that capacity information is properly labeled
    expect(getByText('Total Capacity')).toBeInTheDocument()
    expect(getByText('Approved')).toBeInTheDocument()
    expect(getByText('Pending')).toBeInTheDocument()
    expect(getByText('Available')).toBeInTheDocument()

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper heading hierarchy', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} })
      } as Response)

    const { container, getByRole } = render(<AdminPanel />)

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 100))

    // Check for proper heading structure
    const h2Headings = container.querySelectorAll('h2')
    expect(h2Headings.length).toBeGreaterThan(0)

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have accessible loading states', async () => {
    mockFetch.mockImplementation(() => new Promise(() => {})) // Never resolves

    const { container, getByText } = render(<AdminPanel />)
    
    // Check that loading state is announced to screen readers
    expect(getByText('Loading admin panel...')).toBeInTheDocument()

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have accessible refresh button', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] })
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, data: {} })
      } as Response)

    const { container, getByRole } = render(<AdminPanel />)

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 100))

    const refreshButton = getByRole('button', { name: /refresh/i })
    expect(refreshButton).toBeInTheDocument()

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})