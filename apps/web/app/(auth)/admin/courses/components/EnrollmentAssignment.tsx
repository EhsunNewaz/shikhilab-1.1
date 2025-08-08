'use client'

import { useState, useEffect } from 'react'
import { Course, CourseEnrollment, User, ApiResponse } from 'shared'
import { Button } from 'ui'

interface EnrollmentAssignmentProps {
  course: Course
  students: Omit<User, 'password_hash'>[]
  onClose: () => void
}

interface EnrolledStudent extends Omit<User, 'password_hash'> {
  enrolled_at: string
}

interface EnrollmentState {
  enrolledStudents: EnrolledStudent[]
  availableStudents: Omit<User, 'password_hash'>[]
  loading: boolean
  error: string | null
  enrolling: string | null
  unenrolling: string | null
  searchTerm: string
  selectedStudents: Set<string>
  bulkEnrolling: boolean
}

export function EnrollmentAssignment({ course, students, onClose }: EnrollmentAssignmentProps) {
  const [state, setState] = useState<EnrollmentState>({
    enrolledStudents: [],
    availableStudents: [],
    loading: true,
    error: null,
    enrolling: null,
    unenrolling: null,
    searchTerm: '',
    selectedStudents: new Set(),
    bulkEnrolling: false,
  })

  useEffect(() => {
    fetchEnrollments()
  }, [course.id])

  const fetchEnrollments = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const response = await fetch(`/api/courses/${course.id}/enrollments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch enrollments')
      }

      const data: ApiResponse<CourseEnrollment[]> = await response.json()

      if (data.success && data.data) {
        const enrollments = data.data

        // Get enrolled student IDs
        const enrolledStudentIds = new Set(enrollments.map(e => e.user_id))

        // Separate enrolled and available students
        const enrolledStudents = students
          .filter(student => enrolledStudentIds.has(student.id))
          .map(student => {
            const enrollment = enrollments.find(e => e.user_id === student.id)
            return {
              ...student,
              enrolled_at: enrollment?.enrolled_at || ''
            }
          })

        const availableStudents = students.filter(student => !enrolledStudentIds.has(student.id))

        setState(prev => ({
          ...prev,
          enrolledStudents,
          availableStudents,
          loading: false,
        }))
      } else {
        throw new Error(data.error || 'Failed to fetch enrollments')
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch enrollments',
        loading: false,
      }))
    }
  }

  const handleEnrollStudent = async (studentId: string) => {
    setState(prev => ({ ...prev, enrolling: studentId }))

    try {
      const response = await fetch(`/api/courses/${course.id}/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ user_id: studentId }),
      })

      const data: ApiResponse<CourseEnrollment> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      if (data.success) {
        // Refresh enrollments
        await fetchEnrollments()
      } else {
        throw new Error(data.error || 'Failed to enroll student')
      }
    } catch (error) {
      console.error('Error enrolling student:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to enroll student',
      }))
    } finally {
      setState(prev => ({ ...prev, enrolling: null }))
    }
  }

  const handleUnenrollStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to unenroll this student from the course?')) {
      return
    }

    setState(prev => ({ ...prev, unenrolling: studentId }))

    try {
      const response = await fetch(`/api/courses/${course.id}/enrollments/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      if (!response.ok) {
        const data: ApiResponse = await response.json()
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      // Refresh enrollments
      await fetchEnrollments()
    } catch (error) {
      console.error('Error unenrolling student:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to unenroll student',
      }))
    } finally {
      setState(prev => ({ ...prev, unenrolling: null }))
    }
  }

  const handleBulkEnroll = async () => {
    if (state.selectedStudents.size === 0) return

    const remainingCapacity = course.capacity - state.enrolledStudents.length
    if (state.selectedStudents.size > remainingCapacity) {
      setState(prev => ({
        ...prev,
        error: `Cannot enroll ${state.selectedStudents.size} students. Only ${remainingCapacity} slots available.`
      }))
      return
    }

    setState(prev => ({ ...prev, bulkEnrolling: true }))

    try {
      const promises = Array.from(state.selectedStudents).map(studentId =>
        fetch(`/api/courses/${course.id}/enrollments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({ user_id: studentId }),
        })
      )

      const responses = await Promise.all(promises)
      const failedEnrollments = responses.filter(response => !response.ok)

      if (failedEnrollments.length > 0) {
        throw new Error(`Failed to enroll ${failedEnrollments.length} students`)
      }

      // Refresh enrollments and clear selection
      await fetchEnrollments()
      setState(prev => ({ ...prev, selectedStudents: new Set() }))
    } catch (error) {
      console.error('Error bulk enrolling students:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to enroll some students',
      }))
    } finally {
      setState(prev => ({ ...prev, bulkEnrolling: false }))
    }
  }

  const handleStudentSelection = (studentId: string, selected: boolean) => {
    setState(prev => {
      const newSelection = new Set(prev.selectedStudents)
      if (selected) {
        newSelection.add(studentId)
      } else {
        newSelection.delete(studentId)
      }
      return { ...prev, selectedStudents: newSelection }
    })
  }

  const filteredAvailableStudents = state.availableStudents.filter(student =>
    student.full_name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(state.searchTerm.toLowerCase())
  )

  const filteredEnrolledStudents = state.enrolledStudents.filter(student =>
    student.full_name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(state.searchTerm.toLowerCase())
  )

  const remainingCapacity = course.capacity - state.enrolledStudents.length

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-1">
                Student Enrollment - {course.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Enrolled: {state.enrolledStudents.length}/{course.capacity}</span>
                <span>Available slots: {remainingCapacity}</span>
              </div>
            </div>

            {state.error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="text-sm">{state.error}</p>
                <button 
                  onClick={() => setState(prev => ({ ...prev, error: null }))}
                  className="float-right text-red-700 hover:text-red-900"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={state.searchTerm}
                onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {state.loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading students...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Available Students */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">
                      Available Students ({filteredAvailableStudents.length})
                    </h4>
                    {state.selectedStudents.size > 0 && (
                      <Button
                        onClick={handleBulkEnroll}
                        variant="primary"
                        size="sm"
                        disabled={state.bulkEnrolling || remainingCapacity === 0}
                      >
                        {state.bulkEnrolling ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Enrolling...
                          </div>
                        ) : (
                          `Enroll Selected (${state.selectedStudents.size})`
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                    {filteredAvailableStudents.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        {state.searchTerm ? 'No students match your search' : 'All students are enrolled'}
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {filteredAvailableStudents.map((student) => (
                          <div key={student.id} className="p-3 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={state.selectedStudents.has(student.id)}
                                  onChange={(e) => handleStudentSelection(student.id, e.target.checked)}
                                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  disabled={remainingCapacity === 0 && !state.selectedStudents.has(student.id)}
                                />
                                <div>
                                  <p className="font-medium text-gray-900">{student.full_name}</p>
                                  <p className="text-sm text-gray-600">{student.email}</p>
                                </div>
                              </div>
                              <Button
                                onClick={() => handleEnrollStudent(student.id)}
                                variant="outline"
                                size="sm"
                                disabled={state.enrolling === student.id || remainingCapacity === 0}
                              >
                                {state.enrolling === student.id ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-2"></div>
                                    Enrolling
                                  </div>
                                ) : (
                                  'Enroll'
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Enrolled Students */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Enrolled Students ({filteredEnrolledStudents.length})
                  </h4>

                  <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
                    {filteredEnrolledStudents.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        {state.searchTerm ? 'No enrolled students match your search' : 'No students enrolled yet'}
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {filteredEnrolledStudents.map((student) => (
                          <div key={student.id} className="p-3 hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{student.full_name}</p>
                                <p className="text-sm text-gray-600">{student.email}</p>
                                <p className="text-xs text-gray-500">
                                  Enrolled: {new Date(student.enrolled_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                onClick={() => handleUnenrollStudent(student.id)}
                                variant="secondary"
                                size="sm"
                                disabled={state.unenrolling === student.id}
                              >
                                {state.unenrolling === student.id ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-2"></div>
                                    Removing
                                  </div>
                                ) : (
                                  'Remove'
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}