import useStore from '../store';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const user = useStore((s) => s.user);
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'PU';
  const displayName = user?.username ?? 'Portal User';

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">{displayName}</span>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
      </div>
    </header>
  );
}
