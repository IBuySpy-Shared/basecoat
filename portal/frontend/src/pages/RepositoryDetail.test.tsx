import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RepositoryDetail from './RepositoryDetail';

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

const mockRepo = {
  id: '1',
  name: 'my-repo',
  url: 'https://github.com/org/my-repo',
  description: 'A test repository',
  owner: 'org',
  defaultBranch: 'main',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

const mockScans = [
  {
    id: 'scan-1',
    repositoryId: '1',
    status: 'completed' as const,
    branch: 'main',
    commitSha: null,
    startedAt: null,
    completedAt: '2024-01-02T00:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

function renderComponent(id = '1') {
  return render(
    <MemoryRouter initialEntries={[`/repositories/${id}`]}>
      <Routes>
        <Route path="/repositories/:id" element={<RepositoryDetail />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RepositoryDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(apiClient.get).mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  it('renders repo name and scan table after data loads', async () => {
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce({ data: mockRepo })
      .mockResolvedValueOnce({ data: mockScans });
    renderComponent();
    await waitFor(() => expect(screen.getByText('my-repo')).toBeInTheDocument());
    expect(screen.getByText('scan-1')).toBeInTheDocument();
    expect(screen.getByText('completed')).toBeInTheDocument();
  });

  it('shows "No scans yet." empty state', async () => {
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce({ data: mockRepo })
      .mockResolvedValueOnce({ data: [] });
    renderComponent();
    await waitFor(() => expect(screen.getByText('No scans yet.')).toBeInTheDocument());
  });

  it('renders "Trigger New Scan" button', async () => {
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce({ data: mockRepo })
      .mockResolvedValueOnce({ data: [] });
    renderComponent();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /trigger new scan/i })).toBeInTheDocument(),
    );
  });

  it('calls POST endpoint when "Trigger New Scan" button is clicked', async () => {
    const mockPollingScan = {
      id: 'scan-2',
      repositoryId: '1',
      status: 'completed' as const,
      branch: 'main',
      commitSha: null,
      startedAt: null,
      completedAt: '2024-01-02T00:00:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    vi.mocked(apiClient.get)
      .mockResolvedValueOnce({ data: mockRepo })
      .mockResolvedValueOnce({ data: mockScans })
      .mockResolvedValue({ data: mockPollingScan }); // polling + refresh calls
    vi.mocked(apiClient.post).mockResolvedValueOnce({ data: { id: 'scan-2', status: 'running' } });

    renderComponent();
    await waitFor(() => expect(screen.getByText('my-repo')).toBeInTheDocument());

    const button = screen.getByRole('button', { name: /trigger new scan/i });
    fireEvent.click(button);

    await waitFor(() =>
      expect(apiClient.post).toHaveBeenCalledWith('/api/v1/repositories/1/scans'),
    );
  });
});
