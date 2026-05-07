import { Request, Response, NextFunction } from 'express';
import { errorHandler, AppError } from '../src/middleware/errorHandler';

function makeMockRes(): Partial<Response> & { statusCode: number; body: unknown } {
  const res: Partial<Response> & { statusCode: number; body: unknown } = {
    statusCode: 200,
    body: null,
    status: jest.fn().mockReturnThis() as unknown as Response['status'],
    json: jest.fn().mockImplementation((data: unknown) => {
      res.body = data;
      return res as Response;
    }) as unknown as Response['json'],
  };
  return res;
}

describe('errorHandler middleware', () => {
  const next: NextFunction = jest.fn();

  it('responds with 500 and the error message by default', () => {
    const err: AppError = new Error('Something went wrong');
    const res = makeMockRes();
    errorHandler(err, {} as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong', status: 500 });
  });

  it('uses the err.status when provided', () => {
    const err: AppError = new Error('Not found');
    err.status = 404;
    const res = makeMockRes();
    errorHandler(err, {} as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found', status: 404 });
  });

  it('falls back to "Internal Server Error" when error has no message', () => {
    const err: AppError = new Error();
    err.message = '';
    const res = makeMockRes();
    errorHandler(err, {} as Request, res as Response, next);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Internal Server Error' })
    );
  });
});
