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
  title: string
  description: string | null
  capacity: number
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface Class {
  id: string
  course_id: string
  title: string
  order_number: number
  release_date: string | null
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CourseEnrollment {
  user_id: string
  course_id: string
  enrolled_at: string
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

export interface AdminEnrollmentView {
  id: string
  full_name: string
  email: string
  transaction_id: string
  created_at: string
  course_title: string
}

export interface EnrollmentCapacity {
  total_capacity: number
  current_approved: number
  current_pending: number
  available_slots: number
}

export interface PasswordSetupToken {
  token: string
  email: string
  expires_at: string
  created_at: string
}

export interface SetPasswordRequest {
  token: string
  password: string
}