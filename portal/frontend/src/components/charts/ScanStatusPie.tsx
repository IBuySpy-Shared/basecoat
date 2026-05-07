import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ScanStatus } from '../../types';

export interface StatusCount {
  status: ScanStatus;
  count: number;
}

interface ScanStatusPieProps {
  data: StatusCount[];
}

const STATUS_COLORS: Record<ScanStatus, string> = {
  pending: '#9ca3af',
  running: '#6366f1',
  completed: '#22c55e',
  failed: '#ef4444',
};

export default function ScanStatusPie({ data }: ScanStatusPieProps) {
  const nonEmpty = data.filter((d) => d.count > 0);

  if (nonEmpty.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No scan data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={nonEmpty}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={false}
        >
          {nonEmpty.map((entry) => (
            <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
