import { BasecoatPlugin } from '../src/index';

describe('BasecoatPlugin', () => {
  it('instantiates with default config', () => {
    const plugin = new BasecoatPlugin();
    expect(plugin).toBeDefined();
  });

  it('returns version string', () => {
    const plugin = new BasecoatPlugin();
    expect(plugin.getVersion()).toBe('0.1.0');
  });
});

describe('BasecoatPlugin.invoke() e2e', () => {
  let plugin: BasecoatPlugin;

  beforeEach(() => {
    plugin = new BasecoatPlugin();
  });

  it('delegates a valid command successfully', async () => {
    const result = await plugin.invoke('/basecoat code-review review this PR');
    expect(result.success).toBe(true);
    expect(result.agentId).toBe('code-review');
  });

  it('returns failure for unknown agent', async () => {
    const result = await plugin.invoke('/basecoat nonexistent-xyz do task');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/not found/i);
  });

  it('returns failure for input without /basecoat prefix', async () => {
    const result = await plugin.invoke('bad input no slash');
    expect(result.success).toBe(false);
  });

  it('returns failure for empty input', async () => {
    const result = await plugin.invoke('');
    expect(result.success).toBe(false);
  });
});
