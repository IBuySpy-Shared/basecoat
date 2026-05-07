import request from 'supertest';
import jwt from 'jsonwebtoken';
import { createApp } from '../src/app';
import { Repository } from '../src/models';

jest.mock('../src/models', () => ({
  Repository: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  Scan: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  },
  ScanResult: {},
  sequelize: {},
}));

const app = createApp();

const validToken = jwt.sign({ id: 'user-1', username: 'testuser', role: 'viewer' }, 'dev-secret');
const authHeader = `Bearer ${validToken}`;

const mockRepo = {
  id: 'repo-uuid-1',
  githubId: 42,
  owner: 'acme',
  name: 'widget',
  fullName: 'acme/widget',
  isPrivate: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/v1/repositories', () => {
  it('returns 200 with data array', async () => {
    (Repository.findAll as jest.Mock).mockResolvedValue([mockRepo]);

    const res = await request(app).get('/api/v1/repositories').set('Authorization', authHeader);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].owner).toBe('acme');
  });

  it('returns empty array when no repositories', async () => {
    (Repository.findAll as jest.Mock).mockResolvedValue([]);

    const res = await request(app).get('/api/v1/repositories').set('Authorization', authHeader);

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('returns 500 on database error', async () => {
    (Repository.findAll as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/v1/repositories').set('Authorization', authHeader);

    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
  });
});

describe('POST /api/v1/repositories', () => {
  it('creates a repository and returns 201', async () => {
    (Repository.create as jest.Mock).mockResolvedValue(mockRepo);

    const res = await request(app)
      .post('/api/v1/repositories')
      .set('Authorization', authHeader)
      .send({ owner: 'acme', name: 'widget', githubId: 42 });

    expect(res.status).toBe(201);
    expect(res.body.data.fullName).toBe('acme/widget');
    expect(Repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ owner: 'acme', name: 'widget', githubId: 42, fullName: 'acme/widget' })
    );
  });

  it('sets isPrivate from body', async () => {
    (Repository.create as jest.Mock).mockResolvedValue({ ...mockRepo, isPrivate: true });

    const res = await request(app)
      .post('/api/v1/repositories')
      .set('Authorization', authHeader)
      .send({ owner: 'acme', name: 'widget', githubId: 42, isPrivate: true });

    expect(res.status).toBe(201);
    expect(Repository.create).toHaveBeenCalledWith(expect.objectContaining({ isPrivate: true }));
  });

  it('returns 400 when owner is missing', async () => {
    const res = await request(app)
      .post('/api/v1/repositories')
      .set('Authorization', authHeader)
      .send({ name: 'widget', githubId: 42 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toMatch(/owner/);
  });

  it('returns 400 when name is missing', async () => {
    const res = await request(app)
      .post('/api/v1/repositories')
      .set('Authorization', authHeader)
      .send({ owner: 'acme', githubId: 42 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toMatch(/name/);
  });

  it('returns 400 when githubId is missing', async () => {
    const res = await request(app)
      .post('/api/v1/repositories')
      .set('Authorization', authHeader)
      .send({ owner: 'acme', name: 'widget' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toMatch(/githubId/);
  });

  it('returns 500 on database error', async () => {
    (Repository.create as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .post('/api/v1/repositories')
      .set('Authorization', authHeader)
      .send({ owner: 'acme', name: 'widget', githubId: 42 });

    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
  });
});

describe('GET /api/v1/repositories/:id', () => {
  it('returns 200 with repository data', async () => {
    (Repository.findByPk as jest.Mock).mockResolvedValue(mockRepo);

    const res = await request(app).get('/api/v1/repositories/repo-uuid-1').set('Authorization', authHeader);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe('repo-uuid-1');
  });

  it('returns 404 when repository not found', async () => {
    (Repository.findByPk as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/v1/repositories/nonexistent').set('Authorization', authHeader);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('returns 500 on database error', async () => {
    (Repository.findByPk as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/api/v1/repositories/repo-uuid-1').set('Authorization', authHeader);

    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
  });
});
