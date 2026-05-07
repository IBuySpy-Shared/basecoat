import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScanPoller } from './useScanPoller';

vi.mock('../api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import { apiClient } from '../api/client';

const mockScanRunning = {
  id: 'scan-1',
  repositoryId: 'repo-1',
  status: 'running' as const,
  branch: 'main',
  commitSha: null,
  startedAt: null,
  completedAt: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockScanCompleted = { ...mockScanRunning, status: 'completed' as const, completedAt: '2024-01-01T00:00:10Z' };
const mockScanFailed = { ...mockScanRunning, status: 'failed' as const };

describe('useScanPoller', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts polling when scanId is provided', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockScanRunning });

    const { result } = renderHook(() => useScanPoller('scan-1', 1000, 20));

    expect(result.current.isPolling).toBe(true);

    // Let the initial poll resolve
    await act(async () => {
      await Promise.resolve();
    });

    expect(apiClient.get).toHaveBeenCalledWith('/api/v1/scans/scan-1');
    expect(result.current.isPolling).toBe(true);
  });

  it('stops polling on "completed" status', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockScanCompleted });

    const { result } = renderHook(() => useScanPoller('scan-1', 1000, 20));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isPolling).toBe(false);
    expect(result.current.scan?.status).toBe('completed');
    expect(result.current.error).toBeNull();
  });

  it('stops polling on "failed" status', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockScanFailed });

    const { result } = renderHook(() => useScanPoller('scan-1', 1000, 20));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isPolling).toBe(false);
    expect(result.current.scan?.status).toBe('failed');
  });

  it('stops after maxAttempts', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ data: mockScanRunning });

    const { result } = renderHook(() => useScanPoller('scan-1', 100, 3));

    // Attempt 1: immediate poll
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.isPolling).toBe(true);

    // Attempt 2: after 100ms
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });
    expect(result.current.isPolling).toBe(true);

    // Attempt 3: after another 100ms — maxAttempts reached
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100);
    });

    expect(result.current.isPolling).toBe(false);
    expect(apiClient.get).toHaveBeenCalledTimes(3);
  });

  it('returns error state on fetch failure', async () => {
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useScanPoller('scan-1', 1000, 20));

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isPolling).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(result.current.scan).toBeNull();
  });

  it('does not poll when scanId is null', () => {
    const { result } = renderHook(() => useScanPoller(null, 1000, 20));

    expect(result.current.isPolling).toBe(false);
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});
