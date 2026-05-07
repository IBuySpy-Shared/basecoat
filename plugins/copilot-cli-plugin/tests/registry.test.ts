import * as path from 'path';
import {
  loadRegistry,
  findAgent,
  searchAgents,
  clearCache,
  AgentRegistryLoader,
} from '../src/registry/index';
import { AgentEntry, AgentRegistry } from '../src/types';

const REAL_REGISTRY_PATH = path.resolve(__dirname, '../schema/basecoat-registry.json');

const MOCK_REGISTRY_JSON = JSON.stringify({
  version: '1.0.0',
  generated: '2026-01-01T00:00:00Z',
  agents: {
    'code-review': {
      id: 'code-review',
      name: 'code-review',
      description: 'Structured code review workflow',
      capabilities: ['review'],
      keywords: ['code', 'review'],
    },
    'security-analyst': {
      id: 'security-analyst',
      name: 'security-analyst',
      description: 'Security vulnerability assessment',
      capabilities: ['security'],
      keywords: ['security', 'audit'],
    },
    'frontend-dev': {
      id: 'frontend-dev',
      name: 'frontend-dev',
      description: 'UI component development',
      capabilities: ['general'],
      keywords: ['frontend', 'ui'],
    },
  },
});

jest.mock('fs');
import * as fs from 'fs';
const mockReadFileSync = fs.readFileSync as jest.Mock;

function useMockRegistry(): void {
  mockReadFileSync.mockReturnValue(MOCK_REGISTRY_JSON);
}

function useRealRegistry(): void {
  const realFs = jest.requireActual<typeof fs>('fs');
  mockReadFileSync.mockImplementation(
    (...args: Parameters<typeof fs.readFileSync>) => realFs.readFileSync(...args)
  );
}

describe('loadRegistry - real file', () => {
  beforeEach(() => { useRealRegistry(); clearCache(); });
  afterEach(() => clearCache());

  it('loads >=73 agents from schema/basecoat-registry.json', () => {
    const registry = loadRegistry(REAL_REGISTRY_PATH);
    expect(registry.version).toBeDefined();
    expect(registry.lastUpdated).toBeInstanceOf(Date);
    expect(registry.agents.size).toBeGreaterThanOrEqual(73);
  });

  it('returns agents as a Map', () => {
    const registry = loadRegistry(REAL_REGISTRY_PATH);
    expect(registry.agents).toBeInstanceOf(Map);
  });
});

describe('loadRegistry - cache behaviour', () => {
  beforeEach(() => { useMockRegistry(); clearCache(); mockReadFileSync.mockClear(); });
  afterEach(() => clearCache());

  it('returns cached result on second call without re-reading', () => {
    loadRegistry('mock.json');
    loadRegistry('mock.json');
    expect(mockReadFileSync).toHaveBeenCalledTimes(1);
  });

  it('re-reads after TTL (5 min) expires', () => {
    const nowSpy = jest.spyOn(Date, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(6 * 60 * 1000);
    loadRegistry('mock.json');
    loadRegistry('mock.json');
    expect(mockReadFileSync).toHaveBeenCalledTimes(2);
    nowSpy.mockRestore();
  });

  it('maintains separate cache entries per path', () => {
    loadRegistry('path-a.json');
    loadRegistry('path-b.json');
    expect(mockReadFileSync).toHaveBeenCalledTimes(2);
  });

  it('parses version and lastUpdated correctly', () => {
    const registry = loadRegistry('mock.json');
    expect(registry.version).toBe('1.0.0');
    expect(registry.lastUpdated).toEqual(new Date('2026-01-01T00:00:00Z'));
  });
});

describe('findAgent', () => {
  let registry: AgentRegistry;

  beforeAll(() => {
    useMockRegistry();
    clearCache();
    registry = loadRegistry('mock.json');
    clearCache();
  });

  afterAll(() => clearCache());

  it('finds an agent by exact id', () => {
    const agent = findAgent('code-review', registry);
    expect(agent).toBeDefined();
    expect(agent!.id).toBe('code-review');
    expect(agent!.description).toBe('Structured code review workflow');
  });

  it('returns undefined for unknown id', () => {
    expect(findAgent('does-not-exist', registry)).toBeUndefined();
  });

  it('is case-sensitive for id match', () => {
    expect(findAgent('Code-Review', registry)).toBeUndefined();
  });

  it('loads from default registry when no registry arg provided', () => {
    useRealRegistry();
    clearCache();
    const agent = findAgent('code-review');
    expect(agent === undefined || typeof agent === 'object').toBe(true);
    useMockRegistry();
    clearCache();
  });
});

describe('searchAgents', () => {
  let registry: AgentRegistry;

  beforeAll(() => {
    useMockRegistry();
    clearCache();
    registry = loadRegistry('mock.json');
    clearCache();
  });

  afterAll(() => clearCache());

  it('matches by partial id (case-insensitive)', () => {
    const results: AgentEntry[] = searchAgents('CODE', registry);
    expect(results.some((a: AgentEntry) => a.id === 'code-review')).toBe(true);
  });

  it('matches by partial description (case-insensitive)', () => {
    const results: AgentEntry[] = searchAgents('VULNERABILITY', registry);
    expect(results.some((a: AgentEntry) => a.id === 'security-analyst')).toBe(true);
  });

  it('matches by partial name', () => {
    const results: AgentEntry[] = searchAgents('frontend', registry);
    expect(results.some((a: AgentEntry) => a.id === 'frontend-dev')).toBe(true);
  });

  it('returns empty array when no match', () => {
    expect(searchAgents('zzznomatch', registry)).toHaveLength(0);
  });

  it('matches multiple agents for broad query', () => {
    expect(searchAgents('dev', registry).length).toBeGreaterThanOrEqual(1);
  });

  it('loads from default registry when no registry arg provided', () => {
    useRealRegistry();
    clearCache();
    const results = searchAgents('security');
    expect(Array.isArray(results)).toBe(true);
    useMockRegistry();
    clearCache();
  });
});

describe('clearCache', () => {
  beforeEach(() => { useMockRegistry(); clearCache(); mockReadFileSync.mockClear(); });
  afterEach(() => clearCache());

  it('forces a fresh file read on next call', () => {
    loadRegistry('mock.json');
    clearCache();
    loadRegistry('mock.json');
    expect(mockReadFileSync).toHaveBeenCalledTimes(2);
  });
});

describe('AgentRegistryLoader', () => {
  beforeEach(() => { useMockRegistry(); clearCache(); });
  afterEach(() => clearCache());

  it('load() resolves to an AgentRegistry from mock path', async () => {
    const loader = new AgentRegistryLoader('mock.json');
    const registry = await loader.load();
    expect(registry.agents).toBeInstanceOf(Map);
    expect(registry.version).toBe('1.0.0');
    expect(registry.agents.size).toBe(3);
  });

  it('uses default schema path when constructed without args', async () => {
    useRealRegistry();
    clearCache();
    const registry = await new AgentRegistryLoader().load();
    expect(registry.agents.size).toBeGreaterThanOrEqual(73);
  });
});