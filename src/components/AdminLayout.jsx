import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiList, FiUsers, FiArrowLeft, FiLogOut, FiKey } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import LogoRU from './LogoRU';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const { admin, logout } = useAuth();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: FiHome },
    { to: '/admin/cardapios', label: 'Cardápios', icon: FiList },
    { to: '/admin/administradores', label: 'Admins', icon: FiUsers },
  ];

  const estaAtivo = (to) => location.pathname === to;

  return (
    <div className="flex flex-1 min-h-screen">
      <aside className="hidden md:flex md:w-64 shrink-0 bg-slate-800 flex-col">
        <div className="px-5 py-5 border-b border-slate-700">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-all duration-200">
            <LogoRU className="w-10 h-10" />
            <div>
              <p className="text-white font-bold text-sm leading-tight">Restaurante</p>
              <p className="text-white font-bold text-sm leading-tight">Universitário</p>
            </div>
          </Link>
        </div>

        <div className="px-5 py-4 border-b border-slate-700">
          <p className="text-white font-semibold text-sm truncate">{admin?.nome}</p>
          <p className="text-slate-400 text-xs mt-0.5">Painel Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                estaAtivo(to)
                  ? 'bg-ifma text-white shadow-lg shadow-ifma/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Icon size={18} />
              {to === '/admin/administradores' ? 'Administradores' : label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-1">
          <div className="border-t border-slate-700 pt-4 space-y-1">
            <Link
              to="/admin/alterar-senha"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                estaAtivo('/admin/alterar-senha')
                  ? 'bg-ifma text-white shadow-lg shadow-ifma/20'
                  : 'text-slate-500 hover:text-white hover:bg-slate-700'
              }`}
            >
              <FiKey size={16} />
              Alterar Senha
            </Link>
            <Link
              to="/"
              className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-white hover:bg-slate-700 transition-all duration-200"
            >
              <FiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              Voltar ao site
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-all duration-200"
            >
              <FiLogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-gray-50 min-w-0">
        <div className="md:hidden bg-slate-800 px-3 py-2.5 flex items-center gap-1 overflow-x-auto">
          <Link to="/" className="shrink-0 mr-1">
            <LogoRU className="w-7 h-7" />
          </Link>
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                estaAtivo(to)
                  ? 'bg-ifma text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap text-slate-500 hover:text-red-400 hover:bg-slate-700 transition-all duration-200 ml-auto shrink-0"
          >
            <FiLogOut size={13} />
          </button>
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
