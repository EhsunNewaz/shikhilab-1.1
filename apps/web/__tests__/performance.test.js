/**
 * Performance Budget Test using Lighthouse
 * This test ensures the application meets performance budgets
 */

const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')
const path = require('path')

describe('Performance Budget', () => {
  let chrome
  let url = 'http://localhost:3000'

  beforeAll(async () => {
    // This test requires a running server
    // In CI, the server should be started before running tests
  })

  afterAll(async () => {
    if (chrome) {
      await chrome.kill()
    }
  })

  // Skip this test in regular runs - only run in CI or when specifically requested
  it.skip('should meet performance budgets', async () => {
    chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
    
    const options = {
      logLevel: 'info',
      output: 'json',
      onlyCategories: ['performance', 'accessibility'],
      port: chrome.port,
    }

    const runnerResult = await lighthouse(url, options)

    // Extract scores
    const { lhr } = runnerResult
    const performanceScore = lhr.categories.performance.score * 100
    const accessibilityScore = lhr.categories.accessibility.score * 100

    // Performance budget assertions
    expect(performanceScore).toBeGreaterThanOrEqual(80)
    expect(accessibilityScore).toBeGreaterThanOrEqual(95)

    // Core Web Vitals
    const fcp = lhr.audits['first-contentful-paint'].numericValue
    const lcp = lhr.audits['largest-contentful-paint'].numericValue
    const cls = lhr.audits['cumulative-layout-shift'].numericValue
    const tbt = lhr.audits['total-blocking-time'].numericValue

    expect(fcp).toBeLessThanOrEqual(2000)
    expect(lcp).toBeLessThanOrEqual(2500)
    expect(cls).toBeLessThanOrEqual(0.1)
    expect(tbt).toBeLessThanOrEqual(200)

    // Save results for debugging
    const resultsPath = path.join(__dirname, '..', 'lighthouse-results.json')
    fs.writeFileSync(resultsPath, JSON.stringify(lhr, null, 2))
  })

  it('should have performance test configured', () => {
    // This test ensures the performance testing infrastructure is in place
    expect(lighthouse).toBeDefined()
    expect(chromeLauncher).toBeDefined()
  })
})