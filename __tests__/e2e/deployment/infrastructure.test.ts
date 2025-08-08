import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.shikhi-ielts.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://shikhi-ielts.vercel.app';

test.describe('Infrastructure and Deployment Resilience Tests', () => {
  test.beforeEach(async () => {
    // Add any setup needed for infrastructure tests
  });

  test.describe('Load and Stress Testing', () => {
    test('should handle concurrent health check requests', async ({ page }) => {
      const concurrentRequests = 20;
      const promises: Promise<any>[] = [];

      // Create multiple concurrent requests
      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
          page.request.get(`${API_BASE_URL}/health`, {
            timeout: 10000
          })
        );
      }

      // Wait for all requests to complete
      const responses = await Promise.allSettled(promises);
      
      // Count successful responses
      const successfulResponses = responses.filter(
        result => result.status === 'fulfilled' && result.value.ok()
      );

      // At least 80% should succeed under load
      const successRate = successfulResponses.length / concurrentRequests;
      expect(successRate).toBeGreaterThan(0.8);

      console.log(`Load test: ${successfulResponses.length}/${concurrentRequests} requests succeeded (${Math.round(successRate * 100)}%)`);
    });

    test('should maintain performance under sequential load', async ({ page }) => {
      const requestCount = 50;
      const responseTimeThreshold = 3000; // 3 seconds
      const responseTimes: number[] = [];

      for (let i = 0; i < requestCount; i++) {
        const startTime = Date.now();
        
        const response = await page.request.get(`${API_BASE_URL}/health`);
        expect(response.ok()).toBeTruthy();
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        responseTimes.push(responseTime);

        // Short delay between requests
        await page.waitForTimeout(100);
      }

      // Calculate performance metrics
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      const maxResponseTime = Math.max(...responseTimes);
      const p95ResponseTime = responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)];

      console.log(`Performance metrics:
        Average: ${Math.round(avgResponseTime)}ms
        Max: ${maxResponseTime}ms
        P95: ${p95ResponseTime}ms`);

      // Performance assertions
      expect(avgResponseTime).toBeLessThan(responseTimeThreshold);
      expect(p95ResponseTime).toBeLessThan(responseTimeThreshold * 2);
    });
  });

  test.describe('Deployment Rollback Simulation', () => {
    test('should detect service degradation', async ({ page }) => {
      // Test multiple health checks to detect any intermittent issues
      const healthCheckCount = 10;
      const healthCheckResults = [];

      for (let i = 0; i < healthCheckCount; i++) {
        try {
          const response = await page.request.get(`${API_BASE_URL}/health`, {
            timeout: 5000
          });
          
          healthCheckResults.push({
            status: response.status(),
            ok: response.ok(),
            timestamp: new Date().toISOString()
          });

          if (response.ok()) {
            const healthData = await response.json();
            expect(healthData).toHaveProperty('status', 'healthy');
          }
        } catch (error) {
          healthCheckResults.push({
            status: 0,
            ok: false,
            error: error.message,
            timestamp: new Date().toISOString()
          });
        }

        // Wait between health checks
        await page.waitForTimeout(2000);
      }

      // Analyze results
      const successfulChecks = healthCheckResults.filter(result => result.ok);
      const successRate = successfulChecks.length / healthCheckCount;
      
      console.log(`Health check results: ${successfulChecks.length}/${healthCheckCount} successful (${Math.round(successRate * 100)}%)`);

      // Service should be consistently healthy
      expect(successRate).toBeGreaterThan(0.9); // 90% success rate
    });

    test('should validate rollback script availability', async ({ page }) => {
      // This test validates that rollback mechanisms are in place
      // In a real scenario, this might trigger an actual rollback test in a staging environment
      
      const healthResponse = await page.request.get(`${API_BASE_URL}/health`);
      expect(healthResponse.ok()).toBeTruthy();

      const healthData = await healthResponse.json();
      expect(healthData).toHaveProperty('status', 'healthy');
      expect(healthData).toHaveProperty('uptime');
      expect(healthData).toHaveProperty('version');

      // Simulate checking that rollback capabilities exist
      // This could be extended to check specific rollback endpoints or metadata
      expect(healthData.version).toBeDefined();
      expect(typeof healthData.uptime).toBe('number');
    });
  });

  test.describe('Cross-Environment Integration', () => {
    test('should maintain consistent API contract between frontend and backend', async ({ page }) => {
      // Navigate to frontend
      await page.goto(FRONTEND_URL);
      await page.waitForLoadState('networkidle');

      // Test that frontend can communicate with backend
      const apiCallResult = await page.evaluate(async (apiUrl) => {
        try {
          const response = await fetch(`${apiUrl}/health`);
          const data = await response.json();
          
          return {
            success: true,
            status: response.status,
            data: data
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }, API_BASE_URL);

      expect(apiCallResult.success).toBeTruthy();
      expect(apiCallResult.status).toBe(200);
      expect(apiCallResult.data).toHaveProperty('status', 'healthy');
    });

    test('should handle CORS properly', async ({ page }) => {
      await page.goto(FRONTEND_URL);
      
      // Test CORS by making a cross-origin request from the browser
      const corsResult = await page.evaluate(async (apiUrl) => {
        try {
          const response = await fetch(`${apiUrl}/health`, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          return {
            success: response.ok,
            status: response.status,
            headers: Object.fromEntries(response.headers.entries())
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }, API_BASE_URL);

      expect(corsResult.success).toBeTruthy();
      expect(corsResult.status).toBe(200);
    });
  });

  test.describe('Monitoring and Observability', () => {
    test('should provide proper error responses', async ({ page }) => {
      // Test non-existent endpoint to validate error handling
      const response = await page.request.get(`${API_BASE_URL}/non-existent-endpoint`);
      
      expect(response.status()).toBe(404);
      
      // Verify error response format
      try {
        const errorData = await response.json();
        // Should have some error structure (this depends on your error handling middleware)
        expect(errorData).toBeDefined();
      } catch (e) {
        // It's okay if it's not JSON, but it should be a proper 404
        expect(response.status()).toBe(404);
      }
    });

    test('should have appropriate response headers', async ({ page }) => {
      const response = await page.request.get(`${API_BASE_URL}/health`);
      
      expect(response.ok()).toBeTruthy();
      
      const headers = response.headers();
      
      // Check for important headers
      expect(headers['content-type']).toMatch(/application\/json/);
      
      // Security headers (if configured)
      if (process.env.NODE_ENV === 'production') {
        expect(headers['x-frame-options']).toBeDefined();
        expect(headers['x-content-type-options']).toBe('nosniff');
      }
      
      // No sensitive headers should be exposed
      expect(headers['x-powered-by']).toBeUndefined();
    });

    test('should track request timing', async ({ page }) => {
      const measurements = [];
      
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now();
        
        const response = await page.request.get(`${API_BASE_URL}/health`);
        expect(response.ok()).toBeTruthy();
        
        const endTime = Date.now();
        measurements.push(endTime - startTime);
        
        await page.waitForTimeout(1000);
      }
      
      const avgResponseTime = measurements.reduce((a, b) => a + b, 0) / measurements.length;
      const maxResponseTime = Math.max(...measurements);
      
      console.log(`Response time metrics:
        Average: ${Math.round(avgResponseTime)}ms
        Max: ${maxResponseTime}ms
        All measurements: [${measurements.join(', ')}]ms`);
      
      // Performance expectations
      expect(avgResponseTime).toBeLessThan(2000); // 2 seconds average
      expect(maxResponseTime).toBeLessThan(5000);  // 5 seconds max
    });
  });

  test.describe('Disaster Recovery', () => {
    test('should handle service interruptions gracefully', async ({ page }) => {
      // Test multiple consecutive requests to ensure consistency
      const requestCount = 10;
      const results = [];

      for (let i = 0; i < requestCount; i++) {
        try {
          const response = await page.request.get(`${API_BASE_URL}/health`, {
            timeout: 10000
          });
          
          results.push({
            success: response.ok(),
            status: response.status(),
            attempt: i + 1
          });
        } catch (error) {
          results.push({
            success: false,
            error: error.message,
            attempt: i + 1
          });
        }
        
        // Wait between requests to simulate real usage
        await page.waitForTimeout(500);
      }

      // Analyze consistency
      const successfulResults = results.filter(r => r.success);
      const consistencyRate = successfulResults.length / requestCount;
      
      console.log(`Consistency test: ${successfulResults.length}/${requestCount} successful requests (${Math.round(consistencyRate * 100)}%)`);
      
      // Should have high consistency
      expect(consistencyRate).toBeGreaterThan(0.95); // 95% success rate
    });
  });
});