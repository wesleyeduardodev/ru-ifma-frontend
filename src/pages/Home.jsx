import { useState, useEffect, useRef } from 'react';
import { format, addDays, subDays, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import api from '../services/api';
import CardapioCard from '../components/CardapioCard';
import EstadoVazio from '../components/EstadoVazio';

export default function Home() {
  const [data, setData] = useState(new Date());
  const [cardapios, setCardapios] = useState([]);
  const [loading, setLoading] = useState(true);
  const dateInputRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const dataStr = format(data, 'yyyy-MM-dd');
    api.get(`/api/cardapios?data=${dataStr}`)
      .then(res => setCardapios(res.data))
      .catch(() => setCardapios([]))
      .finally(() => setLoading(false));
  }, [data]);

  const dataFormatadaCurta = format(data, "dd 'de' MMM, yyyy", { locale: ptBR });
  const dataFormatadaLonga = format(data, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1 sm:mb-2">Cardápio do Dia</h2>
          <p className="text-gray-500 text-sm sm:text-base">
            {isToday(data)
              ? 'Veja o que temos para você hoje'
              : format(data, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
          <button
            onClick={() => setData(d => subDays(d, 1))}
            className="p-2 sm:p-2.5 rounded-xl bg-white shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md active:scale-95 transition-all duration-200"
          >
            <FiChevronLeft size={18} className="text-gray-600 sm:w-5 sm:h-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => dateInputRef.current?.showPicker?.()}
              className="flex items-center gap-2 bg-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <FiCalendar className="text-ifma shrink-0" size={16} />
              <span className="text-gray-800 font-semibold capitalize text-sm sm:text-base sm:hidden">{dataFormatadaCurta}</span>
              <span className="text-gray-800 font-semibold capitalize text-base hidden sm:inline">{dataFormatadaLonga}</span>
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={format(data, 'yyyy-MM-dd')}
              onChange={e => setData(new Date(e.target.value + 'T12:00:00'))}
              className="absolute inset-0 opacity-0 cursor-pointer"
              tabIndex={-1}
            />
          </div>

          <button
            onClick={() => setData(d => addDays(d, 1))}
            className="p-2 sm:p-2.5 rounded-xl bg-white shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md active:scale-95 transition-all duration-200"
          >
            <FiChevronRight size={18} className="text-gray-600 sm:w-5 sm:h-5" />
          </button>
        </div>

        {!isToday(data) && (
          <div className="flex justify-center mb-6 sm:mb-8">
            <button
              onClick={() => setData(new Date())}
              className="text-xs font-medium text-ifma bg-ifma-50 hover:bg-ifma-light px-3 py-1.5 rounded-full transition-all duration-200"
            >
              Voltar para hoje
            </button>
          </div>
        )}

        {isToday(data) && <div className="mb-6 sm:mb-8" />}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-14 sm:h-16 bg-gray-200" />
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="h-12 sm:h-14 bg-gray-100 rounded-xl" />
                  <div className="border-t border-gray-100 pt-4">
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {[1, 2, 3, 4].map(j => (
                        <div key={j} className="space-y-2">
                          <div className="h-3 w-16 sm:w-20 bg-gray-100 rounded" />
                          <div className="h-4 w-full bg-gray-100 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : cardapios.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
            {cardapios.map(c => (
              <CardapioCard key={c.id} cardapio={c} />
            ))}
          </div>
        ) : (
          <EstadoVazio
            icone={FiCalendar}
            titulo="Nenhum cardápio cadastrado"
            descricao={`Não encontramos refeições para ${format(data, "dd 'de' MMMM", { locale: ptBR })}. Tente outra data.`}
          />
        )}
      </div>
    </div>
  );
}
