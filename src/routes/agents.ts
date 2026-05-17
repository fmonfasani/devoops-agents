import { Router, Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import type { Agent, CreateAgentPayload, UpdateAgentPayload } from '../types.js'
import { loadAgents, saveAgents } from '../store.js'

export const router = Router()

function now(): string {
  return new Date().toISOString()
}

router.post('/', (req: Request, res: Response) => {
  const body = req.body as CreateAgentPayload
  if (!body.name || typeof body.name !== 'string') {
    res.status(400).json({ error: 'name is required and must be a string' })
    return
  }

  const agent: Agent = {
    id: uuid(),
    name: body.name,
    description: body.description || '',
    tool_ids: Array.isArray(body.tool_ids) ? body.tool_ids : [],
    status: 'active',
    config: body.config || {},
    created_at: now(),
    updated_at: now(),
  }

  const agents = loadAgents()
  agents.push(agent)
  saveAgents(agents)

  res.status(201).json(agent)
})

router.get('/', (_req: Request, res: Response) => {
  const agents = loadAgents()
  res.json(agents)
})

router.get('/:id', (req: Request, res: Response) => {
  const agents = loadAgents()
  const agent = agents.find(a => a.id === req.params.id)
  if (!agent) {
    res.status(404).json({ error: 'Agent not found' })
    return
  }
  res.json(agent)
})

router.put('/:id', (req: Request, res: Response) => {
  const body = req.body as UpdateAgentPayload
  const agents = loadAgents()
  const idx = agents.findIndex(a => a.id === req.params.id)

  if (idx === -1) {
    res.status(404).json({ error: 'Agent not found' })
    return
  }

  agents[idx] = {
    ...agents[idx],
    ...body,
    tool_ids: body.tool_ids !== undefined ? body.tool_ids : agents[idx].tool_ids,
    updated_at: now(),
  }

  saveAgents(agents)
  res.json(agents[idx])
})

router.delete('/:id', (req: Request, res: Response) => {
  const agents = loadAgents()
  const idx = agents.findIndex(a => a.id === req.params.id)

  if (idx === -1) {
    res.status(404).json({ error: 'Agent not found' })
    return
  }

  const [deleted] = agents.splice(idx, 1)
  saveAgents(agents)
  res.json(deleted)
})
