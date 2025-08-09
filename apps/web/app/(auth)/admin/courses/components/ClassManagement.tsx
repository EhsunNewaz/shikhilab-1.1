'use client'

import { useState, useEffect, useCallback } from 'react'
import { Course, Class, ApiResponse } from 'shared'
import { Button } from 'ui'

interface ClassManagementProps {
  course: Course
  onClose: () => void
}

interface ClassFormData {
  title: string
  order_number: number
  release_date: string
}

interface ClassManagementState {
  classes: Class[]
  loading: boolean
  error: string | null
  showForm: boolean
  formData: ClassFormData
  formLoading: boolean
  formErrors: { [key: string]: string }
  editingClass: Class | null
}

export function ClassManagement({ course, onClose }: ClassManagementProps) {
  const [state, setState] = useState<ClassManagementState>({
    classes: [],
    loading: true,
    error: null,
    showForm: false,
    formData: {
      title: '',
      order_number: 1,
      release_date: '',
    },
    formLoading: false,
    formErrors: {},
    editingClass: null,
  })

  const fetchClasses = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))

      const response = await fetch(`/api/courses/${course.id}/classes`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch classes')
      }

      const data: ApiResponse<Class[]> = await response.json()

      if (data.success && data.data) {
        setState(prev => ({ ...prev, classes: data.data || [], loading: false }))
      } else {
        throw new Error(data.error || 'Failed to fetch classes')
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to fetch classes',
        loading: false,
      }))
    }
  }, [course.id])

  useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  const handleInputChange = (field: keyof ClassFormData, value: string | number) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
      formErrors: { ...prev.formErrors, [field]: '' },
    }))
  }

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {}

    if (!state.formData.title.trim()) {
      errors.title = 'Class title is required'
    } else if (state.formData.title.length > 255) {
      errors.title = 'Class title must be less than 255 characters'
    }

    if (state.formData.order_number < 1) {
      errors.order_number = 'Order number must be at least 1'
    }

    // Check for duplicate order numbers (excluding the class being edited)
    const existingClass = state.classes.find(cls => 
      cls.order_number === state.formData.order_number && 
      cls.id !== state.editingClass?.id
    )
    if (existingClass) {
      errors.order_number = 'A class with this order number already exists'
    }

    if (state.formData.release_date && new Date(state.formData.release_date) < new Date()) {
      errors.release_date = 'Release date cannot be in the past'
    }

    setState(prev => ({ ...prev, formErrors: errors }))
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setState(prev => ({ ...prev, formLoading: true }))

    try {
      const url = state.editingClass
        ? `/api/courses/${course.id}/classes/${state.editingClass.id}`
        : `/api/courses/${course.id}/classes`
      
      const method = state.editingClass ? 'PUT' : 'POST'

      const requestData = {
        title: state.formData.title.trim(),
        order_number: state.formData.order_number,
        release_date: state.formData.release_date || undefined,
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(requestData),
      })

      const data: ApiResponse<Class> = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      if (data.success && data.data) {
        // Refresh classes list
        await fetchClasses()
        
        // Reset form
        setState(prev => ({
          ...prev,
          showForm: false,
          formData: { title: '', order_number: 1, release_date: '' },
          editingClass: null,
          formLoading: false,
        }))
      } else {
        throw new Error(data.error || 'Failed to save class')
      }
    } catch (error) {
      console.error('Error saving class:', error)
      setState(prev => ({
        ...prev,
        formErrors: { submit: error instanceof Error ? error.message : 'Failed to save class' },
        formLoading: false,
      }))
    }
  }

  const handleEdit = (cls: Class) => {
    setState(prev => ({
      ...prev,
      editingClass: cls,
      showForm: true,
      formData: {
        title: cls.title,
        order_number: cls.order_number,
        release_date: cls.release_date || '',
      },
      formErrors: {},
    }))
  }

  const handleDelete = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/courses/${course.id}/classes/${classId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })

      if (!response.ok) {
        const data: ApiResponse = await response.json()
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      // Refresh classes list
      await fetchClasses()
    } catch (error) {
      console.error('Error deleting class:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete class',
      }))
    }
  }

  const resetForm = () => {
    setState(prev => ({
      ...prev,
      showForm: false,
      formData: { title: '', order_number: getNextOrderNumber(), release_date: '' },
      editingClass: null,
      formErrors: {},
    }))
  }

  const getNextOrderNumber = (): number => {
    if (state.classes.length === 0) return 1
    return Math.max(...state.classes.map(cls => cls.order_number)) + 1
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
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Manage Classes - {course.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Add, edit, or remove classes for this course.
                </p>
              </div>
              <Button
                onClick={() => setState(prev => ({ 
                  ...prev, 
                  showForm: true, 
                  formData: { ...prev.formData, order_number: getNextOrderNumber() }
                }))}
                variant="primary"
                size="sm"
              >
                Add Class
              </Button>
            </div>

            {state.error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p className="text-sm">{state.error}</p>
              </div>
            )}

            {state.loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading classes...</span>
              </div>
            ) : (
              <>
                {/* Classes List */}
                <div className="mb-6">
                  {state.classes.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-600">No classes yet. Add the first class to get started.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {state.classes.map((cls) => (
                        <div
                          key={cls.id}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                {cls.order_number}. {cls.title}
                              </h4>
                              {cls.release_date && (
                                <p className="text-sm text-gray-600">
                                  Release Date: {new Date(cls.release_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleEdit(cls)}
                                variant="outline"
                                size="sm"
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDelete(cls.id)}
                                variant="secondary"
                                size="sm"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Class Form */}
                {state.showForm && (
                  <div className="border-t pt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">
                      {state.editingClass ? 'Edit Class' : 'Add New Class'}
                    </h4>

                    {state.formErrors.submit && (
                      <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p className="text-sm">{state.formErrors.submit}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Class Title */}
                      <div className="md:col-span-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Class Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={state.formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                            state.formErrors.title
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                          placeholder="e.g., Introduction to IELTS Speaking"
                          maxLength={255}
                          disabled={state.formLoading}
                        />
                        {state.formErrors.title && (
                          <p className="mt-1 text-sm text-red-600">{state.formErrors.title}</p>
                        )}
                      </div>

                      {/* Order Number */}
                      <div>
                        <label htmlFor="order_number" className="block text-sm font-medium text-gray-700">
                          Order Number *
                        </label>
                        <input
                          type="number"
                          id="order_number"
                          value={state.formData.order_number}
                          onChange={(e) => handleInputChange('order_number', parseInt(e.target.value) || 1)}
                          min="1"
                          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                            state.formErrors.order_number
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                          disabled={state.formLoading}
                        />
                        {state.formErrors.order_number && (
                          <p className="mt-1 text-sm text-red-600">{state.formErrors.order_number}</p>
                        )}
                      </div>

                      {/* Release Date */}
                      <div className="md:col-span-3">
                        <label htmlFor="release_date" className="block text-sm font-medium text-gray-700">
                          Release Date (Optional)
                        </label>
                        <input
                          type="date"
                          id="release_date"
                          value={state.formData.release_date}
                          onChange={(e) => handleInputChange('release_date', e.target.value)}
                          className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                            state.formErrors.release_date
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                          disabled={state.formLoading}
                        />
                        {state.formErrors.release_date && (
                          <p className="mt-1 text-sm text-red-600">{state.formErrors.release_date}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          When this class will be available to students
                        </p>
                      </div>

                      {/* Form Actions */}
                      <div className="md:col-span-3 flex justify-end space-x-3 pt-4">
                        <Button
                          variant="outline"
                          onClick={resetForm}
                          disabled={state.formLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          disabled={state.formLoading}
                        >
                          {state.formLoading ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </div>
                          ) : (
                            state.editingClass ? 'Update Class' : 'Add Class'
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
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