// apps/api/src/test-setup.ts

// Simple test setup that works both with and without Docker
beforeAll(async () => {
  console.log('Setting up test environment...');
  
  // Set test database environment variables
  process.env.NODE_ENV = 'test';
  
  // Use Docker testcontainers if DOCKER_TESTS=true, otherwise use mock values
  if (process.env.DOCKER_TESTS === 'true') {
    console.log('Docker tests disabled for now - using mock database connection');
    // TODO: Add testcontainers setup when Docker integration is stable
  }
  
  // Set mock database values for tests
  process.env.DB_HOST = 'localhost';
  process.env.DB_PORT = '5432';
  process.env.DB_USER = 'test_user';
  process.env.DB_PASSWORD = 'test_password';
  process.env.DB_DATABASE = 'test_database';
  
  console.log('Test environment configured successfully.');
}, 10000);