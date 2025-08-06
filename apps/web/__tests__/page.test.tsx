import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import HomePage from '../app/page'

expect.extend(toHaveNoViolations)

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<HomePage />)
    
    const heading = screen.getByRole('heading', {
      name: /ielts learning platform/i,
    })
    
    expect(heading).toBeInTheDocument()
  })

  it('renders the welcome message', () => {
    render(<HomePage />)
    
    const welcomeMessage = screen.getByText(
      /welcome to your comprehensive ielts preparation platform/i
    )
    
    expect(welcomeMessage).toBeInTheDocument()
  })

  it('has proper semantic structure', () => {
    render(<HomePage />)
    
    const container = screen.getByText(/ielts learning platform/i).closest('div')
    expect(container).toHaveClass('container')
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(<HomePage />)
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})