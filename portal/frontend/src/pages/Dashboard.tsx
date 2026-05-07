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

const stats = [
  { label: 'Total Agents', value: 73 },
  { label: 'Active Scans', value: 0 },
  { label: 'Repositories', value: 0 },
  { label: 'Issues Found', value: 0 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Recent Scans</h2>
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <p className="text-sm">No scans yet.</p>
          <p className="text-xs mt-1">Connect a repository to start scanning.</p>
        </div>
      </div>
    </div>
  );
}
