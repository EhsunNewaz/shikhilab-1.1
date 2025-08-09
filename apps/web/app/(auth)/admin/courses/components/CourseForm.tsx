'use client'

import { useState } from 'react'
import { Course, ApiResponse } from 'shared'
import { Button } from 'ui'

interface CourseFormProps {
  onClose: () => void
  onCourseCreated: (course: Course) => void
}

interface CourseFormData {
  title: string
  description: string
  capacity: number
}

interface CourseFormState {
  formData: CourseFormData
  loading: boolean
  error: string | null
  validationErrors: { [key: string]: string }
}

export function CourseForm({ onClose, onCourseCreated }: CourseFormProps) {
  const [state, setState] = useState<CourseFormState>({
    formData: {
      title: '',
      description: '',
      capacity: 50,
    },
    loading: false,
    error: null,
    validationErrors: {},
  })

  const handleInputChange = (field: keyof CourseFormData, value: string | number) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
      validationErrors: { ...prev.validationErrors, [field]: '' },
      error: null,
    }))
  }

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {}

    if (!state.formData.title.trim()) {
      errors.title = 'Course title is required'
    } else if (state.formData.title.length > 255) {
      errors.title = 'Course title must be less than 255 characters'
    }

    if (state.formData.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters'
    }

    if (state.formData.capacity < 1) {
      errors.capacity = 'Capacity must be at least 1'
    } else if (state.formData.capacity > 1000) {
      errors.capacity = 'Capacity must be less than 1000'
    }

    setState(prev => ({ ...prev, validationErrors: errors }))
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          title: state.formData.title.trim(),
          description: state.formData.description.trim() || undefined,
          capacity: state.formData.capacity,
        }),
      })

      const data: ApiResponse<Course> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      if (data.success && data.data) {
        onCourseCreated(data.data)
      } else {
        throw new Error(data.error || 'Failed to create course')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to create course',
        loading: false,
      }))
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Create New Course
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Add a new course to the curriculum. Students can be enrolled once the course is created.
            </p>
          </div>

          {state.error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">{state.error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" role="form" aria-labelledby="form-title">
            {/* Course Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={state.formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                  state.validationErrors.title
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="e.g., IELTS Preparation Course"
                maxLength={255}
                disabled={state.loading}
                required
                aria-invalid={!!state.validationErrors.title}
                aria-describedby={state.validationErrors.title ? 'title-error' : undefined}
              />
              {state.validationErrors.title && (
                <p id="title-error" className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                  {state.validationErrors.title}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={state.formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                  state.validationErrors.description
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Optional description of the course..."
                maxLength={1000}
                disabled={state.loading}
                aria-invalid={!!state.validationErrors.description}
                aria-describedby={state.validationErrors.description ? 'description-error' : 'description-help'}
              />
              {state.validationErrors.description && (
                <p id="description-error" className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                  {state.validationErrors.description}
                </p>
              )}
              <p id="description-help" className="mt-1 text-sm text-gray-500">
                {state.formData.description.length}/1000 characters
              </p>
            </div>

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                Maximum Capacity *
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={state.formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                min="1"
                max="1000"
                className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                  state.validationErrors.capacity
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                disabled={state.loading}
                required
                aria-invalid={!!state.validationErrors.capacity}
                aria-describedby={state.validationErrors.capacity ? 'capacity-error' : 'capacity-help'}
              />
              {state.validationErrors.capacity && (
                <p id="capacity-error" className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                  {state.validationErrors.capacity}
                </p>
              )}
              <p id="capacity-help" className="mt-1 text-sm text-gray-500">
                Maximum number of students that can be enrolled in this course
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={state.loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={state.loading}
              >
                {state.loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Course'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}