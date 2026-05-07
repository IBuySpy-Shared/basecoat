import { BasecoatCommand, InvocationContext } from '../types';

function mapPlatform(platform: string): string {
  if (platform === 'win32') return 'Windows';
  if (platform === 'darwin') return 'macOS';
  if (platform === 'linux') return 'Linux';
  return platform;
}

function detectShell(): string {
  if (process.env['SHELL']) return process.env['SHELL'];
  if (process.env['ComSpec']) return process.env['ComSpec'];
  return 'unknown';
}

export function buildContext(
  command: BasecoatCommand,
  metadata: Record<string, unknown> = {},
): InvocationContext {
  return {
    command,
    environment: {
      os: mapPlatform(process.platform),
      shell: detectShell(),
      cwd: process.cwd(),
      timestamp: new Date().toISOString(),
    },
    metadata,
  };
}

export class ContextBuilder {
  build(command: BasecoatCommand, metadata?: Record<string, unknown>): InvocationContext {
    return buildContext(command, metadata);
  }
}

