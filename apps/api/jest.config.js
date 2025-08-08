/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/*.(test|spec).+(ts|tsx|js)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // --- BMad REVISIONS START HERE ---

  // We are replacing your existing setup file with our new, more powerful one.
  // If you have important setup logic in jest.setup.js, you should move it into test-setup.ts.
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],

  // We are adding a timeout to allow Docker and the database to start.
  testTimeout: 30000,

  // --- BMad REVISIONS END HERE ---

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}