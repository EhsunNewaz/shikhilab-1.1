import { z } from 'zod'

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
  })
})

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
})

export type LoginRequest = z.infer<typeof loginSchema>['body']
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>['cookies']