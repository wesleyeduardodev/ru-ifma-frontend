import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiPlus, FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import PaginaHeader from '../components/PaginaHeader';
import EstadoVazio from '../components/EstadoVazio';
import ModalConfirmacao from '../components/ModalConfirmacao';

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [adminSelecionado, setAdminSelecionado] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const fetchAdmins = () => {
    setLoading(true);
    api.get('/api/admin')
      .then(res => setAdmins(res.data))
      .catch(() => setAdmins([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAdmins(); }, []);

  const abrirModalExclusao = (id) => {
    setAdminSelecionado(id);
    setModalExclusaoAberto(true);
  };

  const fecharModalExclusao = () => {
    if (excluindo) return;
    setModalExclusaoAberto(false);
    setAdminSelecionado(null);
  };

  const confirmarExclusao = async () => {
    if (!adminSelecionado) return;

    setExcluindo(true);
    try {
      await api.delete(`/api/admin/${adminSelecionado}`);
      setModalExclusaoAberto(false);
      setAdminSelecionado(null);
      fetchAdmins();
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <AdminLayout>
      <PaginaHeader
        titulo="Administradores"
        subtitulo="Gerencie os usuários administradores"
        acao={
          <Link
            to="/admin/administradores/novo"
            className="inline-flex items-center gap-2 bg-ifma text-white px-5 py-2.5 rounded-xl hover:bg-ifma-dark shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200 text-sm font-medium"
          >
            <FiPlus size={16} /> Novo Admin
          </Link>
        }
      />

      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded w-full" />
            <div className="h-12 bg-gray-100 rounded w-full" />
            <div className="h-12 bg-gray-100 rounded w-full" />
          </div>
        </div>
      ) : admins.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-gray-600 font-medium">Nome</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-gray-600 font-medium hidden sm:table-cell">Email</th>
                  <th className="px-3 sm:px-6 py-3 text-left text-gray-600 font-medium hidden md:table-cell">Criado em</th>
                  <th className="px-3 sm:px-6 py-3 text-right text-gray-600 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {admins.map(a => (
                  <tr key={a.id} className="hover:bg-ifma-50/50 transition-colors duration-150">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-ifma-50 flex items-center justify-center shrink-0">
                          <span className="text-ifma text-xs font-bold">{a.nome?.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-gray-800 font-medium">{a.nome}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-500 hidden sm:table-cell">{a.email}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-400 text-xs hidden md:table-cell">
                      {a.criadoEm ? format(new Date(a.criadoEm), 'dd MMM yyyy', { locale: ptBR }) : '-'}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/administradores/${a.id}/editar`}
                          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-ifma bg-gray-50 hover:bg-ifma-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                        >
                          <FiEdit2 size={13} /> <span className="hidden sm:inline">Editar</span>
                        </Link>
                        <button
                          onClick={() => abrirModalExclusao(a.id)}
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
          icone={FiUsers}
          titulo="Nenhum administrador cadastrado"
          descricao="Adicione um novo administrador para gerenciar o sistema"
        />
      )}

      <ModalConfirmacao
        aberto={modalExclusaoAberto}
        titulo="Excluir administrador"
        mensagem="Tem certeza que deseja excluir este administrador? Esta ação não pode ser desfeita."
        textoConfirmar="Excluir"
        textoCancelar="Cancelar"
        carregando={excluindo}
        onConfirmar={confirmarExclusao}
        onCancelar={fecharModalExclusao}
      />
    </AdminLayout>
  );
}
