import { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import api from '../services/api';
import CardapioCard from '../components/CardapioCard';

export default function Home() {
  const [data, setData] = useState(new Date());
  const [cardapios, setCardapios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const dataStr = format(data, 'yyyy-MM-dd');
    api.get(`/api/cardapios?data=${dataStr}`)
      .then(res => setCardapios(res.data))
      .catch(() => setCardapios([]))
      .finally(() => setLoading(false));
  }, [data]);

  const dataFormatada = format(data, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Cardápio do Dia</h2>
          <p className="text-gray-500">Confira o que preparamos para você hoje</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setData(d => subDays(d, 1))}
            className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition"
          >
            <FiChevronLeft size={20} className="text-gray-600" />
          </button>

          <div className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-sm border border-gray-200">
            <FiCalendar className="text-[#00843D]" />
            <span className="text-gray-700 font-medium capitalize">{dataFormatada}</span>
          </div>

          <button
            onClick={() => setData(d => addDays(d, 1))}
            className="p-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition"
          >
            <FiChevronRight size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="flex justify-center mb-8">
          <input
            type="date"
            value={format(data, 'yyyy-MM-dd')}
            onChange={e => setData(new Date(e.target.value + 'T12:00:00'))}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#00843D] focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00843D]"></div>
          </div>
        ) : cardapios.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {cardapios.map(c => (
              <CardapioCard key={c.id} cardapio={c} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <FiCalendar size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Nenhum cardápio cadastrado para esta data</p>
            <p className="text-gray-400 text-sm mt-1">Selecione outra data ou volte mais tarde</p>
          </div>
        )}
      </div>
    </div>
  );
}
