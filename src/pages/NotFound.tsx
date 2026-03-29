import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex-1 min-h-0 flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-bold text-amber-500 mb-4">404</p>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-amber-500 text-black rounded-lg font-semibold hover:bg-amber-600 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
