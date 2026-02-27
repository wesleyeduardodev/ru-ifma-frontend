import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiLogOut, FiSettings } from 'react-icons/fi';

export default function Header() {
  const { admin, logout } = useAuth();

  return (
    <header className="bg-[#00843D] text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#00843D] font-bold text-lg">RU</span>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Restaurante Universitário</h1>
            <p className="text-green-200 text-xs">IFMA - Instituto Federal do Maranhão</p>
          </div>
        </Link>
        <nav className="flex items-center gap-4">
          {admin ? (
            <>
              <Link
                to="/admin"
                className="flex items-center gap-1 text-sm bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition"
              >
                <FiSettings size={16} />
                Painel
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition"
              >
                <FiLogOut size={16} />
                Sair
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
            >
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
