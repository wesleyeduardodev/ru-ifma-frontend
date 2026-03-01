import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiAlertCircle, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import LogoRU from '../components/LogoRU';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [bloqueadoAte, setBloqueadoAte] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!bloqueadoAte) return;

    const atualizar = () => {
      const restante = Math.ceil((bloqueadoAte - Date.now()) / 1000);
      if (restante <= 0) {
        setCountdown(0);
        setBloqueadoAte(null);
        clearInterval(timerRef.current);
      } else {
        setCountdown(restante);
      }
    };

    atualizar();
    timerRef.current = setInterval(atualizar, 1000);
    return () => clearInterval(timerRef.current);
  }, [bloqueadoAte]);

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
    } catch (err) {
      if (err.response?.status === 429) {
        setErro('Muitas tentativas de login. Aguarde 1 minuto.');
        setBloqueadoAte(Date.now() + 60000);
      } else {
        setErro('Erro ao fazer login. Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f4f7f5]">

      <div
        className="hidden lg:block absolute inset-0 animate-[loginReveal_0.8s_ease-out_both]"
        style={{ clipPath: 'polygon(0 0, 58% 0, 36% 100%, 0 100%)' }}
      >
        <div className="h-full bg-gradient-to-b from-[#009645] via-ifma to-[#00572A] relative overflow-hidden">
          <div
            className="absolute -top-20 -left-20 w-[500px] h-[500px] border border-white/[0.04] rounded-full"
            style={{ animation: 'loginFloat 20s ease-in-out infinite' }}
          />
          <div
            className="absolute top-[40%] left-[15%] w-72 h-72 border border-white/[0.06] rounded-full"
            style={{ animation: 'loginFloat 15s ease-in-out 3s infinite reverse' }}
          />
          <div
            className="absolute bottom-[10%] left-[5%] w-40 h-40 border-2 border-white/[0.03] rotate-45"
            style={{ animation: 'loginFloat 18s ease-in-out 1s infinite' }}
          />
        </div>
      </div>

      <div
        className="lg:hidden absolute top-0 inset-x-0 h-[46vh] animate-[loginFadeIn_0.6s_ease-out_both]"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 72%, 0 100%)' }}
      >
        <div className="h-full bg-gradient-to-br from-[#009645] via-ifma to-[#00572A] relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 border border-white/[0.05] rounded-full" />
          <div className="absolute bottom-[25%] left-[8%] w-24 h-24 border border-white/[0.04] rounded-full" />
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">

        <div className="lg:w-[43%] shrink-0 flex items-start lg:items-center justify-center pt-12 lg:pt-0 pb-4 lg:pb-0">
          <div className="text-center lg:text-left px-8 animate-[loginFadeInUp_0.7s_0.15s_both]">
            <div className="w-16 h-16 lg:w-[72px] lg:h-[72px] bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-5 ring-1 ring-white/[0.08] shadow-lg shadow-black/10">
              <LogoRU className="w-10 h-10 lg:w-12 lg:h-12" />
            </div>
            <h1 className="font-heading text-[1.75rem] lg:text-[2.5rem] text-white leading-[1.1] tracking-tight">
              Restaurante{' '}<br className="hidden lg:block" />Universitário
            </h1>
            <div className="flex items-center gap-3 mt-4 lg:mt-5 justify-center lg:justify-start">
              <span className="w-6 h-px bg-white/20" />
              <p className="text-white/40 text-[0.65rem] tracking-[0.25em] uppercase font-medium">
                Instituto Federal do Maranhão
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-start lg:items-center justify-center px-5 pb-10 lg:pb-0 lg:pr-[8%]">
          <div className="w-full max-w-[400px] lg:max-w-[420px]">

            <div className="bg-white rounded-2xl shadow-[0_4px_32px_-8px_rgba(0,0,0,0.1)] overflow-hidden animate-[loginFadeInUp_0.7s_0.35s_both]">
              <div className="h-1 bg-gradient-to-r from-ifma via-emerald-400 to-ifma" />

              <div className="p-7 lg:p-9">
                <div className="mb-7">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                    Acesso Administrativo
                  </h2>
                  <p className="text-gray-400 text-sm mt-1.5">
                    Entre com suas credenciais
                  </p>
                </div>

                {erro && (
                  <div className="flex items-start gap-2.5 bg-red-50/80 border-l-[3px] border-l-red-400 text-red-600 px-4 py-3 rounded-r-lg text-sm mb-6 animate-[loginShake_0.4s_ease-out]">
                    <FiAlertCircle className="shrink-0 mt-0.5" size={15} />
                    <span className="font-medium">{erro}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Email</label>
                    <div className="relative group">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-ifma transition-colors duration-300" size={16} />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="seu@ifma.edu.br"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border-0 border-b-2 border-gray-100 rounded-t-xl text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:bg-white focus:border-ifma transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">Senha</label>
                    <div className="relative group">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-ifma transition-colors duration-300" size={16} />
                      <input
                        type={mostrarSenha ? 'text' : 'password'}
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                        required
                        placeholder="Sua senha"
                        className="w-full pl-10 pr-10 py-3 bg-gray-50/80 border-0 border-b-2 border-gray-100 rounded-t-xl text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:bg-white focus:border-ifma transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-ifma transition-colors duration-200 p-0.5"
                      >
                        {mostrarSenha ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || countdown > 0}
                    className="w-full bg-ifma text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:bg-ifma-dark hover:-translate-y-px shadow-lg shadow-ifma/25 hover:shadow-xl hover:shadow-ifma/30 active:translate-y-0 active:shadow-md transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none disabled:cursor-not-allowed mt-1"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Entrando...
                      </span>
                    ) : countdown > 0 ? (
                      `Aguarde ${countdown}s`
                    ) : (
                      'Entrar'
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="text-center mt-6 animate-[loginFadeInUp_0.7s_0.55s_both]">
              <Link
                to="/"
                className="group inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-ifma transition-colors duration-200"
              >
                <FiArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
                Voltar ao cardápio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
