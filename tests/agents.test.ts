import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { createApp } from '../src/server.js'

let app: ReturnType<typeof createApp>
let dataDir: string

beforeEach(() => {
  dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agents-test-'))
  process.env.DATA_DIR = dataDir
  app = createApp()
})

afterEach(() => {
  fs.rmSync(dataDir, { recursive: true, force: true })
})

describe('POST /agents', () => {
  it('creates an agent', async () => {
    const res = await request(app)
      .post('/agents')
      .send({ name: 'test-agent', description: 'A test agent' })
      .expect(201)

    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('test-agent')
    expect(res.body.description).toBe('A test agent')
    expect(res.body.status).toBe('active')
    expect(res.body.tool_ids).toEqual([])
  })

  it('rejects missing name', async () => {
    const res = await request(app)
      .post('/agents')
      .send({ description: 'no name' })
      .expect(400)

    expect(res.body.error).toContain('name is required')
  })
})

describe('GET /agents', () => {
  it('returns empty list initially', async () => {
    const res = await request(app).get('/agents').expect(200)
    expect(res.body).toEqual([])
  })

  it('returns created agents', async () => {
    await request(app).post('/agents').send({ name: 'a1' })
    await request(app).post('/agents').send({ name: 'a2' })

    const res = await request(app).get('/agents').expect(200)
    expect(res.body).toHaveLength(2)
  })
})

describe('GET /agents/:id', () => {
  it('returns agent by id', async () => {
    const create = await request(app)
      .post('/agents')
      .send({ name: 'find-me' })

    const res = await request(app)
      .get(`/agents/${create.body.id}`)
      .expect(200)

    expect(res.body.name).toBe('find-me')
  })

  it('returns 404 for unknown id', async () => {
    await request(app).get('/agents/nonexistent').expect(404)
  })
})

describe('PUT /agents/:id', () => {
  it('updates agent name and status', async () => {
    const create = await request(app)
      .post('/agents')
      .send({ name: 'original' })

    const res = await request(app)
      .put(`/agents/${create.body.id}`)
      .send({ name: 'updated', status: 'inactive' })
      .expect(200)

    expect(res.body.name).toBe('updated')
    expect(res.body.status).toBe('inactive')
  })

  it('returns 404 for unknown id', async () => {
    await request(app)
      .put('/agents/nonexistent')
      .send({ name: 'nope' })
      .expect(404)
  })
})

describe('DELETE /agents/:id', () => {
  it('deletes an agent', async () => {
    const create = await request(app)
      .post('/agents')
      .send({ name: 'delete-me' })

    await request(app).delete(`/agents/${create.body.id}`).expect(200)

    const list = await request(app).get('/agents')
    expect(list.body).toHaveLength(0)
  })

  it('returns 404 for unknown id', async () => {
    await request(app).delete('/agents/nonexistent').expect(404)
  })
})
