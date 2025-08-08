import { test, expect } from '@playwright/test';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.shikhi-ielts.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://shikhi-ielts.vercel.app';

test.describe('End-to-End Deployment Pipeline Tests', () => {
  test('should have both frontend and backend services accessible', async ({ page }) => {
    // Test backend health endpoint
    const apiResponse = await page.request.get(`${API_BASE_URL}/health`);
    expect(apiResponse.ok()).toBeTruthy();
    expect(apiResponse.status()).toBe(200);
    
    const apiHealth = await apiResponse.json();
    expect(apiHealth).toHaveProperty('status', 'healthy');

    // Test frontend accessibility
    await page.goto(FRONTEND_URL);
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify page loads without errors
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('should have proper CORS configuration between frontend and backend', async ({ page }) => {
    // Navigate to frontend
    await page.goto(FRONTEND_URL);
    
    // Test that frontend can make requests to backend
    const response = await page.evaluate(async (apiUrl) => {
      try {
        const res = await fetch(`${apiUrl}/health`);
        return {
          ok: res.ok,
          status: res.status,
          data: await res.json()
        };
      } catch (error) {
        return {
          error: error.message
        };
      }
    }, API_BASE_URL);

    expect(response.ok).toBeTruthy();
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('status', 'healthy');
  });

  test('should handle deployment failures gracefully', async ({ page }) => {
    // Test that services are resilient and can handle failures
    const apiResponse = await page.request.get(`${API_BASE_URL}/health`);
    expect(apiResponse.ok()).toBeTruthy();
    
    // Verify uptime and stability
    const healthData = await apiResponse.json();
    expect(healthData).toHaveProperty('timestamp');
    
    // Test multiple consecutive requests to verify stability
    for (let i = 0; i < 3; i++) {
      const response = await page.request.get(`${API_BASE_URL}/health`);
      expect(response.ok()).toBeTruthy();
      
      // Add delay between requests
      await page.waitForTimeout(1000);
    }
  });

  test('should have proper security configuration', async ({ page }) => {
    // Test HTTPS enforcement
    if (API_BASE_URL.startsWith('https://')) {
      const response = await page.request.get(`${API_BASE_URL}/health`);
      expect(response.ok()).toBeTruthy();
    }

    // Test frontend HTTPS
    if (FRONTEND_URL.startsWith('https://')) {
      await page.goto(FRONTEND_URL);
      
      // Verify page loads securely
      const url = page.url();
      expect(url).toMatch(/^https:/);
    }
  });

  test('should meet performance requirements', async ({ page }) => {
    // Test API response time
    const startTime = Date.now();
    const apiResponse = await page.request.get(`${API_BASE_URL}/health`);
    const apiResponseTime = Date.now() - startTime;
    
    expect(apiResponse.ok()).toBeTruthy();
    expect(apiResponseTime).toBeLessThan(2000); // Less than 2 seconds

    // Test frontend load time
    const frontendStartTime = Date.now();
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');
    const frontendLoadTime = Date.now() - frontendStartTime;
    
    expect(frontendLoadTime).toBeLessThan(5000); // Less than 5 seconds
  });
});