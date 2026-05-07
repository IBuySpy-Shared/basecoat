import { Sequelize, DataTypes } from 'sequelize';
import { User, initUser } from '../src/models/User';
import { Repository, initRepository } from '../src/models/Repository';
import { Scan, initScan } from '../src/models/Scan';
import { ScanResult, initScanResult } from '../src/models/ScanResult';
import { AuditLog, initAuditLog } from '../src/models/AuditLog';

let testSequelize: Sequelize;

function setupAssociations(): void {
  Repository.hasMany(Scan, { foreignKey: 'repositoryId', as: 'scans' });
  Scan.belongsTo(Repository, { foreignKey: 'repositoryId', as: 'repository' });
  Scan.hasMany(ScanResult, { foreignKey: 'scanId', as: 'results' });
  ScanResult.belongsTo(Scan, { foreignKey: 'scanId', as: 'scan' });
  User.hasMany(Scan, { foreignKey: 'triggeredBy', as: 'triggeredScans' });
  Scan.belongsTo(User, { foreignKey: 'triggeredBy', as: 'triggeredByUser' });
  User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs' });
  AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
}

beforeAll(async () => {
  testSequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });

  initUser(testSequelize);
  initRepository(testSequelize);
  initScan(testSequelize);
  initScanResult(testSequelize);
  initAuditLog(testSequelize);
  setupAssociations();

  await testSequelize.sync({ force: true });
});

afterAll(async () => {
  await testSequelize.close();
});

describe('User model', () => {
  it('has expected attributes', () => {
    const attrs = User.getAttributes();
    expect(attrs).toHaveProperty('id');
    expect(attrs).toHaveProperty('githubId');
    expect(attrs).toHaveProperty('username');
    expect(attrs).toHaveProperty('email');
    expect(attrs).toHaveProperty('avatarUrl');
    expect(attrs).toHaveProperty('role');
  });

  it('id is UUID type', () => {
    const attrs = User.getAttributes();
    expect(attrs.id.type).toBeInstanceOf(DataTypes.UUID);
  });

  it('role defaults to viewer', () => {
    const attrs = User.getAttributes();
    expect(attrs.role.defaultValue).toBe('viewer');
  });

  it('can create and retrieve a user', async () => {
    const user = await User.create({
      githubId: 'gh-001',
      username: 'alice',
      email: 'alice@example.com',
      avatarUrl: null,
      role: 'admin',
    });
    expect(user.id).toBeDefined();
    expect(user.username).toBe('alice');
    expect(user.role).toBe('admin');
  });

  it('githubId is unique', async () => {
    await User.create({ githubId: 'gh-unique', username: 'bob', email: null, avatarUrl: null });
    await expect(
      User.create({ githubId: 'gh-unique', username: 'carol', email: null, avatarUrl: null })
    ).rejects.toThrow();
  });
});

describe('Repository model', () => {
  it('has expected attributes', () => {
    const attrs = Repository.getAttributes();
    expect(attrs).toHaveProperty('id');
    expect(attrs).toHaveProperty('githubId');
    expect(attrs).toHaveProperty('owner');
    expect(attrs).toHaveProperty('name');
    expect(attrs).toHaveProperty('fullName');
    expect(attrs).toHaveProperty('isPrivate');
  });

  it('isPrivate defaults to false', () => {
    const attrs = Repository.getAttributes();
    expect(attrs.isPrivate.defaultValue).toBe(false);
  });

  it('can create and retrieve a repository', async () => {
    const repo = await Repository.create({
      githubId: 12345,
      owner: 'IBuySpy-Shared',
      name: 'basecoat',
      fullName: 'IBuySpy-Shared/basecoat',
    });
    expect(repo.id).toBeDefined();
    expect(repo.fullName).toBe('IBuySpy-Shared/basecoat');
    expect(repo.isPrivate).toBe(false);
  });
});

