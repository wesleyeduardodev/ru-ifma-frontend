import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import LogoRU from '../components/LogoRU';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      const ok = await login(email, senha);
      if (ok) {
        navigate('/admin');
      } else {
        setErro('Credenciais inválidas');
      }
    } catch {
      setErro('Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ifma to-emerald-700 items-center justify-center p-12">
        <div className="text-white text-center max-w-sm">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <LogoRU className="w-14 h-14" />
          </div>
          <h2 className="text-3xl font-bold mb-3 tracking-tight">Restaurante Universitário</h2>
          <p className="text-white/70 text-lg">Gerenciamento de cardápios do IFMA</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <LogoRU className="w-16 h-16" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Acesso Administrativo</h2>
            <p className="text-gray-500 mt-1">Entre com suas credenciais</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5">
            {erro && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 border-l-4 border-l-red-400 text-red-700 px-4 py-3 rounded-xl text-sm">
                <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
                <span>{erro}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@ifma.edu.br"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ifma/20 focus:border-ifma focus:shadow-sm text-sm transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                  placeholder="Sua senha"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ifma/20 focus:border-ifma focus:shadow-sm text-sm transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ifma transition-colors duration-200"
                >
                  {mostrarSenha ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ifma text-white py-2.5 rounded-xl font-medium hover:bg-ifma-dark shadow-sm active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-gray-400 hover:text-ifma transition-colors duration-200">
              Voltar ao cardápio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
