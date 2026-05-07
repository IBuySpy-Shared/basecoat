/**
 * Integration tests for BasecoatPlugin.
 *
 * These tests exercise the full pipeline:
 *   parseCommand → buildContext → findAgent → delegate
 *
 * No mocks are used — the real in-memory delegation engine runs.
 */

import { BasecoatPlugin } from '../src/index';
import { DelegationEngine } from '../src/delegation/index';
import { parseCommand } from '../src/parser/index';
import { buildContext } from '../src/context/index';

describe('BasecoatPlugin.invoke() — full pipeline integration', () => {
  let plugin: BasecoatPlugin;

  beforeEach(() => {
    plugin = new BasecoatPlugin();
  });

  it('delegates /basecoat code-review successfully with correct agentId and positive duration', async () => {
    const result = await plugin.invoke('/basecoat code-review review this PR');

    expect(result.success).toBe(true);
    expect(result.agentId).toBe('code-review');
    expect(result.duration).toBeGreaterThan(0);
  });

  it('delegates /basecoat security-analyst successfully', async () => {
    const result = await plugin.invoke('/basecoat security-analyst scan for vulnerabilities');

    expect(result.success).toBe(true);
    expect(result.agentId).toBe('security-analyst');
    expect(result.duration).toBeGreaterThan(0);
  });

  it('returns failure for a nonexistent agent with error containing "not found"', async () => {
    const result = await plugin.invoke('/basecoat nonexistent-xyz-agent do task');

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
  });

  it('returns failure when the /basecoat prefix is missing', async () => {
    const result = await plugin.invoke('missing slash');

    expect(result.success).toBe(false);
  });

  it('returns failure for empty string input', async () => {
    const result = await plugin.invoke('');

    expect(result.success).toBe(false);
  });

  it('still works correctly with a custom timeoutMs config override', async () => {
    const customPlugin = new BasecoatPlugin({ timeoutMs: 5000 });

    const result = await customPlugin.invoke('/basecoat code-review review PR');

    expect(result.success).toBe(true);
    expect(result.agentId).toBe('code-review');
  });
});

describe('DelegationEngine — streaming via onChunk callback', () => {
  it('delivers streamed output chunks for a successful delegation', async () => {
    const engine = new DelegationEngine();
    const command = parseCommand('/basecoat code-review review PR');
    const context = buildContext(command);
    const chunks: string[] = [];

    const result = await engine.delegate(command, context, {
      onChunk: (chunk: string) => chunks.push(chunk),
    });

    expect(result.success).toBe(true);
    expect(result.agentId).toBe('code-review');
    expect(chunks.length).toBeGreaterThan(0);
    chunks.forEach((c) => expect(typeof c).toBe('string'));
  });
});
