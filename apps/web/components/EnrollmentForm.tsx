'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { EnrollmentSchema } from '../../../packages/shared/schemas'

type EnrollmentFormData = z.infer<typeof EnrollmentSchema>

interface CapacityInfo {
  capacity: number
  current: number
  available: number
}

export function EnrollmentForm() {
  const [formData, setFormData] = useState<Partial<EnrollmentFormData>>({
    fullName: '',
    email: '',
    transactionId: '',
    courseId: '00000000-0000-0000-0000-000000000001' // Default course ID
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [isBatchFull, setIsBatchFull] = useState(false)
  const [capacityInfo, setCapacityInfo] = useState<CapacityInfo | null>(null)
  const [isLoadingCapacity, setIsLoadingCapacity] = useState(true)

  // Fetch capacity information when component loads
  useEffect(() => {
    const fetchCapacityInfo = async () => {
      try {
        const response = await fetch(`/api/enrollments/capacity/${formData.courseId}`)
        const result = await response.json()
        
        if (response.ok && result.success) {
          setCapacityInfo(result.data)
          setIsBatchFull(result.data.available <= 0)
        } else {
          console.error('Failed to fetch capacity info:', result.error)
        }
      } catch (error) {
        console.error('Error fetching capacity info:', error)
      } finally {
        setIsLoadingCapacity(false)
      }
    }

    if (formData.courseId) {
      fetchCapacityInfo()
    }
  }, [formData.courseId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    try {
      EnrollmentSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
        setSubmitMessage('Application submitted successfully! We will review your application and contact you soon.')
        setFormData({
          fullName: '',
          email: '',
          transactionId: '',
          courseId: '00000000-0000-0000-0000-000000000001'
        })
      } else if (response.status === 409) {
        setIsBatchFull(true)
        setSubmitMessage('Sorry, this batch is now full. Please try again for the next batch.')
      } else {
        setSubmitMessage(result.message || result.error || 'An error occurred. Please try again.')
      }
    } catch (error) {
      setSubmitMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-600 mb-4">Application Submitted!</h3>
        <p className="text-gray-600 mb-6">{submitMessage}</p>
        <button
          onClick={() => {
            setIsSubmitted(false)
            setSubmitMessage('')
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Submit Another Application
        </button>
      </div>
    )
  }

  if (isBatchFull) {
    return (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">😞</div>
        <h3 className="text-2xl font-bold text-red-600 mb-4">Batch is Full</h3>
        <p className="text-gray-600 mb-6">{submitMessage}</p>
        <p className="text-sm text-gray-500">
          Follow our social media or check back later for updates on new batches.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Capacity Information */}
      {!isLoadingCapacity && capacityInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
            <span className="text-xl mr-2">📊</span>
            Batch Availability
          </h4>
          <div className="flex items-center space-x-4 text-blue-700">
            <div className="flex-1">
              <div className="bg-blue-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(capacityInfo.current / capacityInfo.capacity) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>{capacityInfo.current} enrolled</span>
                <span>{capacityInfo.available} spots remaining</span>
                <span>{capacityInfo.capacity} total</span>
              </div>
            </div>
          </div>
          {capacityInfo.available <= 5 && capacityInfo.available > 0 && (
            <p className="text-orange-600 font-medium mt-2 text-sm">
              ⚠️ Only {capacityInfo.available} spots remaining - Apply now!
            </p>
          )}
        </div>
      )}

      {/* bKash Payment Instructions */}
      <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 mb-8">
        <h4 className="text-xl font-semibold text-pink-800 mb-4 flex items-center">
          <span className="text-2xl mr-2">💳</span>
          Payment Instructions
        </h4>
        <div className="space-y-3 text-pink-700">
          <p className="font-medium">Send Money via bKash to:</p>
          <div className="bg-white p-3 rounded border border-pink-200">
            <p className="text-lg font-bold text-pink-900">+880 1234567890</p>
          </div>
          <div className="text-sm space-y-1">
            <p>• Amount: <strong>৳5,000</strong></p>
            <p>• Reference: Write your full name</p>
            <p>• After payment, enter the Transaction ID below</p>
            <p>• Keep the SMS confirmation for your records</p>
          </div>
        </div>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter your full name as per ID"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
            bKash Transaction ID *
          </label>
          <input
            type="text"
            id="transactionId"
            name="transactionId"
            value={formData.transactionId || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.transactionId ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Enter the transaction ID from bKash SMS"
          />
          {errors.transactionId && (
            <p className="mt-1 text-sm text-red-600">{errors.transactionId}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Find this in your bKash SMS confirmation message
          </p>
        </div>

        {submitMessage && !isSubmitted && (
          <div className={`p-4 rounded-lg ${
            submitMessage.includes('error') || submitMessage.includes('Network') 
              ? 'bg-red-100 border border-red-400 text-red-700' 
              : 'bg-green-100 border border-green-400 text-green-700'
          }`}>
            {submitMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isBatchFull || isLoadingCapacity}
          className={`w-full py-4 px-6 text-lg font-semibold rounded-lg transition-all duration-200 ${
            isSubmitting || isBatchFull || isLoadingCapacity
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoadingCapacity ? (
            'Loading...'
          ) : isBatchFull ? (
            'Batch is Full'
          ) : isSubmitting ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⏳</span>
              Submitting...
            </span>
          ) : (
            'Submit Application'
          )}
        </button>

        <p className="text-sm text-gray-500 text-center">
          By submitting this form, you agree to our terms and conditions.
          We will review your application within 24-48 hours.
        </p>
      </form>
    </div>
  )
}