'use client'

import { useState, useEffect, useCallback } from 'react'
import { EnrollmentTable } from './EnrollmentTable'

interface EnrollmentCapacity {
  total_capacity: number
  current_approved: number
  current_pending: number
  available_slots: number
}

interface AdminEnrollmentView {
  id: string
  full_name: string
  email: string
  transaction_id: string
  created_at: string
  course_title: string
}

interface AdminPanelState {
  enrollments: AdminEnrollmentView[]
  capacity: EnrollmentCapacity | null
  loading: boolean
  error: string | null
  refreshing: boolean
}

export default function AdminPanel() {
  const [state, setState] = useState<AdminPanelState>({
    enrollments: [],
    capacity: null,
    loading: true,
    error: null,
    refreshing: false
  })

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      setState(prev => ({ 
        ...prev, 
        loading: !isRefresh,
        refreshing: isRefresh,
        error: null 
      }))

      // TODO: Replace with actual API calls
      // Simulated API calls for now
      const [enrollmentsResponse, capacityResponse] = await Promise.all([
        fetch('/api/admin/enrollments'),
        fetch('/api/admin/dashboard')
      ])

      if (!enrollmentsResponse.ok || !capacityResponse.ok) {
        throw new Error('Failed to fetch admin data')
      }

      const enrollmentsData = await enrollmentsResponse.json()
      const capacityData = await capacityResponse.json()

      setState(prev => ({
        ...prev,
        enrollments: enrollmentsData.data || [],
        capacity: capacityData.data || null,
        loading: false,
        refreshing: false,
        error: null
      }))
    } catch (error) {
      console.error('Error fetching admin data:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        refreshing: false,
        error: error instanceof Error ? error.message : 'Failed to load admin data'
      }))
    }
  }, [])

  const handleRefresh = useCallback(() => {
    fetchData(true)
  }, [fetchData])

  const handleEnrollmentAction = useCallback((enrollmentId: string, action: 'approve' | 'reject') => {
    // Remove the processed enrollment from the list optimistically
    setState(prev => ({
      ...prev,
      enrollments: prev.enrollments.filter(e => e.id !== enrollmentId)
    }))
    
    // Update capacity counters optimistically
    if (action === 'approve') {
      setState(prev => ({
        ...prev,
        capacity: prev.capacity ? {
          ...prev.capacity,
          current_approved: prev.capacity.current_approved + 1,
          current_pending: prev.capacity.current_pending - 1,
          available_slots: prev.capacity.available_slots - 1
        } : null
      }))
    } else {
      setState(prev => ({
        ...prev,
        capacity: prev.capacity ? {
          ...prev.capacity,
          current_pending: prev.capacity.current_pending - 1,
          available_slots: prev.capacity.available_slots + 1
        } : null
      }))
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (state.loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading admin panel...</span>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading admin data
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{state.error}</p>
            </div>
            <div className="mt-3">
              <button
                onClick={() => fetchData()}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Capacity Overview */}
      {state.capacity && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg border">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">TC</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Capacity
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {state.capacity.total_capacity}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">AP</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Approved
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {state.capacity.current_approved}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">PD</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {state.capacity.current_pending}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                    state.capacity.available_slots > 0 ? 'bg-indigo-500' : 'bg-red-500'
                  }`}>
                    <span className="text-white font-semibold text-sm">AV</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Available
                    </dt>
                    <dd className={`text-lg font-medium ${
                      state.capacity.available_slots > 0 ? 'text-gray-900' : 'text-red-600'
                    }`}>
                      {state.capacity.available_slots}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Pending Enrollments
            </h2>
            <button
              onClick={handleRefresh}
              disabled={state.refreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.refreshing ? (
                <>
                  <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-gray-300 border-t-gray-700 rounded-full"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
          
          <EnrollmentTable 
            enrollments={state.enrollments}
            onEnrollmentAction={handleEnrollmentAction}
          />
        </div>
      </div>
    </div>
  )
}