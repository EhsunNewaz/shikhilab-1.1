import { Pool } from 'pg'

export interface MockQueryResult {
  rows: any[]
  rowCount: number
  command: string
  oid: number
  fields: any[]
}

export const createMockQueryResult = (rows: any[] = [], command = 'SELECT'): MockQueryResult => ({
  rows,
  rowCount: rows.length,
  command,
  oid: 0,
  fields: []
})

export const createMockDatabase = () => {
  const mockClient = {
    query: jest.fn(),
    release: jest.fn()
  }

  const mockDb = {
    query: jest.fn(),
    connect: jest.fn().mockResolvedValue(mockClient)
  } as unknown as Pool

  return { mockDb, mockClient }
}

export const mockDatabaseSuccess = (mockDb: any, rows: any[], command = 'SELECT') => {
  (mockDb.query as jest.Mock).mockResolvedValue(createMockQueryResult(rows, command))
}

export const mockDatabaseError = (mockDb: any, error: Error) => {
  (mockDb.query as jest.Mock).mockRejectedValue(error)
}

// Client-specific mocks for transaction tests
export const mockClientTransaction = (mockClient: any, querySequence: Array<{ rows: any[], command?: string }>) => {
  mockClient.query
    .mockResolvedValueOnce(createMockQueryResult([], 'BEGIN'))
    
  querySequence.forEach(({ rows, command = 'SELECT' }) => {
    mockClient.query.mockResolvedValueOnce(createMockQueryResult(rows, command))
  })
  
  mockClient.query.mockResolvedValueOnce(createMockQueryResult([], 'COMMIT'))
}

export const mockClientTransactionError = (mockClient: any, error: Error, afterQueries = 1) => {
  mockClient.query.mockResolvedValueOnce(createMockQueryResult([], 'BEGIN'))
  
  for (let i = 0; i < afterQueries; i++) {
    mockClient.query.mockResolvedValueOnce(createMockQueryResult([]))
  }
  
  mockClient.query.mockRejectedValueOnce(error)
  mockClient.query.mockResolvedValueOnce(createMockQueryResult([], 'ROLLBACK'))
}

// Common mock data
export const mockEnrollmentData = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  full_name: 'John Doe',
  email: 'john@example.com',
  transaction_id: 'TXN123456789',
  created_at: '2025-01-08T10:00:00Z',
  course_title: 'IELTS Preparation Course',
  status: 'pending',
  course_id: 'course-123'
}

export const mockUserData = {
  id: 'user-123',
  email: 'john@example.com',
  full_name: 'John Doe',
  role: 'student'
}

export const mockCapacityData = {
  total_capacity: '50',
  current_approved: '20',
  current_pending: '5'
}