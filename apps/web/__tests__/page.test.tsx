import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import HomePage from '../app/page'

expect.extend(toHaveNoViolations)

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true,
})

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

beforeEach(() => {
  mockFetch.mockClear()
  // Mock capacity fetch
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({
      success: true,
      data: { capacity: 25, current: 2, available: 23 }
    })
  })
})

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading', {
      name: /ielts learning platform/i,
    })
    
    expect(heading).toBeInTheDocument()
  })

  it('renders the hero message', () => {
    render(<HomePage />)
    
    const heroMessage = screen.getByText(
      /join our comprehensive ielts preparation course/i
    )
    
    expect(heroMessage).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('IELTS Learning Platform')
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(<HomePage />)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})