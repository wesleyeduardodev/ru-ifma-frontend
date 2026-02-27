import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FiList, FiUsers, FiCalendar } from 'react-icons/fi';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

export default function Dashboard() {
  const [stats, setStats] = useState({ cardapiosHoje: 0, totalAdmin: 0 });

  useEffect(() => {
    const hoje = format(new Date(), 'yyyy-MM-dd');
    Promise.all([
      api.get(`/api/cardapios?data=${hoje}`),
      api.get('/api/admin'),
    ]).then(([cardapiosRes, adminsRes]) => {
      setStats({
        cardapiosHoje: cardapiosRes.data.length,
        totalAdmin: adminsRes.data.length,
      });
    }).catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard
          icon={FiCalendar}
          label="Data de Hoje"
          value={format(new Date(), 'dd/MM/yyyy')}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon={FiList}
          label="Cardápios Hoje"
          value={stats.cardapiosHoje}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          icon={FiUsers}
          label="Administradores"
          value={stats.totalAdmin}
          color="bg-purple-50 text-purple-600"
        />
      </div>
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  );
}
