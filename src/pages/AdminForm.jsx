import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

export default function AdminForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      api.get(`/api/admin/${id}`)
        .then(res => {
          setForm({ nome: res.data.nome, email: res.data.email, senha: '' });
        })
        .catch(() => navigate('/admin/administradores'));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/api/admin/${id}`, form);
      } else {
        await api.post('/api/admin', form);
      }
      navigate('/admin/administradores');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao salvar administrador';
      setErro(typeof msg === 'string' ? msg : 'Verifique os campos obrigatórios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/administradores')} className="text-gray-500 hover:text-gray-700">
          <FiArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Editar Administrador' : 'Novo Administrador'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5 max-w-lg">
        {erro && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{erro}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00843D]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00843D]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha {isEditing && <span className="text-gray-400">(deixe em branco para manter)</span>}
          </label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            required={!isEditing}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00843D]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#00843D] text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition disabled:opacity-50"
        >
          <FiSave size={16} />
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </AdminLayout>
  );
}
