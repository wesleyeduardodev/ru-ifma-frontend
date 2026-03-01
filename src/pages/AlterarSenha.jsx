import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';
import PaginaHeader from '../components/PaginaHeader';

export default function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarAtual, setMostrarAtual] = useState(false);
  const [mostrarNova, setMostrarNova] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (novaSenha.length < 8) {
      setErro('A nova senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro('A nova senha e a confirmação não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await api.put('/api/auth/alterar-senha', { senhaAtual, novaSenha });
      await logout();
      navigate('/login');
    } catch (err) {
      const mensagem = err.response?.data?.erro || 'Erro ao alterar senha.';
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <PaginaHeader
        titulo="Alterar Senha"
        subtitulo="Atualize sua senha de acesso"
      />

      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          {erro && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 border-l-4 border-l-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
              <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
              <span>{erro}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha atual</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={mostrarAtual ? 'text' : 'password'}
                value={senhaAtual}
                onChange={e => setSenhaAtual(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ifma/20 focus:border-ifma text-sm transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setMostrarAtual(!mostrarAtual)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ifma transition-colors duration-200"
              >
                {mostrarAtual ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nova senha</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={mostrarNova ? 'text' : 'password'}
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
                required
                minLength={8}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ifma/20 focus:border-ifma text-sm transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setMostrarNova(!mostrarNova)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ifma transition-colors duration-200"
              >
                {mostrarNova ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Mínimo de 8 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmar nova senha</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type={mostrarConfirmar ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                required
                minLength={8}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ifma/20 focus:border-ifma text-sm transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ifma transition-colors duration-200"
              >
                {mostrarConfirmar ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {confirmarSenha && novaSenha === confirmarSenha && (
              <p className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <FiCheckCircle size={12} />
                Senhas coincidem
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ifma text-white py-2.5 rounded-xl font-medium hover:bg-ifma-dark shadow-sm active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Alterando...' : 'Alterar senha'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
