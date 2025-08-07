import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { EnrollmentForm } from './EnrollmentForm'

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations)

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock capacity response
const mockCapacityResponse = {
  success: true,
  data: {
    capacity: 25,
    current: 2,
    available: 23
  }
}

describe('EnrollmentForm', () => {
  beforeEach(() => {
    mockFetch.mockClear()
    mockFetch.mockReset()
    // Default capacity fetch mock - resolve immediately for faster tests
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockCapacityResponse
    })
  })

  it('renders form with all required fields', async () => {
    render(<EnrollmentForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/bKash transaction id/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument()
    })
  })

  it('displays payment instructions', async () => {
    render(<EnrollmentForm />)

    await waitFor(() => {
      expect(screen.getByText(/payment instructions/i)).toBeInTheDocument()
      expect(screen.getByText('+880 1234567890')).toBeInTheDocument()
      expect(screen.getByText(/৳5,000/)).toBeInTheDocument()
    })
  })

  it('displays capacity information when loaded', async () => {
    render(<EnrollmentForm />)

    await waitFor(() => {
      expect(screen.getByText(/batch availability/i)).toBeInTheDocument()
      expect(screen.getByText('2 enrolled')).toBeInTheDocument()
      expect(screen.getByText('23 spots remaining')).toBeInTheDocument()
      expect(screen.getByText('25 total')).toBeInTheDocument()
    })
  })

  it('shows warning when spots are low', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          capacity: 25,
          current: 22,
          available: 3
        }
      })
    })

    render(<EnrollmentForm />)

    await waitFor(() => {
      expect(screen.getByText(/only 3 spots remaining - apply now!/i)).toBeInTheDocument()
    })
  })

  it('disables form when batch is full', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: {
          capacity: 25,
          current: 25,
          available: 0
        }
      })
    })

    render(<EnrollmentForm />)

    await waitFor(() => {
      expect(screen.getByText(/batch is full/i)).toBeInTheDocument()
      expect(screen.getByText(/Follow our social media or check back later/i)).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<EnrollmentForm />)

    // Wait for capacity to load and button to be available
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /submit application/i })
      expect(submitButton).not.toBeDisabled()
    }, { timeout: 5000 })

    const submitButton = screen.getByRole('button', { name: /submit application/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/full name must be at least 2 characters/i)).toBeInTheDocument()
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
      expect(screen.getByText(/transaction id is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    
    // Reset mocks for clean test
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockCapacityResponse
    })
    
    render(<EnrollmentForm />)

    // Wait for capacity to load and form to be ready
    await waitFor(() => {
      expect(screen.getByText(/batch availability/i)).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const transactionInput = screen.getByLabelText(/bKash transaction id/i)
    const submitButton = screen.getByRole('button', { name: /submit application/i })

    // Fill form with an email that Zod will definitely reject
    await user.type(nameInput, 'Test User')
    await user.clear(emailInput)
    await user.type(emailInput, 'just-plain-text')  // No @ or domain
    await user.type(transactionInput, 'TXN123')
    
    // Submit and wait for validation
    await user.click(submitButton)

    await waitFor(() => {
      // The exact message from our Zod schema
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()

    // Set up mocks for this specific test
    mockFetch.mockReset()
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockCapacityResponse
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: 'test-id',
            courseId: '00000000-0000-0000-0000-000000000001',
            fullName: 'John Doe',
            email: 'john@example.com',
            transactionId: 'TXN123456789',
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          message: 'Application submitted successfully!'
        })
      })

    render(<EnrollmentForm />)

    // Wait for capacity to load and button to be available
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /submit application/i })
      expect(submitButton).not.toBeDisabled()
    }, { timeout: 5000 })

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const transactionInput = screen.getByLabelText(/bKash transaction id/i)
    const submitButton = screen.getByRole('button', { name: /submit application/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(transactionInput, 'TXN123456789')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/application submitted!/i)).toBeInTheDocument()
      expect(screen.getByText(/application submitted successfully!/i)).toBeInTheDocument()
    })

    // Verify API was called correctly (second call after capacity fetch)
    expect(mockFetch).toHaveBeenLastCalledWith('/api/enrollments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName: 'John Doe',
        email: 'john@example.com',
        transactionId: 'TXN123456789',
        courseId: '00000000-0000-0000-0000-000000000001'
      }),
    })
  })

  it('handles submission errors gracefully', async () => {
    const user = userEvent.setup()

    render(<EnrollmentForm />)

    // Wait for capacity to load first
    await waitFor(() => {
      expect(screen.getByText(/batch availability/i)).toBeInTheDocument()
    })

    // Now set up mocks for the submission attempt
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: 'Validation failed',
        message: 'Email already exists'
      })
    })

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const transactionInput = screen.getByLabelText(/bKash transaction id/i)
    const submitButton = screen.getByRole('button', { name: /submit application/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(transactionInput, 'TXN123456789')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument()
    }, { timeout: 5000 })
  }, 15000)

  it('handles network errors', async () => {
    const user = userEvent.setup()

    render(<EnrollmentForm />)

    // Wait for capacity to load first
    await waitFor(() => {
      expect(screen.getByText(/batch availability/i)).toBeInTheDocument()
    })

    // Now set up mock for network error on submission
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const nameInput = screen.getByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)
    const transactionInput = screen.getByLabelText(/bKash transaction id/i)
    const submitButton = screen.getByRole('button', { name: /submit application/i })

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(transactionInput, 'TXN123456789')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    }, { timeout: 5000 })
  }, 10000)

  it('should not have accessibility violations', async () => {
    const { container } = render(<EnrollmentForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    })

    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup()
    render(<EnrollmentForm />)

    // Wait for capacity to load and button to be available
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /submit application/i })
      expect(submitButton).not.toBeDisabled()
    }, { timeout: 5000 })

    // Submit empty form to trigger validation errors
    const submitButton = screen.getByRole('button', { name: /submit application/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/full name must be at least 2 characters/i)).toBeInTheDocument()
    })

    // Start typing in name field - error should clear
    const nameInput = screen.getByLabelText(/full name/i)
    await user.type(nameInput, 'J')

    await waitFor(() => {
      expect(screen.queryByText(/full name must be at least 2 characters/i)).not.toBeInTheDocument()
    })
  })
})