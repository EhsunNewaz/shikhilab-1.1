import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CoursePage from '../../../app/(auth)/admin/courses/page'

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

// Mock child components
jest.mock('../../../app/(auth)/admin/courses/components/CourseForm', () => ({
  CourseForm: ({ onClose, onCourseCreated }: any) => (
    <div data-testid="course-form">
      <button onClick={onClose}>Close Form</button>
      <button onClick={() => onCourseCreated({ id: 'new-course', title: 'New Course', capacity: 25 })}>
        Create Course
      </button>
    </div>
  )
}))

jest.mock('../../../app/(auth)/admin/courses/components/ClassManagement', () => ({
  ClassManagement: ({ course, onClose }: any) => (
    <div data-testid="class-management">
      <span>Managing classes for {course.title}</span>
      <button onClick={onClose}>Close Classes</button>
    </div>
  )
}))

jest.mock('../../../app/(auth)/admin/courses/components/EnrollmentAssignment', () => ({
  EnrollmentAssignment: ({ course, students, onClose }: any) => (
    <div data-testid="enrollment-assignment">
      <span>Enrolling students for {course.title}</span>
      <span>Students available: {students.length}</span>
      <button onClick={onClose}>Close Enrollment</button>
    </div>
  )
}))

describe('CoursePage', () => {
  const mockCourses = [
    {
      id: 'course-1',
      title: 'IELTS Preparation Course',
      description: 'Comprehensive IELTS preparation',
      capacity: 25,
      enrolled_count: 10,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    },
    {
      id: 'course-2',
      title: 'Advanced Speaking Course',
      description: null,
      capacity: 15,
      enrolled_count: 5,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]

  const mockStudents = [
    {
      id: 'student-1',
      full_name: 'John Doe',
      email: 'john@example.com',
      role: 'student' as const,
      ai_credits: 500,
      interface_language: 'en',
      ai_feedback_language: 'bn',
      gamification_opt_out: false,
      gamification_is_anonymous: false,
      current_streak: 0,
      points_balance: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()

    // Mock successful API responses by default
    mockFetch
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: mockCourses
          })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: mockStudents
          })
        })
      )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderCoursePage = () => {
    return render(<CoursePage />)
  }

  it('renders course management page correctly', async () => {
    renderCoursePage()

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Course Management')).toBeInTheDocument()
      expect(screen.getByText('Create Course')).toBeInTheDocument()
    })

    // Check courses are displayed
    expect(screen.getByText('IELTS Preparation Course')).toBeInTheDocument()
    expect(screen.getByText('Advanced Speaking Course')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    renderCoursePage()

    expect(screen.getByText('Loading course management...')).toBeInTheDocument()
  })

  it('displays course information correctly', async () => {
    renderCoursePage()

    await waitFor(() => {
      expect(screen.getByText('IELTS Preparation Course')).toBeInTheDocument()
    })

    // Check enrollment counts
    expect(screen.getByText('Enrolled: 10/25')).toBeInTheDocument()
    expect(screen.getByText('15 slots left')).toBeInTheDocument()
    expect(screen.getByText('Enrolled: 5/15')).toBeInTheDocument()
    expect(screen.getByText('10 slots left')).toBeInTheDocument()

    // Check descriptions
    expect(screen.getByText('Comprehensive IELTS preparation')).toBeInTheDocument()
  })

  it('opens course form when create course button is clicked', async () => {
    const user = userEvent.setup()
    renderCoursePage()

    await waitFor(() => {
      expect(screen.getByText('Course Management')).toBeInTheDocument()
    })

    const createButton = screen.getByRole('button', { name: /create course/i })
    await user.click(createButton)

    expect(screen.getByTestId('course-form')).toBeInTheDocument()
  })

  it('selects course when clicked', async () => {
    const user = userEvent.setup()
    renderCoursePage()

    await waitFor(() => {
      expect(screen.getByText('IELTS Preparation Course')).toBeInTheDocument()
    })

    const courseCard = screen.getByText('IELTS Preparation Course').closest('div')
    await user.click(courseCard!)

    expect(screen.getByText('Selected Course: IELTS Preparation Course')).toBeInTheDocument()
    expect(screen.getByText('Manage Classes')).toBeInTheDocument()
    expect(screen.getByText('Assign Students')).toBeInTheDocument()
  })

  it('opens class management when manage classes button is clicked', async () => {
    const user = userEvent.setup()
    renderCoursePage()

    await waitFor(() => {
      expect(screen.getByText('IELTS Preparation Course')).toBeInTheDocument()
    })

    // Select course first
    const courseCard = screen.getByText('IELTS Preparation Course').closest('div')
    await user.click(courseCard!)

    // Click manage classes
    const manageClassesButton = screen.getByText('Manage Classes')
    await user.click(manageClassesButton)

    expect(screen.getByTestId('class-management')).toBeInTheDocument()
    expect(screen.getByText('Managing classes for IELTS Preparation Course')).toBeInTheDocument()
  })

  it('opens enrollment assignment when assign students button is clicked', async () => {
    const user = userEvent.setup()
    renderCoursePage()

    await waitFor(() => {
      expect(screen.getByText('IELTS Preparation Course')).toBeInTheDocument()
    })

    // Select course first
    const courseCard = screen.getByText('IELTS Preparation Course').closest('div')
    await user.click(courseCard!)

    // Click assign students
    const assignStudentsButton = screen.getByText('Assign Students')
    await user.click(assignStudentsButton)

    expect(screen.getByTestId('enrollment-assignment')).toBeInTheDocument()
    expect(screen.getByText('Enrolling students for IELTS Preparation Course')).toBeInTheDocument()
    expect(screen.getByText('Students available: 1')).toBeInTheDocument()
  })

  it('adds new course when course form submits', async () => {
    const user = userEvent.setup()
    renderCoursePage()

    await waitFor(() => {
      expect(screen.getByText('Course Management')).toBeInTheDocument()
    })

    // Open course form
    const createButton = screen.getByRole('button', { name: /create course/i })
    await user.click(createButton)

    // Simulate course creation
    const createCourseButton = screen.getByText('Create Course')
    await user.click(createCourseButton)

    // Form should close and new course should be added
    await waitFor(() => {
      expect(screen.queryByTestId('course-form')).not.toBeInTheDocument()
    })
  })

  it('closes modals when close buttons are clicked', async () => {
    const user = userEvent.setup()
    renderCoursePage()

    await waitFor(() => {
      expect(screen.getByText('IELTS Preparation Course')).toBeInTheDocument()
    })

    // Open course form
    const createButton = screen.getByRole('button', { name: /create course/i })
    await user.click(createButton)

    // Close form
    const closeFormButton = screen.getByText('Close Form')
    await user.click(closeFormButton)

    expect(screen.queryByTestId('course-form')).not.toBeInTheDocument()
  })

  it('displays empty state when no courses exist', async () => {
    // Mock empty courses response
    mockFetch.mockClear()
    mockFetch
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: []
          })
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            success: true,
            data: mockStudents
          })
        })
      )

    renderCoursePage()

    await waitFor(() => {
      expect(screen.getByText('No courses yet')).toBeInTheDocument()
      expect(screen.getByText('Get started by creating your first course.')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    // Mock error responses
    mockFetch.mockClear()
    mockFetch
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({
            success: false,
            error: 'Failed to fetch courses'
          })
        })
      )

    renderCoursePage()

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch courses')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
    })
  })

  it('makes correct API calls on mount', async () => {
    renderCoursePage()

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/courses', {
        headers: {
          'Authorization': 'Bearer mock-token',
        },
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/admin/users', {
        headers: {
          'Authorization': 'Bearer mock-token',
        },
      })
    })
  })

  it('handles network errors', async () => {
    // Mock network error
    mockFetch.mockClear()
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    renderCoursePage()

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('shows course capacity information correctly', async () => {
    renderCoursePage()

    await waitFor(() => {
      expect(screen.getByText('IELTS Preparation Course')).toBeInTheDocument()
    })

    // Check that courses show capacity information
    expect(screen.getByText('Enrolled: 10/25')).toBeInTheDocument()
    expect(screen.getByText('15 slots left')).toBeInTheDocument()
  })
})