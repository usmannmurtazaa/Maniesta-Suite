import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-gradient">404</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Page not found</p>
      <Link to="/" className="mt-8 inline-block btn-primary">Go Home</Link>
    </div>
  );
}