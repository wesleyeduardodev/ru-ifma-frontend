import { FiSun, FiMoon } from 'react-icons/fi';

export default function CardapioCard({ cardapio }) {
  const isAlmoco = cardapio.tipoRefeicao === 'ALMOCO';

  const itensSecundarios = [
    { label: 'Acompanhamento', valor: cardapio.acompanhamento },
    { label: 'Salada', valor: cardapio.salada },
    { label: 'Sobremesa', valor: cardapio.sobremesa },
    { label: 'Suco', valor: cardapio.suco },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className={`px-4 sm:px-6 py-4 sm:py-5 flex items-center gap-3 text-white ${
        isAlmoco
          ? 'bg-gradient-to-r from-ifma to-emerald-600'
          : 'bg-gradient-to-br from-emerald-800 to-emerald-700'
      }`}>
        {isAlmoco ? <FiSun size={22} className="opacity-80 sm:w-[26px] sm:h-[26px]" /> : <FiMoon size={22} className="opacity-80 sm:w-[26px] sm:h-[26px]" />}
        <h3 className="text-lg sm:text-xl font-bold">{isAlmoco ? 'Almoço' : 'Jantar'}</h3>
      </div>

      <div className="p-4 sm:p-6">
        <div className="bg-ifma-50 rounded-xl px-4 sm:px-5 py-3 sm:py-4 mb-4 sm:mb-5">
          <span className="text-[10px] sm:text-[11px] font-bold text-ifma uppercase tracking-widest">Prato Principal</span>
          <p className="text-lg sm:text-xl font-bold text-gray-900 mt-0.5">{cardapio.pratoPrincipal}</p>
        </div>

        <div className="border-t border-gray-100 pt-4 sm:pt-5">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {itensSecundarios.map(({ label, valor }) => (
              <div key={label}>
                <span className="text-[10px] sm:text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">{label}</span>
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{valor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
