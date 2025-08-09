'use client'

import { useState } from 'react'

interface AdminEnrollmentView {
  id: string
  full_name: string
  email: string
  transaction_id: string
  created_at: string
  course_title: string
}

interface EnrollmentTableProps {
  enrollments: AdminEnrollmentView[]
  onEnrollmentAction: (enrollmentId: string, action: 'approve' | 'reject') => void
}

interface ActionState {
  [enrollmentId: string]: {
    loading: boolean
    action?: 'approve' | 'reject'
  }
}

export function EnrollmentTable({ enrollments, onEnrollmentAction }: EnrollmentTableProps) {
  const [actionStates, setActionStates] = useState<ActionState>({})
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    enrollmentId: string
    action: 'approve' | 'reject'
    enrollmentName: string
  }>({
    isOpen: false,
    enrollmentId: '',
    action: 'approve',
    enrollmentName: ''
  })

  const handleAction = async (enrollmentId: string, action: 'approve' | 'reject') => {
    try {
      // Set loading state
      setActionStates(prev => ({
        ...prev,
        [enrollmentId]: { loading: true, action }
      }))

      // TODO: Replace with actual API call
      const response = await fetch(`/api/admin/enrollments/${enrollmentId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })

      if (!response || !response.ok) {
        throw new Error(`Failed to ${action} enrollment`)
      }

      // Call the parent callback for optimistic UI updates
      onEnrollmentAction(enrollmentId, action)
      
      // Show success message
      // TODO: Add toast notification system
      console.log(`Enrollment ${action}d successfully`)
      
    } catch (error) {
      console.error(`Error ${action}ing enrollment:`, error)
      setErrorMessage(`Failed to ${action} enrollment. Please try again.`)
      // Auto-dismiss error after 5 seconds
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      // Clear loading state
      setActionStates(prev => {
        const newState = { ...prev }
        delete newState[enrollmentId]
        return newState
      })
      setConfirmDialog({ isOpen: false, enrollmentId: '', action: 'approve', enrollmentName: '' })
    }
  }

  const openConfirmDialog = (enrollment: AdminEnrollmentView, action: 'approve' | 'reject') => {
    setConfirmDialog({
      isOpen: true,
      enrollmentId: enrollment.id,
      action,
      enrollmentName: enrollment.full_name
    })
  }

  const confirmAction = () => {
    handleAction(confirmDialog.enrollmentId, confirmDialog.action)
  }

  if (enrollments.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No pending enrollments</h3>
        <p className="mt-1 text-sm text-gray-500">All enrollments have been processed.</p>
      </div>
    )
  }

  return (
    <>
      {/* Error Message Toast */}
      {errorMessage && (
        <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg max-w-sm">
          <div className="flex justify-between items-start">
            <p className="text-sm">{errorMessage}</p>
            <button 
              onClick={() => setErrorMessage('')}
              className="ml-2 text-red-700 hover:text-red-900 font-bold text-lg leading-none"
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {enrollments.map((enrollment) => {
              const isLoading = actionStates[enrollment.id]?.loading || false
              const loadingAction = actionStates[enrollment.id]?.action
              
              return (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {enrollment.full_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{enrollment.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {enrollment.transaction_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(enrollment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{enrollment.course_title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => openConfirmDialog(enrollment, 'approve')}
                      disabled={isLoading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading && loadingAction === 'approve' ? (
                        <>
                          <div className="animate-spin -ml-1 mr-1 h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                          Approving...
                        </>
                      ) : (
                        <>
                          <svg className="-ml-1 mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openConfirmDialog(enrollment, 'reject')}
                      disabled={isLoading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading && loadingAction === 'reject' ? (
                        <>
                          <div className="animate-spin -ml-1 mr-1 h-3 w-3 border-2 border-white border-t-transparent rounded-full"></div>
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <svg className="-ml-1 mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Reject
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                confirmDialog.action === 'approve' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {confirmDialog.action === 'approve' ? (
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                {confirmDialog.action === 'approve' ? 'Approve' : 'Reject'} Enrollment
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to {confirmDialog.action} the enrollment for{' '}
                  <span className="font-medium">{confirmDialog.enrollmentName}</span>?
                  {confirmDialog.action === 'approve' && (
                    <span className="block mt-2 text-xs text-gray-400">
                      This will create a student account and send a password setup email.
                    </span>
                  )}
                </p>
              </div>
              <div className="items-center px-4 py-3 space-x-4">
                <button
                  onClick={() => setConfirmDialog({ isOpen: false, enrollmentId: '', action: 'approve', enrollmentName: '' })}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`px-4 py-2 text-white text-base font-medium rounded-md w-24 focus:outline-none focus:ring-2 ${
                    confirmDialog.action === 'approve'
                      ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300'
                      : 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
                  }`}
                >
                  {confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}