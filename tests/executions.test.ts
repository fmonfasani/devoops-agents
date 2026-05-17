import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { createApp } from '../src/server.js'

let app: ReturnType<typeof createApp>
let dataDir: string
let agentId: string

beforeEach(async () => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'exec-test-'))
  process.env.DATA_DIR = dataDir
  app = createApp()

  const agent = await request(app)
    .post('/agents')
    .send({ name: 'exec-agent', description: 'for executions' })
  agentId = agent.body.id
})

afterEach(() => {
  fs.rmSync(dataDir, { recursive: true, force: true })
})

describe('POST /executions', () => {
  it('creates an execution for an existing agent', async () => {
    const res = await request(app)
      .post('/executions')
      .send({ agent_id: agentId, input: { prompt: 'hello' } })
      .expect(201)

    expect(res.body).toHaveProperty('id')
    expect(res.body.agent_id).toBe(agentId)
    expect(res.body.input).toEqual({ prompt: 'hello' })
    expect(res.body.status).toBe('pending')
    expect(res.body.output).toBeNull()
  })

  it('rejects missing agent_id', async () => {
    const res = await request(app)
      .post('/executions')
      .send({ input: {} })
      .expect(400)

    expect(res.body.error).toContain('agent_id is required')
  })

  it('returns 404 for unknown agent_id', async () => {
    await request(app)
      .post('/executions')
      .send({ agent_id: 'nonexistent', input: {} })
      .expect(404)
  })
})

describe('GET /executions', () => {
  it('returns empty list initially', async () => {
    const res = await request(app).get('/executions').expect(200)
    expect(res.body).toEqual([])
  })

  it('returns created executions', async () => {
    await request(app).post('/executions').send({ agent_id: agentId, input: {} })
    await request(app).post('/executions').send({ agent_id: agentId, input: {} })

    const res = await request(app).get('/executions').expect(200)
    expect(res.body).toHaveLength(2)
  })
})

describe('GET /executions/:id', () => {
  it('returns execution by id', async () => {
    const create = await request(app)
      .post('/executions')
      .send({ agent_id: agentId, input: { task: 'test' } })

    const res = await request(app)
      .get(`/executions/${create.body.id}`)
      .expect(200)

    expect(res.body.input).toEqual({ task: 'test' })
  })

  it('returns 404 for unknown id', async () => {
    await request(app).get('/executions/nonexistent').expect(404)
  })
})
