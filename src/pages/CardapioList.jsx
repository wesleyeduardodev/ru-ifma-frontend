import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

export default function CardapioList() {
  const [data, setData] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [cardapios, setCardapios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCardapios = () => {
    setLoading(true);
    api.get(`/api/cardapios?data=${data}`)
      .then(res => setCardapios(res.data))
      .catch(() => setCardapios([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCardapios(); }, [data]);

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este cardápio?')) return;
    await api.delete(`/api/cardapios/${id}`);
    fetchCardapios();
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Cardápios</h2>
        <Link
          to="/admin/cardapios/novo"
          className="flex items-center gap-2 bg-[#00843D] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition text-sm"
        >
          <FiPlus size={16} /> Novo Cardápio
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="date"
          value={data}
          onChange={e => setData(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00843D]"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00843D]"></div>
        </div>
      ) : cardapios.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Tipo</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Prato Principal</th>
                <th className="px-6 py-3 text-left text-gray-600 font-medium">Acompanhamento</th>
                <th className="px-6 py-3 text-right text-gray-600 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cardapios.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      c.tipoRefeicao === 'ALMOCO'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {c.tipoRefeicao === 'ALMOCO' ? 'Almoço' : 'Jantar'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-800">{c.pratoPrincipal}</td>
                  <td className="px-6 py-4 text-gray-600">{c.acompanhamento}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/admin/cardapios/${c.id}/editar`}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                    >
                      <FiEdit2 size={14} /> Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id)}
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
          <p className="text-gray-500">Nenhum cardápio para esta data</p>
        </div>
      )}
    </AdminLayout>
  );
}