describe('Scan model', () => {
  let repoId: string;

  beforeAll(async () => {
    const repo = await Repository.create({
      githubId: 99999,
      owner: 'test-org',
      name: 'test-repo',
      fullName: 'test-org/test-repo',
    });
    repoId = repo.id;
  });

  it('has expected attributes', () => {
    const attrs = Scan.getAttributes();
    expect(attrs).toHaveProperty('id');
    expect(attrs).toHaveProperty('repositoryId');
    expect(attrs).toHaveProperty('triggeredBy');
    expect(attrs).toHaveProperty('status');
    expect(attrs).toHaveProperty('startedAt');
    expect(attrs).toHaveProperty('completedAt');
  });

  it('status defaults to pending', () => {
    const attrs = Scan.getAttributes();
    expect(attrs.status.defaultValue).toBe('pending');
  });

  it('can create a scan with default status', async () => {
    const scan = await Scan.create({ repositoryId: repoId });
    expect(scan.id).toBeDefined();
    expect(scan.status).toBe('pending');
    // SQLite returns undefined for unset nullable fields; Postgres returns null
    expect(scan.triggeredBy ?? null).toBeNull();
  });
});

describe('ScanResult model', () => {
  let scanId: string;

  beforeAll(async () => {
    const repo = await Repository.create({
      githubId: 77777,
      owner: 'results-org',
      name: 'results-repo',
      fullName: 'results-org/results-repo',
    });
    const scan = await Scan.create({ repositoryId: repo.id });
    scanId = scan.id;
  });

  it('has expected attributes', () => {
    const attrs = ScanResult.getAttributes();
    expect(attrs).toHaveProperty('id');
    expect(attrs).toHaveProperty('scanId');
    expect(attrs).toHaveProperty('agentId');
    expect(attrs).toHaveProperty('severity');
    expect(attrs).toHaveProperty('category');
    expect(attrs).toHaveProperty('title');
    expect(attrs).toHaveProperty('description');
    expect(attrs).toHaveProperty('filePath');
    expect(attrs).toHaveProperty('lineNumber');
  });

  it('can create a scan result', async () => {
    const result = await ScanResult.create({
      scanId,
      agentId: 'security-analyst',
      severity: 'high',
      category: 'secrets',
      title: 'Hardcoded API key detected',
      filePath: 'src/config.ts',
      lineNumber: 42,
      description: 'An API key was found in source code.',
    });
    expect(result.id).toBeDefined();
    expect(result.severity).toBe('high');
    expect(result.lineNumber).toBe(42);
  });
});

describe('AuditLog model', () => {
  it('has expected attributes', () => {
    const attrs = AuditLog.getAttributes();
    expect(attrs).toHaveProperty('id');
    expect(attrs).toHaveProperty('userId');
    expect(attrs).toHaveProperty('action');
    expect(attrs).toHaveProperty('resourceType');
    expect(attrs).toHaveProperty('resourceId');
    expect(attrs).toHaveProperty('metadata');
    expect(attrs).toHaveProperty('ipAddress');
  });

  it('has no updatedAt column', () => {
    const attrs = AuditLog.getAttributes();
    expect(attrs).not.toHaveProperty('updatedAt');
  });

  it('can create an audit log without userId', async () => {
    const log = await AuditLog.create({
      action: 'SCAN_TRIGGERED',
      resourceType: 'scan',
      resourceId: 'some-id',
      metadata: { source: 'api' },
      ipAddress: '127.0.0.1',
    });
    expect(log.id).toBeDefined();
    expect(log.userId ?? null).toBeNull();
    expect(log.action).toBe('SCAN_TRIGGERED');
  });
});

describe('Model associations', () => {
  it('Repository hasMany Scans', () => {
    const assocs = Repository.associations;
    expect(assocs).toHaveProperty('scans');
  });

  it('Scan belongsTo Repository', () => {
    const assocs = Scan.associations;
    expect(assocs).toHaveProperty('repository');
  });

  it('Scan hasMany ScanResults', () => {
    const assocs = Scan.associations;
    expect(assocs).toHaveProperty('results');
  });

  it('ScanResult belongsTo Scan', () => {
    const assocs = ScanResult.associations;
    expect(assocs).toHaveProperty('scan');
  });

  it('User hasMany Scans as triggeredScans', () => {
    const assocs = User.associations;
    expect(assocs).toHaveProperty('triggeredScans');
  });

  it('Scan belongsTo User as triggeredByUser', () => {
    const assocs = Scan.associations;
    expect(assocs).toHaveProperty('triggeredByUser');
  });

  it('User hasMany AuditLogs', () => {
    const assocs = User.associations;
    expect(assocs).toHaveProperty('auditLogs');
  });

  it('AuditLog belongsTo User', () => {
    const assocs = AuditLog.associations;
    expect(assocs).toHaveProperty('user');
  });
});
