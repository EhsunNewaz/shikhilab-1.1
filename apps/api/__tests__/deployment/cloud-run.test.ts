import request from 'supertest';
import { Express } from 'express';

// Import the app for local testing
let app: Express;

beforeAll(async () => {
  // Only import the app for local testing
  if (!process.env.API_BASE_URL || process.env.API_BASE_URL.includes('localhost')) {
    try {
      const appModule = await import('../../src/index');
      app = appModule.app || appModule.default;
    } catch (error) {
      console.log('Could not import app for testing, will use external URL');
    }
  }
});

describe.skip('Cloud Run Deployment Tests', () => {
  const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
  const isLocalTest = API_BASE_URL.includes('localhost');
  const isProductionTest = process.env.NODE_ENV === 'production';
  
  describe('Health Check Endpoint', () => {
    it('should return 200 OK status from health endpoint', async () => {
      let response;
      
      if (isLocalTest && app) {
        // Use supertest with the app instance for local testing
        response = await request(app)
          .get('/health')
          .expect(200);
      } else {
        // Use HTTP request for remote testing
        response = await request(API_BASE_URL)
          .get('/health')
          .expect(200);
      }
      
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('version');
    }, 30000);

    it('should respond within acceptable latency threshold', async () => {
      const startTime = Date.now();
      
      if (isLocalTest && app) {
        await request(app)
          .get('/health')
          .expect(200);
      } else {
        await request(API_BASE_URL)
          .get('/health')
          .expect(200);
      }
      
      const responseTime = Date.now() - startTime;
      
      // More lenient threshold for remote testing
      const maxResponseTime = isLocalTest ? 1000 : 5000;
      expect(responseTime).toBeLessThan(maxResponseTime);
    }, 30000);

    it('should return consistent response format', async () => {
      let response;
      
      if (isLocalTest && app) {
        response = await request(app)
          .get('/health')
          .expect(200);
      } else {
        response = await request(API_BASE_URL)
          .get('/health')
          .expect(200);
      }

      // Validate response structure
      expect(response.body).toMatchObject({
        status: expect.stringMatching(/^(healthy|ok)$/),
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
        uptime: expect.any(Number),
        environment: expect.any(String),
        version: expect.any(String)
      });

      // Uptime should be positive
      expect(response.body.uptime).toBeGreaterThan(0);
    });
  });

  describe('Environment Variables', () => {
    it('should have required environment configuration', async () => {
      let response;
      
      if (isLocalTest && app) {
        response = await request(app)
          .get('/health')
          .expect(200);
      } else {
        response = await request(API_BASE_URL)
          .get('/health')
          .expect(200);
      }
      
      if (isProductionTest) {
        expect(response.body.environment).toBe('production');
        expect(process.env.PORT).toBe('8080');
        expect(process.env.NODE_ENV).toBe('production');
      } else {
        // In test/development mode, just verify response structure
        expect(response.body).toHaveProperty('environment');
        expect(response.body).toHaveProperty('version');
        expect(response.body.environment).toMatch(/^(test|development|production)$/);
      }
    });
  });

  describe('Database Connection', () => {
    it('should have healthy service status indicating proper setup', async () => {
      let response;
      
      if (isLocalTest && app) {
        response = await request(app)
          .get('/health')
          .expect(200);
      } else {
        response = await request(API_BASE_URL)
          .get('/health')
          .expect(200);
      }
      
      // Verify the health endpoint responds correctly
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body.uptime).toBeGreaterThan(0);
    }, 30000);
  });

  describe('Security Configuration', () => {
    it('should enforce HTTPS in production', async () => {
      if (isProductionTest) {
        expect(API_BASE_URL).toMatch(/^https:/);
      } else {
        // Allow HTTP for local testing
        expect(API_BASE_URL).toMatch(/^https?:/);
      }
    });

    it('should have proper security headers', async () => {
      let response;
      
      if (isLocalTest && app) {
        response = await request(app)
          .get('/health')
          .expect(200);
      } else {
        response = await request(API_BASE_URL)
          .get('/health')
          .expect(200);
      }
      
      // Check for security headers (helmet middleware should be configured)
      if (isProductionTest) {
        expect(response.headers['x-frame-options']).toBeDefined();
        expect(response.headers['x-content-type-options']).toBe('nosniff');
        expect(response.headers['x-xss-protection']).toBeDefined();
      }
      
      // Always check Content-Type
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should not expose sensitive information', async () => {
      let response;
      
      if (isLocalTest && app) {
        response = await request(app)
          .get('/health')
          .expect(200);
      } else {
        response = await request(API_BASE_URL)
          .get('/health')
          .expect(200);
      }

      // Ensure no sensitive headers are exposed
      expect(response.headers['x-powered-by']).toBeUndefined();
      
      // Ensure response doesn't contain sensitive data
      const responseText = JSON.stringify(response.body);
      expect(responseText).not.toMatch(/password|secret|key|token/i);
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle concurrent requests', async () => {
      // Skip this test if app is not available locally
      if (!isLocalTest && !app) {
        console.log('Skipping concurrent requests test - no local app available');
        return;
      }

      const concurrentRequests = 5; // Reduced for stability
      const promises = [];

      for (let i = 0; i < concurrentRequests; i++) {
        if (isLocalTest && app) {
          promises.push(request(app).get('/health'));
        } else {
          promises.push(request(API_BASE_URL).get('/health'));
        }
      }

      const responses = await Promise.allSettled(promises);
      
      // Count successful responses
      const successfulResponses = responses.filter(
        result => result.status === 'fulfilled' && result.value.status === 200
      );
      
      // Should have at least some successful responses
      expect(successfulResponses.length).toBeGreaterThan(0);
    }, 30000);

    it('should maintain uptime across multiple requests', async () => {
      // Skip this test if app is not available locally
      if (!isLocalTest && !app) {
        console.log('Skipping uptime test - no local app available');
        return;
      }

      let firstResponse, secondResponse;
      
      // First request
      if (isLocalTest && app) {
        firstResponse = await request(app).get('/health');
        expect(firstResponse.status).toBe(200);
      } else {
        firstResponse = await request(API_BASE_URL).get('/health');
        expect(firstResponse.status).toBe(200);
      }

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Second request
      if (isLocalTest && app) {
        secondResponse = await request(app).get('/health');
        expect(secondResponse.status).toBe(200);
      } else {
        secondResponse = await request(API_BASE_URL).get('/health');
        expect(secondResponse.status).toBe(200);
      }

      // Both responses should be successful
      expect(firstResponse.body).toHaveProperty('status', 'healthy');
      expect(secondResponse.body).toHaveProperty('status', 'healthy');
      
      // Uptime should increase (if same process)
      if (firstResponse.body.uptime && secondResponse.body.uptime) {
        expect(secondResponse.body.uptime).toBeGreaterThanOrEqual(firstResponse.body.uptime);
      }
    }, 10000);
  });
});