export function Login() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-2">Basecoat Portal</h1>
        <p className="text-gray-500 mb-6">Sign in to manage your Copilot assets</p>
        <a
          href={`${apiUrl}/auth/github`}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
        >
          Sign in with GitHub
        </a>
      </div>
    </div>
  );
}
