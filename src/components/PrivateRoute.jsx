import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-12 h-12 bg-ifma rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-lg">RU</span>
        </div>
        <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-ifma rounded-full animate-[loading_1s_ease-in-out_infinite]" />
        </div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
