import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Repositories from './Repositories';

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

const mockRepositories = [
  {
    id: '1',
    name: 'my-repo',
    url: 'https://github.com/org/my-repo',
    owner: 'org',
    defaultBranch: 'main',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'another-repo',
    url: 'https://github.com/org/another-repo',
    description: 'A second repo',
    owner: 'org',
    defaultBranch: 'main',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
];

function renderComponent() {
  return render(
    <MemoryRouter>
      <Repositories />
    </MemoryRouter>,
  );
}

describe('Repositories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    vi.mocked(apiClient.get).mockReturnValue(new Promise(() => {}));
    renderComponent();
    expect(screen.getByRole('status', { name: /loading/i })).toBeInTheDocument();
  });

  it('renders repo list after data loads', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockRepositories });
    renderComponent();
    await waitFor(() => expect(screen.getByText('my-repo')).toBeInTheDocument());
    expect(screen.getByText('another-repo')).toBeInTheDocument();
    expect(screen.getByText('A second repo')).toBeInTheDocument();
  });

  it('shows empty state when no repositories', async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: [] });
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText('No repositories yet.')).toBeInTheDocument(),
    );
  });
});
