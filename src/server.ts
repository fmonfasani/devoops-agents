import express from 'express'
import { router as agentsRouter } from './routes/agents.js'
import { router as executionsRouter } from './routes/executions.js'

export function createApp() {
  const app = express()
  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/agents', agentsRouter)
  app.use('/executions', executionsRouter)

  return app
}
