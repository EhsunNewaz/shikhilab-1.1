import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CourseForm } from '../../../app/(auth)/admin/courses/components/CourseForm'

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(() => 'mock-token'),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

describe('CourseForm', () => {
  const mockOnClose = jest.fn()
  const mockOnCourseCreated = jest.fn()

  const mockCourse = {
    id: 'course-uuid',
    title: 'IELTS Preparation Course',
    description: 'Comprehensive IELTS preparation',
    capacity: 25,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderCourseForm = () => {
    return render(
      <CourseForm
        onClose={mockOnClose}
        onCourseCreated={mockOnCourseCreated}
      />
    )
  }

  it('renders course form correctly', () => {
    renderCourseForm()

    expect(screen.getByText('Create New Course')).toBeInTheDocument()
    expect(screen.getByLabelText(/course title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/maximum capacity/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create course/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('has default capacity value of 50', () => {
    renderCourseForm()

    const capacityInput = screen.getByLabelText(/maximum capacity/i) as HTMLInputElement
    expect(capacityInput.value).toBe('50')
  })

  it('updates form fields when user types', async () => {
    const user = userEvent.setup()
    renderCourseForm()

    const titleInput = screen.getByLabelText(/course title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const capacityInput = screen.getByLabelText(/maximum capacity/i)

    await user.type(titleInput, 'Test Course')
    await user.type(descriptionInput, 'Test description')
    await user.clear(capacityInput)
    await user.type(capacityInput, '30')

    expect((titleInput as HTMLInputElement).value).toBe('Test Course')
    expect((descriptionInput as HTMLTextAreaElement).value).toBe('Test description')
    expect((capacityInput as HTMLInputElement).value).toBe('30')
  })

  it('shows character count for description', async () => {
    const user = userEvent.setup()
    renderCourseForm()

    const descriptionInput = screen.getByLabelText(/description/i)
    await user.type(descriptionInput, 'Test description')

    expect(screen.getByText('16/1000 characters')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    renderCourseForm()

    const submitButton = screen.getByRole('button', { name: /create course/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Course title is required')).toBeInTheDocument()
    })

    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('validates field lengths', async () => {
    const user = userEvent.setup()
    renderCourseForm()

    const titleInput = screen.getByLabelText(/course title/i)
    const capacityInput = screen.getByLabelText(/maximum capacity/i)

    // Test title too long
    await user.type(titleInput, 'a'.repeat(256))
    
    // Test invalid capacity
    await user.clear(capacityInput)
    await user.type(capacityInput, '0')

    const submitButton = screen.getByRole('button', { name: /create course/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Course title must be less than 255 characters')).toBeInTheDocument()
      expect(screen.getByText('Capacity must be at least 1')).toBeInTheDocument()
    })
  })

  it('submits form successfully', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: mockCourse
      })
    })

    renderCourseForm()

    const titleInput = screen.getByLabelText(/course title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const capacityInput = screen.getByLabelText(/maximum capacity/i)

    await user.type(titleInput, 'IELTS Preparation Course')
    await user.type(descriptionInput, 'Comprehensive IELTS preparation')
    await user.clear(capacityInput)
    await user.type(capacityInput, '25')

    const submitButton = screen.getByRole('button', { name: /create course/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        },
        body: JSON.stringify({
          title: 'IELTS Preparation Course',
          description: 'Comprehensive IELTS preparation',
          capacity: 25,
        }),
      })
    })

    await waitFor(() => {
      expect(mockOnCourseCreated).toHaveBeenCalledWith(mockCourse)
    })
  })

  it('handles API errors', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({
        success: false,
        error: 'Validation failed'
      })
    })

    renderCourseForm()

    const titleInput = screen.getByLabelText(/course title/i)
    await user.type(titleInput, 'Test Course')

    const submitButton = screen.getByRole('button', { name: /create course/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Validation failed')).toBeInTheDocument()
    })

    expect(mockOnCourseCreated).not.toHaveBeenCalled()
  })

  it('handles network errors', async () => {
    const user = userEvent.setup()
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    renderCourseForm()

    const titleInput = screen.getByLabelText(/course title/i)
    await user.type(titleInput, 'Test Course')

    const submitButton = screen.getByRole('button', { name: /create course/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })

    expect(mockOnCourseCreated).not.toHaveBeenCalled()
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    
    mockFetch.mockReturnValueOnce(promise)

    renderCourseForm()

    const titleInput = screen.getByLabelText(/course title/i)
    await user.type(titleInput, 'Test Course')

    const submitButton = screen.getByRole('button', { name: /create course/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Creating...')).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })

    // Resolve the promise to clean up
    resolvePromise!({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockCourse })
    })
  })

  it('disables form fields during submission', async () => {
    const user = userEvent.setup()
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    
    mockFetch.mockReturnValueOnce(promise)

    renderCourseForm()

    const titleInput = screen.getByLabelText(/course title/i)
    const descriptionInput = screen.getByLabelText(/description/i)
    const capacityInput = screen.getByLabelText(/maximum capacity/i)
    
    await user.type(titleInput, 'Test Course')

    const submitButton = screen.getByRole('button', { name: /create course/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(titleInput).toBeDisabled()
      expect(descriptionInput).toBeDisabled()
      expect(capacityInput).toBeDisabled()
    })

    // Resolve the promise to clean up
    resolvePromise!({
      ok: true,
      json: () => Promise.resolve({ success: true, data: mockCourse })
    })
  })

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    renderCourseForm()

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    renderCourseForm()

    const backdrop = screen.getByRole('button', { hidden: true }) // Backdrop div
    await user.click(backdrop)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('trims whitespace from title', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: mockCourse
      })
    })

    renderCourseForm()

    const titleInput = screen.getByLabelText(/course title/i)
    await user.type(titleInput, '  Test Course  ')

    const submitButton = screen.getByRole('button', { name: /create course/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        },
        body: JSON.stringify({
          title: 'Test Course',
          capacity: 50,
        }),
      })
    })
  })

  it('handles empty description correctly', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        data: mockCourse
      })
    })

    renderCourseForm()

    const titleInput = screen.getByLabelText(/course title/i)
    await user.type(titleInput, 'Test Course')

    const submitButton = screen.getByRole('button', { name: /create course/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        },
        body: JSON.stringify({
          title: 'Test Course',
          capacity: 50,
        }),
      })
    })
  })
})