import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { Repository } from '../types';

export default function Repositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get<Repository[] | { data: Repository[] }>('/api/v1/repositories')
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : (res.data as { data: Repository[] }).data ?? [];
        setRepositories(data);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Repositories</h1>
        <button
          disabled
          title="Coming soon"
          className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium opacity-50 cursor-not-allowed"
        >
          Add Repository
        </button>
      </div>

      {loading && (
        <div
          className="flex items-center justify-center py-12"
          role="status"
          aria-label="Loading"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {!loading && !error && repositories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <p className="text-sm font-medium">No repositories yet.</p>
          <p className="text-xs mt-1">Add a repository to get started.</p>
        </div>
      )}

      {!loading && repositories.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {repositories.map((repo) => (
                <tr key={repo.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/repositories/${repo.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      {repo.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:underline truncate block max-w-xs"
                    >
                      {repo.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {repo.description ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
