import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSearchParams, useRouter } from 'next/navigation'
import PasswordSetupPage from './page'

// Mock Next.js hooks
jest.mock('next/navigation')
const mockUseSearchParams = useSearchParams as jest.Mock
const mockUseRouter = useRouter as jest.Mock

// Mock fetch
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('PasswordSetupPage', () => {
  const mockPush = jest.fn()
  const mockGet = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({ push: mockPush })
    mockUseSearchParams.mockReturnValue({ get: mockGet })
  })

  it('renders loading state when no token', () => {
    mockGet.mockReturnValue(null)

    render(<PasswordSetupPage />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders error when token is missing', async () => {
    mockGet.mockReturnValue(null)

    render(<PasswordSetupPage />)

    await waitFor(() => {
      expect(screen.getByText('Invalid or missing password setup token')).toBeInTheDocument()
    })
  })

  it('renders password setup form with valid token', async () => {
    mockGet.mockReturnValue('valid-token-123')

    render(<PasswordSetupPage />)

    await waitFor(() => {
      expect(screen.getByText('Set Your Password')).toBeInTheDocument()
      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Set Password' })).toBeInTheDocument()
    })
  })

  it('validates password requirements', async () => {
    mockGet.mockReturnValue('valid-token-123')

    render(<PasswordSetupPage />)

    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    })

    const passwordInput = screen.getByLabelText('New Password')
    const confirmInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Set Password' })

    // Test short password
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.change(confirmInput, { target: { value: '123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument()
    })
  })

  it('validates password complexity requirements', async () => {
    mockGet.mockReturnValue('valid-token-123')

    render(<PasswordSetupPage />)

    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    })

    const passwordInput = screen.getByLabelText('New Password')
    const confirmInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Set Password' })

    // Test password without complexity
    fireEvent.change(passwordInput, { target: { value: 'simplepassword' } })
    fireEvent.change(confirmInput, { target: { value: 'simplepassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Password must contain at least one lowercase letter, one uppercase letter, and one number/)).toBeInTheDocument()
    })
  })

  it('validates password confirmation match', async () => {
    mockGet.mockReturnValue('valid-token-123')

    render(<PasswordSetupPage />)

    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    })

    const passwordInput = screen.getByLabelText('New Password')
    const confirmInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Set Password' })

    fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } })
    fireEvent.change(confirmInput, { target: { value: 'DifferentPassword123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('successfully sets password with valid input', async () => {
    mockGet.mockReturnValue('valid-token-123')
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Password set successfully' })
    } as Response)

    render(<PasswordSetupPage />)

    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    })

    const passwordInput = screen.getByLabelText('New Password')
    const confirmInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Set Password' })

    fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } })
    fireEvent.change(confirmInput, { target: { value: 'ValidPassword123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/users/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: 'valid-token-123',
          password: 'ValidPassword123'
        })
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Password Set Successfully!')).toBeInTheDocument()
    })
  })

  it('shows loading state during password submission', async () => {
    mockGet.mockReturnValue('valid-token-123')
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<PasswordSetupPage />)

    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    })

    const passwordInput = screen.getByLabelText('New Password')
    const confirmInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Set Password' })

    fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } })
    fireEvent.change(confirmInput, { target: { value: 'ValidPassword123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Setting Password...')).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })

  it('handles API errors gracefully', async () => {
    mockGet.mockReturnValue('valid-token-123')
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Token has expired' })
    } as Response)

    render(<PasswordSetupPage />)

    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    })

    const passwordInput = screen.getByLabelText('New Password')
    const confirmInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Set Password' })

    fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } })
    fireEvent.change(confirmInput, { target: { value: 'ValidPassword123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Token has expired')).toBeInTheDocument()
    })
  })

  it('redirects to login after successful password setup', async () => {
    jest.useFakeTimers()
    mockGet.mockReturnValue('valid-token-123')
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    } as Response)

    render(<PasswordSetupPage />)

    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    })

    const passwordInput = screen.getByLabelText('New Password')
    const confirmInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Set Password' })

    fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } })
    fireEvent.change(confirmInput, { target: { value: 'ValidPassword123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password Set Successfully!')).toBeInTheDocument()
    })

    // Fast forward time to trigger redirect
    jest.advanceTimersByTime(3000)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login?message=Password set successfully. Please login with your new password.')
    })

    jest.useRealTimers()
  })

  it('allows manual navigation to login', async () => {
    mockGet.mockReturnValue('valid-token-123')
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    } as Response)

    render(<PasswordSetupPage />)

    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    })

    const passwordInput = screen.getByLabelText('New Password')
    const confirmInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Set Password' })

    fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } })
    fireEvent.change(confirmInput, { target: { value: 'ValidPassword123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password Set Successfully!')).toBeInTheDocument()
    })

    const goToLoginButton = screen.getByText('Go to Login')
    fireEvent.click(goToLoginButton)

    expect(mockPush).toHaveBeenCalledWith('/auth/login')
  })

  it('clears errors when user starts typing', async () => {
    mockGet.mockReturnValue('valid-token-123')

    render(<PasswordSetupPage />)

    await waitFor(() => {
      expect(screen.getByLabelText('New Password')).toBeInTheDocument()
    })

    const passwordInput = screen.getByLabelText('New Password')
    const confirmInput = screen.getByLabelText('Confirm Password')
    const submitButton = screen.getByRole('button', { name: 'Set Password' })

    // Trigger an error first
    fireEvent.change(passwordInput, { target: { value: 'short' } })
    fireEvent.change(confirmInput, { target: { value: 'short' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument()
    })

    // Start typing again - error should clear
    fireEvent.change(passwordInput, { target: { value: 'longerpassword' } })

    await waitFor(() => {
      expect(screen.queryByText('Password must be at least 8 characters long')).not.toBeInTheDocument()
    })
  })
})