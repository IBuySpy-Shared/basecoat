import { parseCommand, CommandParser } from '../src/parser/index';

// ---------------------------------------------------------------------------
// Happy-path tests
// ---------------------------------------------------------------------------

describe('parseCommand — happy paths', () => {
  it('parses a minimal command with a single-word task', () => {
    const result = parseCommand('/basecoat my-agent summarise');
    expect(result.agent).toBe('my-agent');
    expect(result.task).toBe('summarise');
    expect(result.args).toEqual({});
    expect(result.rawInput).toBe('/basecoat my-agent summarise');
  });

  it('parses a command with a multi-word task', () => {
    const result = parseCommand('/basecoat code-review review my pull request');
    expect(result.agent).toBe('code-review');
    expect(result.task).toBe('review my pull request');
    expect(result.args).toEqual({});
  });

  it('parses a command with a single --key value flag', () => {
    const result = parseCommand('/basecoat agent1 do something --env prod');
    expect(result.agent).toBe('agent1');
    expect(result.task).toBe('do something');
    expect(result.args).toEqual({ env: 'prod' });
  });

  it('parses a command with multiple --key value flags', () => {
    const result = parseCommand('/basecoat deploy deploy service --env staging --region east --version 2');
    expect(result.agent).toBe('deploy');
    expect(result.task).toBe('deploy service');
    expect(result.args).toEqual({ env: 'staging', region: 'east', version: '2' });
  });

  it('preserves rawInput verbatim', () => {
    const raw = '/basecoat  my-agent   fix bugs  --dry-run true';
    const result = parseCommand(raw);
    expect(result.rawInput).toBe(raw);
  });

  it('handles extra leading/trailing whitespace', () => {
    const result = parseCommand('   /basecoat agent1 run tests   ');
    expect(result.agent).toBe('agent1');
    expect(result.task).toBe('run tests');
  });

  it('handles extra internal whitespace between tokens', () => {
    const result = parseCommand('/basecoat  agent1   do   the   thing');
    expect(result.agent).toBe('agent1');
    expect(result.task).toBe('do the thing');
  });

  it('accepts a single-character agent-id', () => {
    const result = parseCommand('/basecoat a do task');
    expect(result.agent).toBe('a');
  });

  it('accepts a single-character agent-id that is a digit', () => {
    const result = parseCommand('/basecoat 9 do task');
    expect(result.agent).toBe('9');
  });

  it('accepts agent-id with numbers', () => {
    const result = parseCommand('/basecoat agent123 do task');
    expect(result.agent).toBe('agent123');
  });

  it('accepts agent-id that is purely numeric', () => {
    const result = parseCommand('/basecoat 123 do task');
    expect(result.agent).toBe('123');
  });

  it('parses a quoted single-word task', () => {
    const result = parseCommand('/basecoat agent1 "summarise"');
    expect(result.task).toBe('summarise');
    expect(result.args).toEqual({});
  });

  it('parses a double-quoted multi-word task as a single task token', () => {
    const result = parseCommand('/basecoat agent1 "fix all the bugs" --env prod');
    expect(result.task).toBe('fix all the bugs');
    expect(result.args).toEqual({ env: 'prod' });
  });

  it('parses a single-quoted multi-word task', () => {
    const result = parseCommand("/basecoat agent1 'fix all the bugs' --env prod");
    expect(result.task).toBe('fix all the bugs');
    expect(result.args).toEqual({ env: 'prod' });
  });

  it('accepts a flag value that contains hyphens', () => {
    const result = parseCommand('/basecoat agent1 do task --branch feature-x');
    expect(result.args).toEqual({ branch: 'feature-x' });
  });

  it('accepts a flag value that is a quoted string with spaces', () => {
    const result = parseCommand('/basecoat agent1 do task --message "hello world"');
    expect(result.args).toEqual({ message: 'hello world' });
  });

  it('collects no args when command has no flags', () => {
    const result = parseCommand('/basecoat agent1 do task');
    expect(result.args).toEqual({});
  });

  it('correctly maps task when flags come immediately after agent-id', () => {
    // No task words — should throw (tested in error section)
    // But flags after a task token are fine.
    const result = parseCommand('/basecoat agent1 go --dry-run true');
    expect(result.task).toBe('go');
    expect(result.args).toEqual({ 'dry-run': 'true' });
  });

  it('flag name with internal hyphen is accepted', () => {
    const result = parseCommand('/basecoat agent1 do task --dry-run true');
    expect(result.args['dry-run']).toBe('true');
  });
});

