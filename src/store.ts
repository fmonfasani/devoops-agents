import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Agent, Tool, ExecutionContext } from './types.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_DATA_DIR = path.resolve(__dirname, '..', 'data')

function dataDir(): string {
  return process.env.DATA_DIR || DEFAULT_DATA_DIR
}

function ensureDir(): void {
  const dir = dataDir()
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function readJSON<T>(filename: string, fallback: T): T {
  const filepath = path.join(dataDir(), filename)
  if (!fs.existsSync(filepath)) return fallback
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as T
  } catch {
    return fallback
  }
}

function writeJSON<T>(filename: string, data: T): void {
  ensureDir()
  const filepath = path.join(dataDir(), filename)
  const tmp = filepath + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8')
  fs.renameSync(tmp, filepath)
}

export function loadAgents(): Agent[] {
  return readJSON<Agent[]>('agents.json', [])
}

export function saveAgents(agents: Agent[]): void {
  writeJSON('agents.json', agents)
}

export function loadTools(): Tool[] {
  return readJSON<Tool[]>('tools.json', [])
}

export function saveTools(tools: Tool[]): void {
  writeJSON('tools.json', tools)
}

export function loadExecutions(): ExecutionContext[] {
  return readJSON<ExecutionContext[]>('executions.json', [])
}

export function saveExecutions(executions: ExecutionContext[]): void {
  writeJSON('executions.json', executions)
}
