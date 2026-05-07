import { buildContext, ContextBuilder } from '../src/context/index';
import { BasecoatCommand } from '../src/types';

const sampleCommand: BasecoatCommand = {
  agent: 'test-agent',
  task: 'do-something',
  args: { key: 'value' },
  rawInput: '/basecoat test-agent do-something key=value',
};

describe('buildContext', () => {
  describe('platform mapping', () => {
    const originalPlatform = process.platform;

    afterEach(() => {
      Object.defineProperty(process, 'platform', { value: originalPlatform, configurable: true });
    });

    it('maps win32 to Windows', () => {
      Object.defineProperty(process, 'platform', { value: 'win32', configurable: true });
      const ctx = buildContext(sampleCommand);
      expect(ctx.environment.os).toBe('Windows');
    });

    it('maps darwin to macOS', () => {
      Object.defineProperty(process, 'platform', { value: 'darwin', configurable: true });
      const ctx = buildContext(sampleCommand);
      expect(ctx.environment.os).toBe('macOS');
    });

    it('maps linux to Linux', () => {
      Object.defineProperty(process, 'platform', { value: 'linux', configurable: true });
      const ctx = buildContext(sampleCommand);
      expect(ctx.environment.os).toBe('Linux');
    });

    it('passes through unknown platforms verbatim', () => {
      Object.defineProperty(process, 'platform', { value: 'freebsd', configurable: true });
      const ctx = buildContext(sampleCommand);
      expect(ctx.environment.os).toBe('freebsd');
    });
  });

  describe('shell detection', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('uses SHELL env var when present', () => {
      process.env['SHELL'] = '/bin/zsh';
      delete process.env['ComSpec'];
      const ctx = buildContext(sampleCommand);
      expect(ctx.environment.shell).toBe('/bin/zsh');
    });

    it('uses ComSpec when SHELL is absent (Windows)', () => {
      delete process.env['SHELL'];
      process.env['ComSpec'] = 'C:\\Windows\\System32\\cmd.exe';
      const ctx = buildContext(sampleCommand);
      expect(ctx.environment.shell).toBe('C:\\Windows\\System32\\cmd.exe');
    });

    it('falls back to "unknown" when neither SHELL nor ComSpec is set', () => {
      delete process.env['SHELL'];
      delete process.env['ComSpec'];
      const ctx = buildContext(sampleCommand);
      expect(ctx.environment.shell).toBe('unknown');
    });

    it('prefers SHELL over ComSpec when both are set', () => {
      process.env['SHELL'] = '/bin/bash';
      process.env['ComSpec'] = 'C:\\Windows\\System32\\cmd.exe';
      const ctx = buildContext(sampleCommand);
      expect(ctx.environment.shell).toBe('/bin/bash');
    });
  });

  describe('environment fields', () => {
    it('sets cwd to process.cwd()', () => {
      const ctx = buildContext(sampleCommand);
      expect(ctx.environment.cwd).toBe(process.cwd());
    });

    it('sets timestamp as ISO 8601 string', () => {
      const before = Date.now();
      const ctx = buildContext(sampleCommand);
      const after = Date.now();
      const ts = new Date(ctx.environment.timestamp).getTime();
      expect(ctx.environment.timestamp).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
      expect(ts).toBeGreaterThanOrEqual(before);
      expect(ts).toBeLessThanOrEqual(after);
    });
  });

  describe('command passthrough', () => {
    it('includes the supplied command unchanged', () => {
      const ctx = buildContext(sampleCommand);
      expect(ctx.command).toEqual(sampleCommand);
    });
  });

  describe('metadata', () => {
    it('defaults to empty object when not provided', () => {
      const ctx = buildContext(sampleCommand);
      expect(ctx.metadata).toEqual({});
    });

    it('merges provided metadata into context', () => {
      const ctx = buildContext(sampleCommand, { source: 'cli', retries: 3 });
      expect(ctx.metadata).toEqual({ source: 'cli', retries: 3 });
    });
  });
});

describe('ContextBuilder', () => {
  it('build() delegates to buildContext', () => {
    const builder = new ContextBuilder();
    const ctx = builder.build(sampleCommand, { via: 'builder' });
    expect(ctx.command).toEqual(sampleCommand);
    expect(ctx.metadata).toEqual({ via: 'builder' });
  });

  it('build() works without metadata argument', () => {
    const builder = new ContextBuilder();
    const ctx = builder.build(sampleCommand);
    expect(ctx.metadata).toEqual({});
  });
});
