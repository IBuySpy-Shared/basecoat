import { BasecoatCommand, InvocationContext, DelegationResult, AgentEntry } from '../types';

export interface DelegationOptions {
  timeoutMs?: number;
  maxRetries?: number;
  onChunk?: (chunk: string) => void;
}

const DEFAULT_OPTIONS: Required<Omit<DelegationOptions, 'onChunk'>> = {
  timeoutMs: 30_000,
  maxRetries: 2,
};

// Simulated in-memory agent registry for delegation (stub layer — no real Copilot API).
const KNOWN_AGENTS: AgentEntry[] = [
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Structured multi-step code review',
    capabilities: ['review', 'diff'],
    keywords: ['review', 'code'],
  },
  {
    id: 'security-analyst',
    name: 'Security Analyst',
    description: 'Vulnerability assessment and secure coding review',
    capabilities: ['audit', 'scan'],
    keywords: ['security', 'vulnerability'],
  },
  {
    id: 'tech-writer',
    name: 'Tech Writer',
    description: 'Technical documentation authoring',
    capabilities: ['document', 'write'],
    keywords: ['docs', 'documentation'],
  },
];

function findAgent(agentId: string): AgentEntry | undefined {
  return KNOWN_AGENTS.find((a) => a.id === agentId);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildTimeoutPromise(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    const t = setTimeout(() => reject(new Error(`Delegation timed out after ${ms}ms`)), ms);
    t.unref();
  });
}

async function simulateDelegation(
  agent: AgentEntry,
  command: BasecoatCommand,
  context: InvocationContext,
  onChunk?: (chunk: string) => void,
): Promise<string> {
  const shell = context.environment.shell ?? 'unknown';
  const lines = [
    `[${agent.name}] Received task: ${command.task}`,
    `[${agent.name}] Environment: ${shell}`,
    `[${agent.name}] Applying capabilities: ${agent.capabilities.join(', ')}`,
    `[${agent.name}] Processing arguments: ${JSON.stringify(command.args)}`,
    `[${agent.name}] Delegation complete.`,
  ];

  const chunks = lines.slice(0, Math.min(5, Math.max(3, lines.length)));
  const output: string[] = [];

  for (const chunk of chunks) {
    await sleep(10);
    output.push(chunk);
    onChunk?.(chunk);
  }

  return output.join('\n');
}

export async function delegate(
  command: BasecoatCommand,
  context: InvocationContext,
  options: DelegationOptions = {},
): Promise<DelegationResult> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_OPTIONS.timeoutMs;
  const maxRetries = options.maxRetries ?? DEFAULT_OPTIONS.maxRetries;
  const { onChunk } = options;

  const agentId = command.agent;
  const agent = findAgent(agentId);

  if (!agent) {
    return {
      success: false,
      output: '',
      agentId,
      duration: 0,
      error: `Agent not found: ${agentId}`,
    };
  }

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      await sleep(100 * Math.pow(2, attempt - 1));
    }

    const start = Date.now();

    try {
      const output = await Promise.race([
        simulateDelegation(agent, command, context, onChunk),
        buildTimeoutPromise(timeoutMs),
      ]);

      return {
        success: true,
        output,
        agentId,
        duration: Date.now() - start,
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      if (error.message.startsWith('Delegation timed out')) {
        return {
          success: false,
          output: '',
          agentId,
          duration: Date.now() - start,
          error: error.message,
        };
      }

      lastError = error;
    }
  }

  return {
    success: false,
    output: '',
    agentId,
    duration: 0,
    error: lastError?.message ?? 'Unknown delegation error',
  };
}

export class DelegationEngine {
  private readonly defaults: Required<Omit<DelegationOptions, 'onChunk'>>;

  constructor(defaults: Partial<Omit<DelegationOptions, 'onChunk'>> = {}) {
    this.defaults = {
      timeoutMs: defaults.timeoutMs ?? DEFAULT_OPTIONS.timeoutMs,
      maxRetries: defaults.maxRetries ?? DEFAULT_OPTIONS.maxRetries,
    };
  }

  async delegate(
    command: BasecoatCommand,
    context: InvocationContext,
    options: DelegationOptions = {},
  ): Promise<DelegationResult> {
    return delegate(command, context, { ...this.defaults, ...options });
  }
}

// Legacy-compatible class kept for backward compatibility with existing callers.
export class AgentDelegator {
  async delegate(context: InvocationContext): Promise<DelegationResult> {
    return delegate(context.command, context);
  }
}