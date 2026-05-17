import { Router, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import type { ExecutionContext, CreateExecutionPayload } from '../types.js'
import { loadAgents, loadExecutions, saveExecutions } from '../store.js'

export const router = Router()

function now(): string {
  return new Date().toISOString()
}

router.post('/', (req: Request, res: Response) => {
  const body = req.body as CreateExecutionPayload

  if (!body.agent_id || typeof body.agent_id !== 'string') {
    res.status(400).json({ error: 'agent_id is required' })
    return
  }

  const agents = loadAgents()
  const agent = agents.find(a => a.id === body.agent_id)
  if (!agent) {
    res.status(404).json({ error: 'Agent not found' })
    return
  }

  const execution: ExecutionContext = {
    id: uuid(),
    agent_id: body.agent_id,
    input: body.input || {},
    output: null,
    status: 'pending',
    error: null,
    created_at: now(),
    started_at: null,
    completed_at: null,
  }

  const executions = loadExecutions()
  executions.push(execution)
  saveExecutions(executions)

  res.status(201).json(execution)
})

router.get('/', (_req: Request, res: Response) => {
  const executions = loadExecutions()
  res.json(executions)
})

router.get('/:id', (req: Request, res: Response) => {
  const executions = loadExecutions()
  const execution = executions.find(e => e.id === req.params.id)
  if (!execution) {
    res.status(404).json({ error: 'Execution not found' })
    return
  }
  res.json(execution)
})
