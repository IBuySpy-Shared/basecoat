import { useEffect } from 'react';
import { apiClient } from '../api/client';
import useStore from '../store';

interface StatCardProps {
  label: string;
  value: number | string;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { repositories, scans, loading, error, setRepositories, setLoading, setError } =
    useStore();

  useEffect(() => {
    setLoading(true);
    apiClient
      .get('/api/v1/repositories')
      .then((res) => setRepositories(res.data.data ?? res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [setRepositories, setLoading, setError]);

  const stats = [
    { label: 'Total Agents', value: 73 },
    { label: 'Active Scans', value: scans.filter((s) => s.status === 'running').length },
    { label: 'Repositories', value: repositories.length },
    { label: 'Issues Found', value: 0 },
  ];

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      )}
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Scans</h2>
        {scans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <p className="text-sm">No scans yet.</p>
            <p className="text-xs mt-1">Connect a repository to start scanning.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {scans.slice(0, 10).map((scan) => (
              <li key={scan.id} className="py-2 flex items-center justify-between text-sm">
                <span className="text-gray-700 font-mono truncate">{scan.branch}</span>
                <span
                  className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                    scan.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : scan.status === 'running'
                        ? 'bg-indigo-100 text-indigo-700'
                        : scan.status === 'failed'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {scan.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
