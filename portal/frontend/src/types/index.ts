export interface Agent {
  id: string;
  name: string;
  description: string;
  version: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Repository {
  id: string;
  name: string;
  url: string;
  description?: string;
  owner: string;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
}

export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Scan {
  id: string;
  repositoryId: string;
  repository?: Repository;
  status: ScanStatus;
  branch: string;
  commitSha: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ScanResultSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface ScanResult {
  id: string;
  scanId: string;
  filePath: string;
  lineNumber: number | null;
  severity: ScanResultSeverity;
  ruleId: string;
  message: string;
  snippet: string | null;
  createdAt: string;
}

export type UserRole = 'admin' | 'user' | 'viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
