import { render, screen } from '@testing-library/react';
import ScanBarChart from './ScanBarChart';
import type { DailyCount } from './ScanBarChart';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
}));

describe('ScanBarChart', () => {
  it('shows empty state when no data provided', () => {
    render(<ScanBarChart data={[]} />);
    expect(screen.getByText('No scan data yet')).toBeInTheDocument();
  });

  it('shows empty state when all counts are zero', () => {
    const data: DailyCount[] = [
      { date: 'Jan 1', count: 0 },
      { date: 'Jan 2', count: 0 },
    ];
    render(<ScanBarChart data={data} />);
    expect(screen.getByText('No scan data yet')).toBeInTheDocument();
  });

  it('renders chart when data has non-zero counts', () => {
    const data: DailyCount[] = [
      { date: 'Jan 1', count: 0 },
      { date: 'Jan 2', count: 3 },
      { date: 'Jan 3', count: 1 },
    ];
    render(<ScanBarChart data={data} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.queryByText('No scan data yet')).not.toBeInTheDocument();
  });
});
