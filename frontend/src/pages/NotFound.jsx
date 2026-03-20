import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-green-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page not found</h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
