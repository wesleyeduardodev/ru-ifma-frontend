import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiPlus, FiEdit2, FiTrash2, FiSun, FiMoon, FiCalendar, FiList } from 'react-icons/fi';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import PaginaHeader from '../components/PaginaHeader';
import EstadoVazio from '../components/EstadoVazio';
import ModalConfirmacao from '../components/ModalConfirmacao';

export default function CardapioList() {
  const [data, setData] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [cardapios, setCardapios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [cardapioSelecionado, setCardapioSelecionado] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const fetchCardapios = () => {
    setLoading(true);
    api.get(`/api/cardapios?data=${data}`)
      .then(res => setCardapios(res.data))
      .catch(() => setCardapios([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCardapios(); }, [data]);

  const abrirModalExclusao = (id) => {
    setCardapioSelecionado(id);
    setModalExclusaoAberto(true);
  };

  const fecharModalExclusao = () => {
    if (excluindo) return;
    setModalExclusaoAberto(false);
    setCardapioSelecionado(null);
  };

  const confirmarExclusao = async () => {
    if (!cardapioSelecionado) return;

    setExcluindo(true);
    try {
      await api.delete(`/api/cardapios/${cardapioSelecionado}`);
      setModalExclusaoAberto(false);
      setCardapioSelecionado(null);
      fetchCardapios();
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <AdminLayout>
      <PaginaHeader
        titulo="Cardápios"
        subtitulo="Gerencie as refeições do restaurante"
        acao={
          <Link
            to="/admin/cardapios/novo"
            className="inline-flex items-center gap-2 bg-ifma text-white px-5 py-2.5 rounded-xl hover:bg-ifma-dark shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 text-sm font-medium"
          >
            <FiPlus size={16} /> Novo Cardápio
          </Link>
        }
      />

      <div className="flex items-center gap-3 mb-6 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 max-w-xs">
        <FiCalendar className="text-ifma shrink-0" size={18} />
        <div className="flex-1">
          <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Filtrar por data</label>
          <input
            type="date"
            value={data}
            onChange={e => setData(e.target.value)}
            className="w-full text-sm text-gray-800 font-medium focus:outline-none bg-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded w-full" />
            <div className="h-12 bg-gray-100 rounded w-full" />
            <div className="h-12 bg-gray-100 rounded w-full" />
          </div>
        </div>
      ) : cardapios.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-gray-600 font-medium">Tipo</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-gray-600 font-medium">Prato Principal</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-gray-600 font-medium hidden md:table-cell">Acompanhamento</th>
                  <th className="px-3 sm:px-6 py-3 text-right text-gray-600 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cardapios.map(c => (
                  <tr key={c.id} className="hover:bg-ifma-50/50 transition-colors duration-150">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        c.tipoRefeicao === 'ALMOCO'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {c.tipoRefeicao === 'ALMOCO' ? <FiSun size={12} /> : <FiMoon size={12} />}
                        {c.tipoRefeicao === 'ALMOCO' ? 'Almoço' : 'Jantar'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-800 font-medium">{c.pratoPrincipal}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 hidden md:table-cell">{c.acompanhamento}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/cardapios/${c.id}/editar`}
                          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-ifma bg-gray-50 hover:bg-ifma-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                          <FiEdit2 size={13} /> <span className="hidden sm:inline">Editar</span>
                        </Link>
                        <button
                          onClick={() => abrirModalExclusao(c.id)}
                          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                          <FiTrash2 size={13} /> <span className="hidden sm:inline">Excluir</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EstadoVazio
          icone={FiList}
          titulo="Nenhum cardápio para esta data"
          descricao="Selecione outra data ou crie um novo cardápio"
        />
      )}

      <ModalConfirmacao
        aberto={modalExclusaoAberto}
        titulo="Excluir cardápio"
        mensagem="Tem certeza que deseja excluir este cardápio? Esta ação não pode ser desfeita."
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
        carregando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={fecharModalExclusao}
      />
    </AdminLayout>
  );
}
