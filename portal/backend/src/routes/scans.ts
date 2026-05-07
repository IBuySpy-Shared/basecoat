import { Router, Request, Response } from 'express';
import { Repository, Scan, ScanResult } from '../models';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.post('/repositories/:id/scans', requireAuth, async (req: Request, res: Response) => {
  try {
    const repo = await Repository.findByPk(req.params.id);
    if (!repo) {
      return res.status(404).json({ error: { message: 'Repository not found', code: 'NOT_FOUND' } });
    }
    const scan = await Scan.create({
      repositoryId: req.params.id,
      status: 'running',
    });

    // Stub runner: complete the scan after 5 seconds
    setTimeout(async () => {
      try {
        await scan.update({
          status: 'completed',
          completedAt: new Date(),
        });
      } catch {
        // best-effort; ignore errors in stub runner
      }
    }, 5000);

    return res.status(201).json({ data: scan });
  } catch {
    return res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } });
  }
});

router.get('/repositories/:id/scans', requireAuth, async (req: Request, res: Response) => {
  try {
    const scans = await Scan.findAll({ where: { repositoryId: req.params.id } });
    return res.json({ data: scans });
  } catch {
    return res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } });
  }
});

router.get('/scans/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const scan = await Scan.findByPk(req.params.id, {
      include: [{ model: ScanResult, as: 'results' }],
    });
    if (!scan) {
      return res.status(404).json({ error: { message: 'Scan not found', code: 'NOT_FOUND' } });
    }
    return res.json({ data: scan });
  } catch {
    return res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } });
  }
});

export default router;
