import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiClient } from '../api/client';
import type { Repository, Scan, ScanStatus } from '../types';

const statusBadgeClass: Record<ScanStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  running: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export default function RepositoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanLoading, setScanLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScans = useCallback(async () => {
    if (!id) return;
    const res = await apiClient.get<Scan[] | { data: Scan[] }>(
      `/api/v1/repositories/${id}/scans`,
    );
    const data = Array.isArray(res.data)
      ? res.data
      : (res.data as { data: Scan[] }).data ?? [];
    setScans(data);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      apiClient
        .get<Repository>(`/api/v1/repositories/${id}`)
        .then((res) => setRepository(res.data)),
      fetchScans(),
    ])
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, fetchScans]);

  const handleTriggerScan = useCallback(() => {
    if (!id) return;
    setScanLoading(true);
    apiClient
      .post<Scan>(`/api/v1/repositories/${id}/scans`)
      .then(() => fetchScans())
      .catch((err: Error) => setError(err.message))
      .finally(() => setScanLoading(false));
  }, [id, fetchScans]);

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/repositories"
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back
        </Link>
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

      {!loading && repository && (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
            <h1 className="text-2xl font-bold text-gray-900">{repository.name}</h1>
            <div className="text-sm text-gray-500 space-y-1">
              <p>
                <span className="font-medium text-gray-700">URL:</span>{' '}
                <a
                  href={repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {repository.url}
                </a>
              </p>
              {repository.description && (
                <p>
                  <span className="font-medium text-gray-700">Description:</span>{' '}
                  {repository.description}
                </p>
              )}
              <p>
                <span className="font-medium text-gray-700">Created:</span>{' '}
                {new Date(repository.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Scan History</h2>
              <button
                onClick={handleTriggerScan}
                disabled={scanLoading}
                className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {scanLoading ? 'Triggering…' : 'Trigger New Scan'}
              </button>
            </div>

            {scans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <p className="text-sm">No scans yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scans.map((scan) => (
                      <tr key={scan.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-gray-700">{scan.id}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass[scan.status] ?? 'bg-gray-100 text-gray-600'}`}
                          >
                            {scan.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(scan.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {scan.completedAt
                            ? new Date(scan.completedAt).toLocaleString()
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
