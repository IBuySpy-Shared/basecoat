import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <p className="text-6xl font-bold text-gray-200">404</p>
      <h2 className="text-xl font-semibold text-gray-700">Page not found</h2>
      <p className="text-sm text-gray-500">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-2 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
