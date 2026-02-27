import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiList, FiUsers, FiArrowLeft } from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const location = useLocation();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: FiHome },
    { to: '/admin/cardapios', label: 'Cardápios', icon: FiList },
    { to: '/admin/administradores', label: 'Administradores', icon: FiUsers },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-56 shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 space-y-1">
              {links.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    location.pathname === to
                      ? 'bg-[#00843D] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <hr className="my-2 border-gray-200" />
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
              >
                <FiArrowLeft size={18} />
                Voltar ao site
              </Link>
            </nav>
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
