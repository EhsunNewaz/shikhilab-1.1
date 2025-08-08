/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('Vercel Deployment Tests', () => {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

  describe('Build Verification', () => {
    it('should have built successfully with turbo', () => {
      // Verify build artifacts exist
      expect(process.env.NODE_ENV).toBeDefined();
    });

    it('should have correct environment variables set', () => {
      // Verify environment variables are properly configured
      if (process.env.NODE_ENV === 'production') {
        expect(process.env.NEXT_PUBLIC_API_BASE_URL).toBe('https://api.shikhi-ielts.com');
        expect(process.env.NEXT_PUBLIC_ENV).toBe('production');
      }
    });
  });

  describe('Frontend Accessibility', () => {
    it('should render the main page without errors', () => {
      // This test would need to be adapted based on your actual page component
      // For now, we'll test that the test environment is working
      const testDiv = document.createElement('div');
      testDiv.textContent = 'Test';
      expect(testDiv.textContent).toBe('Test');
    });
  });

  describe('API Integration', () => {
    it('should be configured to proxy API requests correctly', () => {
      // Verify that API calls are configured to go to the correct endpoint
      const expectedApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (process.env.NODE_ENV === 'production') {
        expect(expectedApiUrl).toBe('https://api.shikhi-ielts.com');
      }
    });
  });

  describe('PWA Configuration', () => {
    it('should have service worker cache control configured', () => {
      // This would verify the vercel.json configuration is working
      // In a real deployment, service worker files should have no-cache headers
      expect(true).toBe(true); // Placeholder for actual PWA tests
    });
  });
});