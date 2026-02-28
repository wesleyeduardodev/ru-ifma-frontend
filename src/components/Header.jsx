import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiSettings } from 'react-icons/fi';

export default function Header() {
  const { admin } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-ifma/95 backdrop-blur-sm text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 hover:opacity-90 transition-all duration-200 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-full flex items-center justify-center ring-2 ring-white/20 shrink-0">
            <span className="text-ifma font-bold text-base sm:text-lg">RU</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold leading-tight tracking-tight truncate">Restaurante Universitário</h1>
            <p className="text-white/70 text-xs hidden sm:block">IFMA - Instituto Federal do Maranhão</p>
          </div>
        </Link>
        <nav className="flex items-center shrink-0">
          {admin ? (
            <Link
              to="/admin"
              className="flex items-center gap-2 text-sm font-medium bg-white/15 hover:bg-white/25 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg transition-all duration-200"
            >
              <FiSettings size={15} />
              Painel
            </Link>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium border border-white/30 hover:bg-white/15 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
      <div className="h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
    </header>
  );
}
