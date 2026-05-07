import * as fs from 'fs';
import * as path from 'path';
import { AgentEntry, AgentRegistry } from '../types';

const DEFAULT_REGISTRY_PATH = path.resolve(__dirname, '../../schema/basecoat-registry.json');
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  registry: AgentRegistry;
  loadedAt: number;
  filePath: string;
}

interface RawAgent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  keywords: string[];
}

interface RawRegistry {
  version: string;
  generated: string;
  agents: Record<string, RawAgent>;
}

let cache: CacheEntry | null = null;

function parseRegistry(raw: RawRegistry): AgentRegistry {
  const agents = new Map<string, AgentEntry>();
  for (const [id, agent] of Object.entries(raw.agents)) {
    agents.set(id, {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      capabilities: agent.capabilities ?? [],
      keywords: agent.keywords ?? [],
    });
  }
  return {
    version: raw.version,
    agents,
    lastUpdated: new Date(raw.generated),
  };
}

export function loadRegistry(registryPath?: string): AgentRegistry {
  const filePath = registryPath ?? DEFAULT_REGISTRY_PATH;
  const now = Date.now();
  if (cache && cache.filePath === filePath && now - cache.loadedAt < CACHE_TTL_MS) {
    return cache.registry;
  }
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RawRegistry;
  const registry = parseRegistry(raw);
  cache = { registry, loadedAt: now, filePath };
  return registry;
}

export function findAgent(id: string, registry?: AgentRegistry): AgentEntry | undefined {
  const reg = registry ?? loadRegistry();
  return reg.agents.get(id);
}

export function searchAgents(query: string, registry?: AgentRegistry): AgentEntry[] {
  const reg = registry ?? loadRegistry();
  const q = query.toLowerCase();
  const results: AgentEntry[] = [];
  for (const agent of reg.agents.values()) {
    if (
      agent.id.toLowerCase().includes(q) ||
      agent.name.toLowerCase().includes(q) ||
      agent.description.toLowerCase().includes(q)
    ) {
      results.push(agent);
    }
  }
  return results;
}

export function clearCache(): void {
  cache = null;
}

export class AgentRegistryLoader {
  private readonly registryPath?: string;

  constructor(registryPath?: string) {
    this.registryPath = registryPath;
  }

  async load(): Promise<AgentRegistry> {
    return loadRegistry(this.registryPath);
  }
}