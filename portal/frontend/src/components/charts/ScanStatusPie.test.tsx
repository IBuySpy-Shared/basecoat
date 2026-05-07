import { render, screen } from '@testing-library/react';
import ScanStatusPie from './ScanStatusPie';
import type { StatusCount } from './ScanStatusPie';

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

describe('ScanStatusPie', () => {
  it('shows empty state when all counts are zero', () => {
    const data: StatusCount[] = [
      { status: 'pending', count: 0 },
      { status: 'running', count: 0 },
      { status: 'completed', count: 0 },
      { status: 'failed', count: 0 },
    ];
    render(<ScanStatusPie data={data} />);
    expect(screen.getByText('No scan data yet')).toBeInTheDocument();
  });

  it('shows empty state when data array is empty', () => {
    render(<ScanStatusPie data={[]} />);
    expect(screen.getByText('No scan data yet')).toBeInTheDocument();
  });

  it('renders chart when data has non-zero counts', () => {
    const data: StatusCount[] = [
      { status: 'pending', count: 1 },
      { status: 'running', count: 0 },
      { status: 'completed', count: 5 },
      { status: 'failed', count: 2 },
    ];
    render(<ScanStatusPie data={data} />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.queryByText('No scan data yet')).not.toBeInTheDocument();
  });
});
