export interface Agent {
  id: string
  name: string
  description: string
  tool_ids: string[]
  status: 'active' | 'inactive'
  config: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Tool {
  id: string
  name: string
  description: string
  schema: Record<string, unknown>
  created_at: string
}

export interface ExecutionContext {
  id: string
  agent_id: string
  input: Record<string, unknown>
  output: Record<string, unknown> | null
  status: 'pending' | 'running' | 'completed' | 'failed'
  error: string | null
  created_at: string
  started_at: string | null
  completed_at: string | null
}

export type CreateAgentPayload = Pick<Agent, 'name' | 'description' | 'tool_ids' | 'config'>
export type UpdateAgentPayload = Partial<Pick<Agent, 'name' | 'description' | 'tool_ids' | 'status' | 'config'>>
export type CreateToolPayload = Pick<Tool, 'name' | 'description' | 'schema'>
export type CreateExecutionPayload = { agent_id: string; input: Record<string, unknown> }
