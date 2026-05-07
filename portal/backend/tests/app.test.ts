import request from 'supertest';
import { createApp } from '../src/app';

const app = createApp();

describe('createApp()', () => {
  it('returns an Express application', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  it('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('unknown route returns 404', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not Found');
  });
});
