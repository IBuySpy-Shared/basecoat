import { Router, Request, Response } from 'express';
import { Repository } from '../models';

const router = Router();

router.get('/repositories', async (_req: Request, res: Response) => {
  try {
    const repos = await Repository.findAll();
    res.json({ data: repos });
  } catch {
    res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } });
  }
});

router.post('/repositories', async (req: Request, res: Response) => {
  const { owner, name, githubId, isPrivate } = req.body;

  if (!owner) {
    return res.status(400).json({ error: { message: 'owner is required', code: 'VALIDATION_ERROR' } });
  }
  if (!name) {
    return res.status(400).json({ error: { message: 'name is required', code: 'VALIDATION_ERROR' } });
  }
  if (githubId === undefined || githubId === null) {
    return res.status(400).json({ error: { message: 'githubId is required', code: 'VALIDATION_ERROR' } });
  }

  try {
    const repo = await Repository.create({
      owner,
      name,
      githubId,
      fullName: `${owner}/${name}`,
      isPrivate: isPrivate ?? false,
    });
    return res.status(201).json({ data: repo });
  } catch {
    return res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } });
  }
});

router.get('/repositories/:id', async (req: Request, res: Response) => {
  try {
    const repo = await Repository.findByPk(req.params.id);
    if (!repo) {
      return res.status(404).json({ error: { message: 'Repository not found', code: 'NOT_FOUND' } });
    }
    return res.json({ data: repo });
  } catch {
    return res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } });
  }
});

export default router;
