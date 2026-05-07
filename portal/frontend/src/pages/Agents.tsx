import { useState } from 'react';
import type { Agent } from '../types';

const AGENTS: Agent[] = [
  {
    id: 'agent-designer',
    name: 'agent-designer',
    description:
      'Agent that designs and authors Copilot agent definitions. Use when creating new agents, composing skills, writing agent instructions, or coordinating multi-agent workflows.',
    version: '1.0.0',
    tags: ['agents', 'design', 'copilot'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'code-review',
    name: 'code-review',
    description:
      'Use when a task needs a structured, multi-step code review workflow with findings prioritized by severity and file references.',
    version: '1.0.0',
    tags: ['review', 'quality'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'security-analyst',
    name: 'security-analyst',
    description:
      'Security analysis agent for vulnerability assessment, threat modeling, and secure coding review. Use when auditing code for security issues or reviewing dependencies.',
    version: '1.0.0',
    tags: ['security', 'vulnerabilities'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'devops-engineer',
    name: 'devops-engineer',
    description:
      'DevOps engineer agent for CI/CD pipelines, infrastructure as code, container strategy, environment promotion, rollback procedures, and observability.',
    version: '1.0.0',
    tags: ['devops', 'ci-cd', 'infrastructure'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'solution-architect',
    name: 'solution-architect',
    description:
      'Solution architecture agent for system design, C4 diagrams, ADRs, technology selection, and cross-cutting concerns.',
    version: '1.0.0',
    tags: ['architecture', 'design'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Agents() {
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? AGENTS.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase()),
      )
    : AGENTS;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="search"
          placeholder="Search agents…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <span className="text-sm text-gray-500">{filtered.length} agents</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-2"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{agent.name}</h3>
              <span className="shrink-0 text-xs text-gray-400 font-mono">{agent.version}</span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-3">{agent.description}</p>
            <div className="flex flex-wrap gap-1 mt-auto pt-2">
              {agent.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex justify-center py-12 text-sm text-gray-400">
          No agents match your search.
        </div>
      )}
    </div>
  );
}
