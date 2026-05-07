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
