import { EmailService, MockEmailProvider, EmailResult } from './email.service'

describe('EmailService', () => {
  let emailService: EmailService
  let mockProvider: MockEmailProvider

  beforeEach(() => {
    mockProvider = new MockEmailProvider()
    emailService = new EmailService(mockProvider, 'test@example.com')
    mockProvider.clearLogs()
  })

  describe('sendEmail', () => {
    it('should send email with template successfully', async () => {
      const result = await emailService.sendEmail({
        to: 'student@example.com',
        template: 'password-setup',
        templateData: {
          fullName: 'John Doe',
          email: 'student@example.com',
          setupUrl: 'https://example.com/password-setup?token=abc123',
          expiryHours: 24
        }
      })

      expect(result.success).toBe(true)
      expect(result.messageId).toBeDefined()
      
      const logs = mockProvider.getLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0].to).toBe('student@example.com')
      expect(logs[0].subject).toContain('Welcome to Shikhi Lab IELTS')
    })

    it('should use default from address when not specified', async () => {
      await emailService.sendEmail({
        to: 'student@example.com',
        subject: 'Test Subject',
        text: 'Test content'
      })

      const logs = mockProvider.getLogs()
      expect(logs[0].from).toBe('test@example.com')
    })

    it('should use provided from address', async () => {
      await emailService.sendEmail({
        to: 'student@example.com',
        from: 'custom@example.com',
        subject: 'Test Subject',
        text: 'Test content'
      })

      const logs = mockProvider.getLogs()
      expect(logs[0].from).toBe('custom@example.com')
    })
  })

  describe('password setup template', () => {
    it('should generate complete password setup email', async () => {
      const templateData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        setupUrl: 'https://app.shikhilabielts.com/password-setup?token=abc123xyz',
        expiryHours: 24
      }

      const result = await emailService.sendEmail({
        to: 'john@example.com',
        template: 'password-setup',
        templateData
      })

      expect(result.success).toBe(true)

      const logs = mockProvider.getLogs()
      const sentEmail = logs[0]

      expect(sentEmail.subject).toBe('Welcome to Shikhi Lab IELTS - Set Your Password')
      expect(sentEmail.html).toContain('John Doe')
      expect(sentEmail.html).toContain('https://app.shikhilabielts.com/password-setup?token=abc123xyz')
      expect(sentEmail.html).toContain('24 hours')
      expect(sentEmail.text).toContain('John Doe')
      expect(sentEmail.text).toContain('https://app.shikhilabielts.com/password-setup?token=abc123xyz')
    })

    it('should handle template data injection correctly', async () => {
      const templateData = {
        fullName: 'Jane Smith',
        email: 'jane.smith@example.com',
        setupUrl: 'https://localhost:3000/password-setup?token=test123',
        expiryHours: 12
      }

      await emailService.sendEmail({
        to: 'jane.smith@example.com',
        template: 'password-setup',
        templateData
      })

      const logs = mockProvider.getLogs()
      const sentEmail = logs[0]

      expect(sentEmail.html).toContain('Jane Smith')
      expect(sentEmail.html).toContain('12 hours')
      expect(sentEmail.html).not.toContain('{{')
      expect(sentEmail.html).not.toContain('}}')
    })
  })

  describe('error handling and retries', () => {
    beforeEach(() => {
      // Mock provider to fail initially
      jest.spyOn(mockProvider, 'send')
        .mockResolvedValueOnce({ success: false, error: 'Temporary failure', retryable: true })
        .mockResolvedValueOnce({ success: false, error: 'Temporary failure', retryable: true })
        .mockResolvedValueOnce({ success: true, messageId: 'success-after-retry' })
    })

    it('should retry failed emails and eventually succeed', async () => {
      const result = await emailService.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        text: 'Test'
      })

      expect(result.success).toBe(true)
      expect(result.messageId).toBe('success-after-retry')
      expect(mockProvider.send).toHaveBeenCalledTimes(3)
    })
  })

  describe('non-retryable errors', () => {
    beforeEach(() => {
      jest.spyOn(mockProvider, 'send').mockResolvedValue({
        success: false,
        error: 'Invalid email address',
        retryable: false
      })
    })

    it('should not retry non-retryable errors', async () => {
      const result = await emailService.sendEmail({
        to: 'invalid-email',
        subject: 'Test',
        text: 'Test'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid email address')
      expect(mockProvider.send).toHaveBeenCalledTimes(1)
    })
  })

  describe('template validation', () => {
    it('should throw error for unknown template', async () => {
      await expect(emailService.sendEmail({
        to: 'test@example.com',
        template: 'unknown-template' as any,
        templateData: {}
      })).rejects.toThrow('Unknown email template: unknown-template')
    })
  })

  describe('connection validation', () => {
    it('should validate provider connection', async () => {
      const isValid = await emailService.validateConnection()
      expect(isValid).toBe(true)
    })

    it('should handle connection validation errors', async () => {
      jest.spyOn(mockProvider, 'validateConnection').mockRejectedValue(new Error('Connection failed'))

      const isValid = await emailService.validateConnection()
      expect(isValid).toBe(false)
    })
  })
})

describe('MockEmailProvider', () => {
  let provider: MockEmailProvider

  beforeEach(() => {
    provider = new MockEmailProvider()
  })

  it('should log sent emails', async () => {
    const emailOptions = {
      to: 'test@example.com',
      from: 'sender@example.com',
      subject: 'Test Email',
      text: 'Test content'
    }

    await provider.send(emailOptions)

    const logs = provider.getLogs()
    expect(logs).toHaveLength(1)
    expect(logs[0]).toEqual(emailOptions)
  })

  it('should simulate occasional failures', async () => {
    // Run multiple sends to test the 10% failure rate
    const _results: EmailResult[] = []
    
    // Mock Math.random to control failure simulation
    const originalRandom = Math.random
    let callCount = 0
    Math.random = jest.fn(() => {
      callCount++
      // Make first call fail (< 0.1), second succeed (>= 0.1)
      return callCount === 1 ? 0.05 : 0.5
    })

    const result1 = await provider.send({
      to: 'test1@example.com',
      subject: 'Test 1',
      text: 'Test'
    })

    const result2 = await provider.send({
      to: 'test2@example.com',
      subject: 'Test 2',
      text: 'Test'
    })

    expect(result1.success).toBe(false)
    expect(result1.error).toBe('Simulated email provider failure')
    expect(result1.retryable).toBe(true)

    expect(result2.success).toBe(true)
    expect(result2.messageId).toBeDefined()

    Math.random = originalRandom
  })

  it('should clear logs', () => {
    provider.send({
      to: 'test@example.com',
      subject: 'Test',
      text: 'Test'
    })

    expect(provider.getLogs()).toHaveLength(1)

    provider.clearLogs()
    expect(provider.getLogs()).toHaveLength(0)
  })

  it('should validate connection successfully', async () => {
    const isValid = await provider.validateConnection()
    expect(isValid).toBe(true)
  })
})