import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '../components/Button'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('Button Component', () => {
  it('renders button with text', () => {
    const { getByRole } = render(<Button>Click me</Button>)
    
    const button = getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
  })

  it('applies correct variant classes', () => {
    const { getByRole } = render(<Button variant="secondary">Secondary Button</Button>)
    
    const button = getByRole('button')
    expect(button).toHaveClass('bg-gray-600')
  })

  it('handles disabled state', () => {
    const { getByRole } = render(<Button disabled>Disabled Button</Button>)
    
    const button = getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('should have no accessibility violations', async () => {
    const { container } = render(
      <Button onClick={() => {}}>
        Accessible Button
      </Button>
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have no accessibility violations in disabled state', async () => {
    const { container } = render(
      <Button disabled>
        Disabled Button
      </Button>
    )
    
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})