'use client'

import { useState, useEffect } from 'react'
import { Course, Class, User, ApiResponse } from 'shared'
import { Button } from 'ui'
import { CourseForm } from './components/CourseForm'
import { ClassManagement } from './components/ClassManagement'
import { EnrollmentAssignment } from './components/EnrollmentAssignment'

interface CourseWithStats extends Course {
  enrolled_count: number
}

interface CoursePageState {
  courses: CourseWithStats[]
  students: Omit<User, 'password_hash'>[]
  loading: boolean
  error: string | null
  selectedCourse: CourseWithStats | null
  showCourseForm: boolean
  showClassManagement: boolean
  showEnrollmentAssignment: boolean
}

export default function CoursePage() {
  const [state, setState] = useState<CoursePageState>({
    courses: [],
    students: [],
    loading: true,
    error: null,
    selectedCourse: null,
    showCourseForm: false,
    showClassManagement: false,
    showEnrollmentAssignment: false,
  })

  useEffect(() => {
    const loadData = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      // Use allSettled to handle errors individually
      const [coursesResult, studentsResult] = await Promise.allSettled([
        fetchCourses(),
        fetchStudents()
      ])
      
      // Set loading to false after all operations complete
      setState(prev => ({ 
        ...prev, 
        loading: false 
      }))
    }
    
    loadData()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }

      const data: ApiResponse<CourseWithStats[]> = await response.json()
      
      if (data.success && data.data) {
        // Fetch enrollment counts for each course to get real-time capacity data
        const coursesWithStats = await Promise.all(
          data.data.map(async (course) => {
            try {
              const statsResponse = await fetch(`/api/courses/${course.id}`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
              })
              
              if (statsResponse.ok) {
                const statsData: ApiResponse<CourseWithStats> = await statsResponse.json()
                if (statsData.success && statsData.data) {
                  return statsData.data
                }
              }
              return { ...course, enrolled_count: 0 }
            } catch {
              return { ...course, enrolled_count: 0 }
            }
          })
        )
        
        setState(prev => ({ ...prev, courses: coursesWithStats }))
      } else {
        throw new Error(data.error || 'Failed to fetch courses')
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to fetch courses'
      }))
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }

      const data: ApiResponse<Omit<User, 'password_hash'>[]> = await response.json()
      
      if (data.success && data.data) {
        setState(prev => ({ 
          ...prev, 
          students: data.data || []
        }))
      } else {
        throw new Error(data.error || 'Failed to fetch students')
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to fetch students'
      }))
    }
  }

  const handleCourseCreated = (course: Course) => {
    const courseWithStats: CourseWithStats = { ...course, enrolled_count: 0 }
    setState(prev => ({
      ...prev,
      courses: [courseWithStats, ...prev.courses],
      showCourseForm: false,
    }))
  }

  const handleCourseSelect = (course: CourseWithStats) => {
    setState(prev => ({
      ...prev,
      selectedCourse: course,
      showClassManagement: false,
      showEnrollmentAssignment: false,
    }))
  }

  const handleCloseModals = () => {
    setState(prev => ({
      ...prev,
      showCourseForm: false,
      showClassManagement: false,
      showEnrollmentAssignment: false,
      selectedCourse: null,
    }))
  }

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course management...</p>
        </div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h2 className="font-bold">Error</h2>
            <p>{state.error}</p>
          </div>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                  Course Management
                </h1>
                <Button
                  onClick={() => setState(prev => ({ ...prev, showCourseForm: true }))}
                  variant="primary"
                >
                  Create Course
                </Button>
              </div>

              {/* Course List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" role="list" aria-label="Course list">
                {state.courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onClick={() => handleCourseSelect(course)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleCourseSelect(course)
                      }
                    }}
                    tabIndex={0}
                    role="listitem button"
                    aria-label={`Select course: ${course.title}. Enrolled: ${course.enrolled_count} of ${course.capacity} students`}
                  >
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {course.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span aria-label={`${course.enrolled_count} enrolled out of ${course.capacity} capacity`}>
                          Enrolled: {course.enrolled_count}/{course.capacity}
                        </span>
                        <span aria-label={`${course.capacity - course.enrolled_count} slots remaining`}>
                          {course.capacity - course.enrolled_count} slots left
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Course Actions */}
              {state.selectedCourse && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Selected Course: {state.selectedCourse.title}
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={() => setState(prev => ({ ...prev, showClassManagement: true }))}
                      variant="outline"
                    >
                      Manage Classes
                    </Button>
                    <Button
                      onClick={() => setState(prev => ({ ...prev, showEnrollmentAssignment: true }))}
                      variant="outline"
                    >
                      Assign Students
                    </Button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {state.courses.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first course.</p>
                  <Button
                    onClick={() => setState(prev => ({ ...prev, showCourseForm: true }))}
                    variant="primary"
                  >
                    Create Course
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {state.showCourseForm && (
        <CourseForm
          onClose={handleCloseModals}
          onCourseCreated={handleCourseCreated}
        />
      )}

      {state.showClassManagement && state.selectedCourse && (
        <ClassManagement
          course={state.selectedCourse}
          onClose={handleCloseModals}
        />
      )}

      {state.showEnrollmentAssignment && state.selectedCourse && (
        <EnrollmentAssignment
          course={state.selectedCourse}
          students={state.students}
          onClose={handleCloseModals}
        />
      )}
    </div>
  )
}

