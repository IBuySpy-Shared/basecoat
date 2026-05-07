import { BasecoatCommand } from '../types';

// Lowercase alphanumeric with internal hyphens, no leading/trailing hyphens.
const AGENT_ID_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

// Flag names: lowercase letter followed by lowercase alphanumeric/hyphens.
const FLAG_NAME_RE = /^--([a-z][a-z0-9-]*)$/;

/**
 * Tokenise a string respecting double- and single-quoted segments.
 * Throws if a quoted segment is never closed.
 */
function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let i = 0;

  while (i < input.length) {
    // Skip whitespace.
    while (i < input.length && /\s/.test(input[i])) i++;
    if (i >= input.length) break;

    const ch = input[i];

    if (ch === '"' || ch === "'") {
      const close = ch;
      i++;
      let token = '';
      while (i < input.length && input[i] !== close) token += input[i++];
      if (i >= input.length) throw new Error('Unterminated quoted string');
      i++; // skip closing quote
      tokens.push(token);
    } else {
      let token = '';
      while (i < input.length && !/\s/.test(input[i])) token += input[i++];
      tokens.push(token);
    }
  }

  return tokens;
}

/**
 * Parse raw CLI input of the form:
 *   /basecoat <agent-id> <task description> [--key value ...]
 */
export function parseCommand(rawInput: string): BasecoatCommand {
  if (!rawInput || !rawInput.trim()) {
    throw new Error('Input is empty. Usage: /basecoat <agent-id> <task> [--key value ...]');
  }

  const trimmed = rawInput.trim();

  if (!trimmed.startsWith('/basecoat')) {
    throw new Error('Command must start with /basecoat. Usage: /basecoat <agent-id> <task> [--key value ...]');
  }

  const body = trimmed.slice('/basecoat'.length).trim();

  if (!body) {
    throw new Error('Missing agent-id. Usage: /basecoat <agent-id> <task> [--key value ...]');
  }

  const tokens = tokenize(body);

  if (tokens.length === 0) {
    throw new Error('Missing agent-id. Usage: /basecoat <agent-id> <task> [--key value ...]');
  }

  const agentId = tokens[0];

  if (!AGENT_ID_RE.test(agentId)) {
    throw new Error(
      `Invalid agent-id "${agentId}": must be lowercase alphanumeric characters and hyphens, ` +
        'cannot start or end with a hyphen.',
    );
  }

  // Split remaining tokens into task words (before any flag) and flag pairs.
  const rest = tokens.slice(1);
  const taskTokens: string[] = [];
  const args: Record<string, string> = {};

  let i = 0;

  // Collect task words until the first token that looks like a flag (starts with '-').
  while (i < rest.length && !rest[i].startsWith('-')) {
    taskTokens.push(rest[i]);
    i++;
  }

  // Parse --key value pairs.
  while (i < rest.length) {
    const flagToken = rest[i];
    const match = FLAG_NAME_RE.exec(flagToken);

    if (!match) {
      throw new Error(
        `Malformed flag "${flagToken}": flags must be in the form --key (lowercase, no spaces).`,
      );
    }

    const key = match[1];
    i++;

    if (i >= rest.length || rest[i].startsWith('--')) {
      throw new Error(`Flag "--${key}" requires a value but none was provided.`);
    }

    args[key] = rest[i];
    i++;
  }

  const task = taskTokens.join(' ');

  if (!task) {
    throw new Error('Task description is required. Usage: /basecoat <agent-id> <task> [--key value ...]');
  }

  return { agent: agentId, task, args, rawInput };
}

/** Class wrapper kept for backwards compatibility. */
export class CommandParser {
  parse(rawInput: string): BasecoatCommand {
    return parseCommand(rawInput);
  }
}