// ---------------------------------------------------------------------------
// Error cases
// ---------------------------------------------------------------------------

describe('parseCommand — error cases', () => {
  it('throws on empty string', () => {
    expect(() => parseCommand('')).toThrow(/empty/i);
  });

  it('throws on whitespace-only input', () => {
    expect(() => parseCommand('   ')).toThrow(/empty/i);
  });

  it('throws when command does not start with /basecoat', () => {
    expect(() => parseCommand('/other agent1 do task')).toThrow(/must start with \/basecoat/i);
  });

  it('throws when no agent-id is provided', () => {
    expect(() => parseCommand('/basecoat')).toThrow(/missing agent-id/i);
  });

  it('throws when agent-id is whitespace only (just spaces after /basecoat)', () => {
    expect(() => parseCommand('/basecoat   ')).toThrow(/missing agent-id/i);
  });

  it('throws when agent-id starts with a hyphen', () => {
    expect(() => parseCommand('/basecoat -bad do task')).toThrow(/invalid agent-id/i);
  });

  it('throws when agent-id ends with a hyphen', () => {
    expect(() => parseCommand('/basecoat bad- do task')).toThrow(/invalid agent-id/i);
  });

  it('throws when agent-id contains uppercase letters', () => {
    expect(() => parseCommand('/basecoat MyAgent do task')).toThrow(/invalid agent-id/i);
  });

  it('throws when agent-id contains special characters', () => {
    expect(() => parseCommand('/basecoat agent_1 do task')).toThrow(/invalid agent-id/i);
  });

  it('throws when task is empty (only flags after agent-id)', () => {
    expect(() => parseCommand('/basecoat agent1 --env prod')).toThrow(/task description is required/i);
  });

  it('throws when task is missing entirely', () => {
    expect(() => parseCommand('/basecoat agent1')).toThrow(/task description is required/i);
  });

  it('throws on a flag that is missing its value at end of input', () => {
    expect(() => parseCommand('/basecoat agent1 do task --env')).toThrow(/requires a value/i);
  });

  it('throws on two consecutive flags (second flag used as value)', () => {
    expect(() => parseCommand('/basecoat agent1 do task --env --region')).toThrow(/requires a value/i);
  });

  it('throws on a malformed flag (no second dash)', () => {
    expect(() => parseCommand('/basecoat agent1 do task -e prod')).toThrow(/malformed flag/i);
  });

  it('throws on a malformed flag (uppercase letter in flag name)', () => {
    expect(() => parseCommand('/basecoat agent1 do task --Env prod')).toThrow(/malformed flag/i);
  });

  it('throws on an unterminated double-quoted string', () => {
    expect(() => parseCommand('/basecoat agent1 "fix the bug')).toThrow(/unterminated quoted string/i);
  });

  it('throws on an unterminated single-quoted string', () => {
    expect(() => parseCommand("/basecoat agent1 'fix the bug")).toThrow(/unterminated quoted string/i);
  });
});

// ---------------------------------------------------------------------------
// CommandParser class (backwards-compatibility wrapper)
// ---------------------------------------------------------------------------

describe('CommandParser class', () => {
  const parser = new CommandParser();

  it('parse() delegates to parseCommand', () => {
    const result = parser.parse('/basecoat agent1 do task --env prod');
    expect(result.agent).toBe('agent1');
    expect(result.task).toBe('do task');
    expect(result.args).toEqual({ env: 'prod' });
  });

  it('parse() propagates errors', () => {
    expect(() => parser.parse('')).toThrow();
  });
});
