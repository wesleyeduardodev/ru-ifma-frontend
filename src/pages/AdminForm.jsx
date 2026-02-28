import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import CampoFormulario from '../components/CampoFormulario';

const inputClasses = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ifma/20 focus:border-ifma text-sm transition-all duration-200';

export default function AdminForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [mostrarSenha, setMostrarSenha] = useState(false);
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
    if (!isEditing && form.senha.length < 8) {
      setErro('A senha deve ter no minimo 8 caracteres');
      return;
    }
    if (isEditing && form.senha && form.senha.length < 8) {
      setErro('A senha deve ter no minimo 8 caracteres');
      return;
    }
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
        <button
          onClick={() => navigate('/admin/administradores')}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          <FiArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          {isEditing ? 'Editar Administrador' : 'Novo Administrador'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-lg">
        {erro && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 border-l-4 border-l-red-400 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
            <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
            <span>{erro}</span>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Dados pessoais</h3>
            <div className="space-y-4">
              <CampoFormulario label="Nome">
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </CampoFormulario>
              <CampoFormulario label="Email">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </CampoFormulario>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Segurança</h3>
            <CampoFormulario label={
              <>
                Senha {isEditing && <span className="text-gray-400 font-normal normal-case tracking-normal">(deixe em branco para manter)</span>}
              </>
            }>
              <div className="relative">
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  name="senha"
                  value={form.senha}
                  onChange={handleChange}
                  required={!isEditing}
                  minLength={8}
                  className={`${inputClasses} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ifma focus:outline-none transition-colors duration-200"
                >
                  {mostrarSenha ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {!isEditing && (
                <p className="text-xs text-gray-400 mt-1.5">Minimo de 8 caracteres</p>
              )}
            </CampoFormulario>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-ifma text-white px-6 py-2.5 rounded-xl font-medium hover:bg-ifma-dark shadow-sm active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
          >
            <FiSave size={16} />
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/administradores')}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
