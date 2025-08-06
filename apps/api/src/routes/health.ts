import { Router, Request, Response } from 'express'

export const healthRouter = Router()

healthRouter.get('/', (req: Request, res: Response) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '0.1.0',
  }

  res.status(200).json(healthData)
})