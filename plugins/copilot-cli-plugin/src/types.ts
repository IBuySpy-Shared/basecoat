export interface BasecoatCommand {
  agent: string;
  task: string;
  args: Record<string, string>;
  rawInput: string;
}

export interface AgentEntry {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  keywords: string[];
}

export interface AgentRegistry {
  agents: Map<string, AgentEntry>;
  version: string;
  lastUpdated: Date;
}

export interface InvocationContext {
  command: BasecoatCommand;
  environment: {
    os: string;
    shell: string;
    cwd: string;
    timestamp: string;
  };
  metadata: Record<string, unknown>;
}

export interface DelegationResult {
  success: boolean;
  output: string;
  error?: string;
  agentId: string;
  duration: number;
}

export interface PluginConfig {
  registryUrl: string;
  cacheTtlMs: number;
  timeoutMs: number;
  maxConcurrency: number;
}
