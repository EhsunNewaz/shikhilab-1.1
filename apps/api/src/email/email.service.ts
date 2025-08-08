export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface EmailOptions {
  to: string
  from?: string
  subject?: string
  html?: string
  text?: string
  template?: 'password-setup' | 'enrollment-approved' | 'enrollment-rejected'
  templateData?: Record<string, any>
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
  retryable?: boolean
}

export interface EmailProvider {
  send(_options: EmailOptions): Promise<EmailResult>
  validateConnection(): Promise<boolean>
}

export class EmailService {
  private provider: EmailProvider
  private defaultFrom: string
  private retryAttempts: number = 3
  private retryDelay: number = 1000 // 1 second

  constructor(provider: EmailProvider, defaultFrom: string) {
    this.provider = provider
    this.defaultFrom = defaultFrom
  }

  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    const emailOptions: EmailOptions = {
      ...options,
      from: options.from || this.defaultFrom
    }

    // Apply template if specified
    if (options.template && options.templateData) {
      const template = this.getTemplate(options.template, options.templateData)
      emailOptions.subject = template.subject
      emailOptions.html = template.html
      emailOptions.text = template.text
    }

    // Ensure subject is set
    if (!emailOptions.subject) {
      throw new Error('Email subject is required')
    }

    return this.sendWithRetry(emailOptions)
  }

  private async sendWithRetry(options: EmailOptions): Promise<EmailResult> {
    let lastError: string = ''
    
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const result = await this.provider.send(options)
        
        if (result.success) {
          console.log(`Email sent successfully to ${options.to} on attempt ${attempt}`)
          return result
        }

        if (!result.retryable) {
          console.error(`Non-retryable email error for ${options.to}:`, result.error)
          return result
        }

        lastError = result.error || 'Unknown error'
        
        if (attempt < this.retryAttempts) {
          console.warn(`Email attempt ${attempt} failed for ${options.to}, retrying in ${this.retryDelay}ms`)
          await this.delay(this.retryDelay * attempt) // Exponential backoff
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unexpected error'
        console.error(`Email attempt ${attempt} threw exception for ${options.to}:`, error)
        
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt)
        }
      }
    }

    console.error(`All email retry attempts failed for ${options.to}`)
    return {
      success: false,
      error: `Failed after ${this.retryAttempts} attempts. Last error: ${lastError}`,
      retryable: true
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private getTemplate(templateName: string, data: Record<string, any>): EmailTemplate {
    switch (templateName) {
      case 'password-setup':
        return this.getPasswordSetupTemplate(data)
      case 'enrollment-approved':
        return this.getEnrollmentApprovedTemplate(data)
      case 'enrollment-rejected':
        return this.getEnrollmentRejectedTemplate(data)
      default:
        throw new Error(`Unknown email template: ${templateName}`)
    }
  }

  private getPasswordSetupTemplate(data: Record<string, any>): EmailTemplate {
    const { fullName, setupUrl, expiryHours = 24 } = data

    const subject = 'Welcome to Shikhi Lab IELTS - Set Your Password'
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin: 0; font-size: 28px;">Welcome to Shikhi Lab IELTS!</h1>
            <p style="color: #6b7280; margin-top: 8px; font-size: 16px;">Your enrollment has been approved</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Dear ${fullName},
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Congratulations! Your enrollment application has been approved. To complete your registration and access your student dashboard, please set up your account password.
            </p>
          </div>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${setupUrl}" 
               style="background-color: #3b82f6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; display: inline-block; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);">
              Set Your Password
            </a>
          </div>
          
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 4px solid #f59e0b;">
            <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 600;">
              ⚠️ Important Security Notice
            </p>
            <p style="color: #92400e; margin: 8px 0 0 0; font-size: 14px; line-height: 1.5;">
              This link will expire in <strong>${expiryHours} hours</strong>. If you don't set your password within this time, you'll need to contact support for a new invitation.
            </p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0;">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="color: #3b82f6; font-size: 14px; word-break: break-all; margin: 8px 0 0 0;">
              ${setupUrl}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong>The Shikhi Lab IELTS Team</strong>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            This email was sent to ${data.email}. If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `

    const text = `
Welcome to Shikhi Lab IELTS!

Dear ${fullName},

Congratulations! Your enrollment application has been approved. To complete your registration and access your student dashboard, please set up your account password.

Set your password by visiting: ${setupUrl}

IMPORTANT: This link will expire in ${expiryHours} hours. If you don't set your password within this time, you'll need to contact support for a new invitation.

Best regards,
The Shikhi Lab IELTS Team

---
This email was sent to ${data.email}. If you didn't request this, please ignore this email.
    `

    return { subject, html, text }
  }

  private getEnrollmentApprovedTemplate(data: Record<string, any>): EmailTemplate {
    const { fullName, courseName } = data

    const subject = 'Enrollment Approved - Welcome to Shikhi Lab IELTS!'
    const html = `<h1>Welcome ${fullName}!</h1><p>Your enrollment for ${courseName} has been approved.</p>`
    const text = `Welcome ${fullName}! Your enrollment for ${courseName} has been approved.`

    return { subject, html, text }
  }

  private getEnrollmentRejectedTemplate(data: Record<string, any>): EmailTemplate {
    const { fullName, courseName, reason } = data

    const subject = 'Enrollment Update - Shikhi Lab IELTS'
    const html = `<h1>Hello ${fullName},</h1><p>We regret to inform you that your enrollment for ${courseName} could not be approved. Reason: ${reason}</p>`
    const text = `Hello ${fullName}, We regret to inform you that your enrollment for ${courseName} could not be approved. Reason: ${reason}`

    return { subject, html, text }
  }

  async validateConnection(): Promise<boolean> {
    try {
      return await this.provider.validateConnection()
    } catch (error) {
      console.error('Email service connection validation failed:', error)
      return false
    }
  }
}

// Mock Email Provider for Development/Testing
export class MockEmailProvider implements EmailProvider {
  private logs: EmailOptions[] = []

  async send(options: EmailOptions): Promise<EmailResult> {
    console.log('📧 [MOCK EMAIL] Sending email:', {
      to: options.to,
      from: options.from,
      subject: options.subject,
      template: options.template
    })
    
    this.logs.push(options)
    
    // Simulate occasional failures for testing
    if (Math.random() < 0.1) { // 10% failure rate
      return {
        success: false,
        error: 'Simulated email provider failure',
        retryable: true
      }
    }

    return {
      success: true,
      messageId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
  }

  async validateConnection(): Promise<boolean> {
    return true
  }

  getLogs(): EmailOptions[] {
    return [...this.logs]
  }

  clearLogs(): void {
    this.logs = []
  }
}

// Factory function to create email service based on environment
export function createEmailService(): EmailService {
  const provider = new MockEmailProvider() // In production, use SendGrid, Mailgun, etc.
  const defaultFrom = process.env.EMAIL_FROM || 'noreply@shikhilabielts.com'
  
  return new EmailService(provider, defaultFrom)
}