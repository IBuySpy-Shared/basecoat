import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/agents', label: 'Agents', end: false },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <span className="text-lg font-bold tracking-tight">Basecoat</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
