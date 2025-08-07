export interface HealthResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  uptime: number
  environment: string
  version: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface Enrollment {
  id: string
  courseId: string
  fullName: string
  email: string
  transactionId: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: string
  name: string
  description: string
  capacity: number
}

export interface User {
  id: string
  full_name: string
  email: string
  password_hash: string
  role: 'student' | 'admin'
  ai_credits: number
  target_band_score?: number
  target_test_date?: string
  interface_language: string
  ai_feedback_language: string
  gamification_opt_out: boolean
  gamification_is_anonymous: boolean
  current_streak: number
  points_balance: number
  created_at: string
  updated_at: string
}

export type UserRole = 'student' | 'admin'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  user: Omit<User, 'password_hash'>
  accessToken: string
}

export interface RefreshTokenResponse {
  success: boolean
  accessToken: string
}