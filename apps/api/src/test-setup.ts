// apps/api/src/test-setup.ts

// Simple test setup without Docker/testcontainers requirement
beforeAll(async () => {
  console.log('Setting up test environment...');
  
  // Set test database environment variables for mocking
  process.env.NODE_ENV = 'test';
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_USER = 'test_user';
  process.env.DB_PASSWORD = 'test_password';
  process.env.DB_DATABASE = 'test_database';
  
  console.log('Test environment configured successfully.');
}, 10000);