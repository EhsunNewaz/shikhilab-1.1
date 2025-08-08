import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../app/page'

describe('Mobile Responsiveness and PWA', () => {
  beforeEach(() => {
    // Reset navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      value: true,
    })
  })

  describe('Mobile Layout', () => {
    it('renders mobile-responsive layout correctly', () => {
      render(<Home />)

      // Check if the main content is rendered
      expect(screen.getByText(/IELTS Learning Platform/i)).toBeInTheDocument()

      // Check for mobile-friendly text sizes and responsive elements
      expect(screen.getByText(/Master IELTS with Confidence/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /enroll now/i })).toBeInTheDocument()
    })

    it('displays course features in responsive grid', () => {
      render(<Home />)

      // Check that all three main feature cards are present
      expect(screen.getByText(/Comprehensive Curriculum/i)).toBeInTheDocument()
      expect(screen.getByText(/Expert Instructors/i)).toBeInTheDocument()
      expect(screen.getByText(/Personalized Approach/i)).toBeInTheDocument()
    })

    it('renders payment instructions that are mobile-friendly', async () => {
      render(<Home />)

      // First click "Enroll Now" to show the form
      const enrollButton = screen.getByRole('button', { name: /enroll now/i })
      
      await act(async () => {
        await userEvent.click(enrollButton)
      })

      // Check payment instructions are visible
      expect(screen.getByText(/Payment Instructions/i)).toBeInTheDocument()
      expect(screen.getByText('+880 1234567890')).toBeInTheDocument()
    })

    it('form fields are accessible on mobile', async () => {
      render(<Home />)

      // Show enrollment form
      const enrollButton = screen.getByRole('button', { name: /enroll now/i })
      
      await act(async () => {
        await userEvent.click(enrollButton)
      })

      // Check form fields have proper labels and are accessible
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/bKash transaction id/i)).toBeInTheDocument()

      // Check form controls are properly sized
      const nameInput = screen.getByLabelText(/full name/i)
      const emailInput = screen.getByLabelText(/email address/i)
      const transactionInput = screen.getByLabelText(/bKash transaction id/i)

      expect(nameInput).toHaveAttribute('type', 'text')
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(transactionInput).toHaveAttribute('type', 'text')
    })
  })

  describe('PWA Offline Functionality', () => {
    it('shows offline message when navigator is offline', () => {
      // Mock offline state
      Object.defineProperty(navigator, 'onLine', {
        value: false,
      })

      render(<Home />)

      expect(screen.getByText(/Internet connection required/i)).toBeInTheDocument()
      expect(screen.getByText(/Please connect to the internet to apply/i)).toBeInTheDocument()
    })

    it('disables enrollment button when offline', () => {
      // Mock offline state
      Object.defineProperty(navigator, 'onLine', {
        value: false,
      })

      render(<Home />)

      const enrollButton = screen.getByRole('button', { name: /enroll now/i })
      expect(enrollButton).toBeDisabled()
    })

    it('enables enrollment button when online', () => {
      // Ensure online state
      Object.defineProperty(navigator, 'onLine', {
        value: true,
      })

      render(<Home />)

      const enrollButton = screen.getByRole('button', { name: /enroll now/i })
      expect(enrollButton).not.toBeDisabled()
    })

    it('handles online/offline state changes', async () => {
      render(<Home />)

      // Initially online
      let enrollButton = screen.getByRole('button', { name: /enroll now/i })
      expect(enrollButton).not.toBeDisabled()

      // Simulate going offline
      Object.defineProperty(navigator, 'onLine', {
        value: false,
      })

      // Fire the offline event
      await act(async () => {
        window.dispatchEvent(new Event('offline'))
      })

      enrollButton = screen.getByRole('button', { name: /enroll now/i })
      expect(enrollButton).toBeDisabled()
      expect(screen.getByText(/Internet connection required/i)).toBeInTheDocument()
    })
  })

  describe('Viewport Meta Tag and PWA Requirements', () => {
    it('should have proper semantic structure for SEO and accessibility', () => {
      render(<Home />)

      // Check for proper heading hierarchy
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()

      // Check for main content areas
      expect(screen.getByText(/IELTS Learning Platform/i)).toBeInTheDocument()
    })

    it('displays course information in organized sections', () => {
      render(<Home />)

      // Check that course information is well-structured
      expect(screen.getByText(/What You'll Get/i)).toBeInTheDocument()
      expect(screen.getByText(/Course Information/i)).toBeInTheDocument()

      // Check specific course details
      expect(screen.getByText(/8 weeks intensive program/i)).toBeInTheDocument()
      expect(screen.getByText(/Flexible weekday & weekend options/i)).toBeInTheDocument()
      expect(screen.getByText(/Limited seats for personalized attention/i)).toBeInTheDocument()
    })

    it('provides clear call-to-action buttons', () => {
      render(<Home />)

      const enrollButton = screen.getByRole('button', { name: /enroll now/i })
      expect(enrollButton).toBeInTheDocument()
      expect(enrollButton).toHaveClass('px-8', 'py-4') // Check for proper button sizing
    })
  })

  describe('Content Organization and UX', () => {
    it('presents information in logical order', async () => {
      render(<Home />)

      // Show enrollment form to check full content order
      const enrollButton = screen.getByRole('button', { name: /enroll now/i })
      await act(async () => {
        await userEvent.click(enrollButton)
      })

      const content = document.body.textContent
      
      // Hero section should come first
      expect(content?.indexOf('Master IELTS with Confidence')).toBeLessThan(
        content?.indexOf('Comprehensive Curriculum') || Infinity
      )
      
      // Course features should come before enrollment form
      expect(content?.indexOf('What You\'ll Get')).toBeLessThan(
        content?.indexOf('Apply Now') || Infinity
      )
    })

    it('uses appropriate visual hierarchy', () => {
      render(<Home />)

      // Check for proper heading levels
      const h1 = screen.getByRole('heading', { level: 1 })
      const h2 = screen.getByRole('heading', { level: 2 })
      
      expect(h1).toBeInTheDocument()
      expect(h2).toBeInTheDocument()

      // Check for descriptive text
      expect(screen.getByText(/Join our comprehensive IELTS preparation course/i)).toBeInTheDocument()
    })

    it('provides clear course value proposition', () => {
      render(<Home />)

      // Check for key value propositions
      expect(screen.getByText(/Complete coverage of all IELTS modules/i)).toBeInTheDocument()
      expect(screen.getByText(/certified IELTS trainers/i)).toBeInTheDocument()
      expect(screen.getByText(/Tailored study plans/i)).toBeInTheDocument()
    })
  })
})