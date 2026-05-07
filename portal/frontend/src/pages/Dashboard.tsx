import { useEffect, useMemo } from 'react';
import { apiClient } from '../api/client';
import useStore from '../store';
import type { Scan } from '../types';
import ScanBarChart from '../components/charts/ScanBarChart';
import ScanStatusPie from '../components/charts/ScanStatusPie';
import type { DailyCount } from '../components/charts/ScanBarChart';
import type { StatusCount } from '../components/charts/ScanStatusPie';

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

function buildDailyData(scans: Scan[]): DailyCount[] {
  const today = new Date();
  const days: DailyCount[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dateStr = d.toISOString().slice(0, 10);
    const count = scans.filter((s) => s.createdAt.slice(0, 10) === dateStr).length;
    days.push({ date: label, count });
  }
  return days;
}

function buildStatusData(scans: Scan[]): StatusCount[] {
  const statuses = ['pending', 'running', 'completed', 'failed'] as const;
  return statuses.map((status) => ({
    status,
    count: scans.filter((s) => s.status === status).length,
  }));
}

export default function Dashboard() {
  const { repositories, scans, loading, error, setRepositories, setScans, setLoading, setError } =
    useStore();

  useEffect(() => {
    setLoading(true);
    setError(null);

    apiClient
      .get<{ data?: unknown[] } | unknown[]>('/api/v1/repositories')
      .then((res) => {
        const repos = Array.isArray(res.data)
          ? res.data
          : (res.data as { data: unknown[] }).data ?? [];
        setRepositories(repos as Parameters<typeof setRepositories>[0]);

        const scanRequests = (repos as Array<{ id: string }>).map((r) =>
          apiClient
            .get<{ data?: Scan[] } | Scan[]>(`/api/v1/repositories/${r.id}/scans`)
            .then((sr) =>
              Array.isArray(sr.data) ? sr.data : (sr.data as { data: Scan[] }).data ?? [],
            )
            .catch(() => [] as Scan[]),
        );

        return Promise.all(scanRequests);
      })
      .then((allScans) => {
        setScans((allScans as Scan[][]).flat());
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [setRepositories, setScans, setLoading, setError]);

  const sevenDaysAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString();
  }, []);

  const scansLast7 = useMemo(
    () => scans.filter((s) => s.createdAt >= sevenDaysAgo).length,
    [scans, sevenDaysAgo],
  );

  const dailyData = useMemo(() => buildDailyData(scans), [scans]);
  const statusData = useMemo(() => buildStatusData(scans), [scans]);

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

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Repositories" value={repositories.length} />
        <StatCard label="Total Scans" value={scans.length} />
        <StatCard label="Scans (Last 7 Days)" value={scansLast7} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Scans per Day (Last 7 Days)</h2>
          <ScanBarChart data={dailyData} />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Scan Status</h2>
          <ScanStatusPie data={statusData} />
        </div>
      </div>

      {/* Recent scans list */}
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
