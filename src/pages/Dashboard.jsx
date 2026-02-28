import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiList, FiUsers, FiCalendar, FiPlus, FiSun, FiMoon, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState({ cardapiosHoje: [], totalAdmin: 0 });

  useEffect(() => {
    const hoje = format(new Date(), 'yyyy-MM-dd');
    Promise.all([
      api.get(`/api/cardapios?data=${hoje}`),
      api.get('/api/admin'),
    ]).then(([cardapiosRes, adminsRes]) => {
      setStats({
        cardapiosHoje: cardapiosRes.data,
        totalAdmin: adminsRes.data.length,
      });
    }).catch(() => {});
  }, []);

  const primeiroNome = admin?.nome?.split(' ')[0] || 'Admin';

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
        <p className="text-gray-500 mt-1">Bem-vindo de volta, {primeiroNome}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
        <StatCard
          icon={FiCalendar}
          label="Data de Hoje"
          value={format(new Date(), 'dd/MM/yyyy')}
          cor="blue"
        />
        <StatCard
          icon={FiList}
          label="Cardápios Hoje"
          value={stats.cardapiosHoje.length}
          cor="green"
        />
        <StatCard
          icon={FiUsers}
          label="Administradores"
          value={stats.totalAdmin}
          cor="purple"
        />
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações rápidas</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/admin/cardapios/novo"
            className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-ifma/20 transition-all duration-200 group"
          >
            <div className="w-12 h-12 bg-ifma-50 rounded-xl flex items-center justify-center group-hover:bg-ifma transition-all duration-200">
              <FiPlus size={22} className="text-ifma group-hover:text-white transition-all duration-200" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Novo Cardápio</p>
              <p className="text-sm text-gray-400">Cadastrar refeição</p>
            </div>
          </Link>
          <Link
            to="/admin/cardapios"
            className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-ifma/20 transition-all duration-200 group"
          >
            <div className="w-12 h-12 bg-ifma-50 rounded-xl flex items-center justify-center group-hover:bg-ifma transition-all duration-200">
              <FiList size={22} className="text-ifma group-hover:text-white transition-all duration-200" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Ver Cardápios</p>
              <p className="text-sm text-gray-400">Gerenciar refeições</p>
            </div>
          </Link>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Cardápio de hoje</h3>
        {stats.cardapiosHoje.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {stats.cardapiosHoje.map(c => (
              <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-3">
                  {c.tipoRefeicao === 'ALMOCO'
                    ? <FiSun className="text-amber-500" size={18} />
                    : <FiMoon className="text-indigo-500" size={18} />}
                  <span className="font-semibold text-gray-800">
                    {c.tipoRefeicao === 'ALMOCO' ? 'Almoço' : 'Jantar'}
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900">{c.pratoPrincipal}</p>
                <p className="text-sm text-gray-500 mt-1">{c.acompanhamento}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-center gap-3">
            <FiAlertCircle className="text-amber-500 shrink-0" size={20} />
            <p className="text-sm text-amber-700">
              Nenhum cardápio cadastrado para hoje.{' '}
              <Link to="/admin/cardapios/novo" className="font-semibold underline">Cadastrar agora</Link>
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, cor }) {
  const cores = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className={`h-1 ${cor === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-500' : cor === 'green' ? 'bg-gradient-to-r from-ifma to-emerald-400' : 'bg-gradient-to-r from-purple-400 to-purple-500'}`} />
      <div className="p-4 sm:p-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${cores[cor]}`}>
          <Icon size={20} />
        </div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}
