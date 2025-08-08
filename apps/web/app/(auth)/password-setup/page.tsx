'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface PasswordSetupState {
  token: string
  password: string
  confirmPassword: string
  loading: boolean
  success: boolean
  error: string | null
  passwordStrength: {
    score: number
    feedback: string[]
    isValid: boolean
  }
}

export default function PasswordSetupPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [state, setState] = useState<PasswordSetupState>({
    token: '',
    password: '',
    confirmPassword: '',
    loading: false,
    success: false,
    error: null,
    passwordStrength: {
      score: 0,
      feedback: [],
      isValid: false
    }
  })

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setState(prev => ({ ...prev, token: tokenParam }))
    } else {
      setState(prev => ({ ...prev, error: 'Invalid or missing password setup token' }))
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!state.token) {
      setState(prev => ({ ...prev, error: 'Invalid password setup token' }))
      return
    }

    if (state.password !== state.confirmPassword) {
      setState(prev => ({ ...prev, error: 'Passwords do not match' }))
      return
    }

    if (!state.passwordStrength.isValid) {
      setState(prev => ({ 
        ...prev, 
        error: 'Please ensure your password meets all security requirements' 
      }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/users/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: state.token,
          password: state.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set password')
      }

      setState(prev => ({ 
        ...prev, 
        loading: false, 
        success: true,
        password: '',
        confirmPassword: ''
      }))

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login?message=Password set successfully. Please login with your new password.')
      }, 3000)

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to set password' 
      }))
    }
  }

  const analyzePasswordStrength = (password: string) => {
    const feedback: string[] = []
    let score = 0
    
    // Length check
    if (password.length < 8) {
      feedback.push('Must be at least 8 characters')
    } else {
      score += 1
    }
    
    // Lowercase check
    if (!/[a-z]/.test(password)) {
      feedback.push('Must contain lowercase letters')
    } else {
      score += 1
    }
    
    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      feedback.push('Must contain uppercase letters')
    } else {
      score += 1
    }
    
    // Number check
    if (!/\d/.test(password)) {
      feedback.push('Must contain numbers')
    } else {
      score += 1
    }
    
    // Special character bonus
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1
    }
    
    return {
      score,
      feedback,
      isValid: score >= 4 && password.length >= 8
    }
  }

  const handleInputChange = (field: 'password' | 'confirmPassword') => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    let newState = { 
      ...state, 
      [field]: value,
      error: null
    }
    
    // Update password strength analysis
    if (field === 'password') {
      newState.passwordStrength = analyzePasswordStrength(value)
    }
    
    setState(newState)
  }

  if (!state.token && !state.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (state.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Password Set Successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your password has been set successfully. You will be redirected to the login page shortly.
            </p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/auth/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Set Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create a secure password for your Shikhi Lab IELTS account
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{state.error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={state.password}
                onChange={handleInputChange('password')}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your new password"
              />
              {/* Password strength indicator */}
              {state.password && (
                <div className="mt-2 space-y-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          level <= state.passwordStrength.score
                            ? state.passwordStrength.score <= 2
                              ? 'bg-red-400'
                              : state.passwordStrength.score <= 3
                              ? 'bg-yellow-400'
                              : 'bg-green-400'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  {state.passwordStrength.feedback.length > 0 && (
                    <div className="text-xs text-gray-600">
                      <p className="font-medium">Requirements:</p>
                      <ul className="mt-1 space-y-1">
                        {state.passwordStrength.feedback.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <svg className="h-3 w-3 mr-1 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {state.passwordStrength.isValid && (
                    <div className="text-xs text-green-600 flex items-center">
                      <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Strong password ✓
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={state.confirmPassword}
                onChange={handleInputChange('confirmPassword')}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm your new password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={state.loading || !state.token}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.loading ? (
                <>
                  <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Setting Password...
                </>
              ) : (
                'Set Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}