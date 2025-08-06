import request from 'supertest'
import app from '../src/index'

describe('Health Endpoint', () => {
  describe('GET /health', () => {
    it('should return 200 status and health data', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      expect(response.body).toMatchObject({
        status: 'healthy',
        timestamp: expect.any(String),
        uptime: expect.any(Number),
        environment: expect.any(String),
        version: expect.any(String),
      })
    })

    it('should return valid timestamp format', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      const timestamp = new Date(response.body.timestamp)
      expect(timestamp).toBeInstanceOf(Date)
      expect(timestamp.getTime()).not.toBeNaN()
    })

    it('should return positive uptime', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200)

      expect(response.body.uptime).toBeGreaterThan(0)
    })

    it('should have correct content-type', async () => {
      await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
})