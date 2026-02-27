import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmins = () => {
    setLoading(true);
    api.get('/api/admin')
      .then(res => setAdmins(res.data))
      .catch(() => setAdmins([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este administrador?')) return;
    await api.delete(`/api/admin/${id}`);
    fetchAdmins();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Administradores</h2>
        <Link
          to="/admin/administradores/novo"
          className="flex items-center gap-2 bg-[#00843D] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition text-sm"
        >
          <FiPlus size={16} /> Novo Admin
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00843D]"></div>
        </div>
      ) : admins.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Nome</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Email</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Criado em</th>
                <th className="px-6 py-3 text-right text-gray-600 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-800 font-medium">{a.nome}</td>
                  <td className="px-6 py-4 text-gray-600">{a.email}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {a.criadoEm ? format(new Date(a.criadoEm), 'dd/MM/yyyy HH:mm') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/admin/administradores/${a.id}/editar`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                    >
                      <FiEdit2 size={14} /> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-xs"
                    >
                      <FiTrash2 size={14} /> Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Nenhum administrador cadastrado</p>
        </div>
      )}
    </AdminLayout>
  );
}
