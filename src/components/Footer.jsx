import { Link } from 'react-router-dom';
import LogoRU from './LogoRU';

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="bg-ifma/95 backdrop-blur-sm text-white">
      <div className="h-px bg-gradient-to-r from-white/0 via-white/20 to-white/0" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoRU className="w-9 h-9" />
            <div>
              <p className="text-sm font-semibold text-white">Restaurante Universitário</p>
              <p className="text-xs text-white/70">IFMA - Instituto Federal do Maranhão</p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm text-white/70 hover:text-white transition-colors duration-200">
              Cardápio
            </Link>
            <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors duration-200">
              Login
            </Link>
          </nav>
        </div>

        <div className="border-t border-white/15 mt-6 pt-6 text-center">
          <p className="text-xs text-white/50">
            {anoAtual} IFMA - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
