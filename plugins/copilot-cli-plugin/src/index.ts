import { DelegationResult, PluginConfig } from './types';

const DEFAULT_CONFIG: PluginConfig = {
  registryUrl: 'https://raw.githubusercontent.com/IBuySpy-Shared/basecoat/main/registry.json',
  cacheTtlMs: 300_000,
  timeoutMs: 30_000,
  maxConcurrency: 4,
};

export class BasecoatPlugin {
  private readonly config: PluginConfig;

  constructor(config?: Partial<PluginConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async invoke(_rawInput: string): Promise<DelegationResult> {
    throw new Error('Not implemented — see issue #477');
  }

  getVersion(): string {
    return '0.1.0';
  }
}

export type { BasecoatCommand, AgentEntry, AgentRegistry, InvocationContext, DelegationResult, PluginConfig } from './types';
