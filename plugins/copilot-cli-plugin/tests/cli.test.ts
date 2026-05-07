import { runCli } from '../src/cli';
import { BasecoatPlugin } from '../src/index';
import type { DelegationResult } from '../src/index';

function withMockedIO(fn: () => Promise<void>): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const logs: string[] = [];
    const errors: string[] = [];
    let exitCode = -1;

    const origLog = console.log;
    const origError = console.error;
    const origExit = process.exit;

    const restore = () => {
      console.log = origLog;
      console.error = origError;
      (process as NodeJS.Process).exit = origExit as never;
    };

    console.log = (...msgs: unknown[]) => logs.push(msgs.join(' '));
    console.error = (...msgs: unknown[]) => errors.push(msgs.join(' '));
    (process as NodeJS.Process).exit = ((code: number) => {
      exitCode = code;
      throw new Error(`process.exit(${code})`);
    }) as never;

    fn()
      .catch(() => {/* swallow synthetic exit throws */})
      .finally(() => {
        restore();
        resolve({ exitCode, stdout: logs.join('\n'), stderr: errors.join('\n') });
      });
  });
}

function makeMockPlugin(result: DelegationResult, capturedInputs?: string[]): BasecoatPlugin {
  const plugin = new BasecoatPlugin();
  plugin.invoke = async (rawInput: string): Promise<DelegationResult> => {
    capturedInputs?.push(rawInput);
    return result;
  };
  return plugin;
}

describe('CLI argument parsing', () => {
  it('exits 0 with usage text when no args provided', async () => {
    const { exitCode, stdout } = await withMockedIO(() => runCli([]));
    expect(exitCode).toBe(0);
    expect(stdout).toContain('Usage:');
    expect(stdout).toContain('basecoat <agent-id>');
  });

  it('exits 0 with usage text for --help', async () => {
    const { exitCode, stdout } = await withMockedIO(() => runCli(['--help']));
    expect(exitCode).toBe(0);
    expect(stdout).toContain('Usage:');
  });

  it('exits 0 with usage text for -h', async () => {
    const { exitCode, stdout } = await withMockedIO(() => runCli(['-h']));
    expect(exitCode).toBe(0);
    expect(stdout).toContain('Usage:');
  });

  it('exits 0 with version string for --version', async () => {
    const { exitCode, stdout } = await withMockedIO(() => runCli(['--version']));
    expect(exitCode).toBe(0);
    expect(stdout).toContain('0.1.0');
  });

  it('exits 0 with version string for -v', async () => {
    const { exitCode, stdout } = await withMockedIO(() => runCli(['-v']));
    expect(exitCode).toBe(0);
    expect(stdout).toContain('0.1.0');
  });

  it('calls plugin.invoke with /basecoat prefix for valid args', async () => {
    const capturedInputs: string[] = [];
    const plugin = makeMockPlugin(
      { success: true, output: 'delegate ok', agentId: 'code-review', error: '', duration: 1 },
      capturedInputs,
    );

    const { exitCode } = await withMockedIO(() => runCli(['code-review', 'review this PR'], plugin));
    expect(exitCode).toBe(0);
    expect(capturedInputs).toHaveLength(1);
    expect(capturedInputs[0]).toBe('/basecoat code-review review this PR');
  });

  it('exits 0 and prints output on successful delegation', async () => {
    const plugin = makeMockPlugin({ success: true, output: 'review complete', agentId: 'code-review', error: '', duration: 10 });
    const { exitCode, stdout } = await withMockedIO(() => runCli(['code-review', 'task'], plugin));
    expect(exitCode).toBe(0);
    expect(stdout).toContain('review complete');
  });

  it('exits 1 and prints error on failed delegation', async () => {
    const plugin = makeMockPlugin({ success: false, output: '', agentId: 'code-review', error: 'agent not found', duration: 0 });
    const { exitCode, stderr } = await withMockedIO(() => runCli(['code-review', 'task'], plugin));
    expect(exitCode).toBe(1);
    expect(stderr).toContain('Error: agent not found');
  });

  it('exits 1 and prints fatal on thrown exception', async () => {
    const plugin = new BasecoatPlugin();
    plugin.invoke = async (): Promise<DelegationResult> => {
      throw new Error('network failure');
    };
    const { exitCode, stderr } = await withMockedIO(() => runCli(['code-review', 'task'], plugin));
    expect(exitCode).toBe(1);
    expect(stderr).toContain('Fatal: network failure');
  });

  it('passes extra flags in the raw input string', async () => {
    const capturedInputs: string[] = [];
    const plugin = makeMockPlugin(
      { success: true, output: 'ok', agentId: 'security-analyst', error: '', duration: 1 },
      capturedInputs,
    );
    await withMockedIO(() => runCli(['security-analyst', 'scan src/', '--severity', 'high'], plugin));
    expect(capturedInputs[0]).toBe('/basecoat security-analyst scan src/ --severity high');
  });
});

