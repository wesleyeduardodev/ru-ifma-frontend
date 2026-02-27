import { FiSun, FiMoon } from 'react-icons/fi';

export default function CardapioCard({ cardapio }) {
  const isAlmoco = cardapio.tipoRefeicao === 'ALMOCO';

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition">
      <div className={`px-6 py-4 flex items-center gap-3 ${isAlmoco ? 'bg-[#00843D]' : 'bg-emerald-800'} text-white`}>
        {isAlmoco ? <FiSun size={24} /> : <FiMoon size={24} />}
        <h3 className="text-xl font-bold">{isAlmoco ? 'Almoço' : 'Jantar'}</h3>
      </div>
      <div className="p-6 space-y-3">
        <Item label="Prato Principal" value={cardapio.pratoPrincipal} />
        <Item label="Acompanhamento" value={cardapio.acompanhamento} />
        <Item label="Salada" value={cardapio.salada} />
        <Item label="Sobremesa" value={cardapio.sobremesa} />
        <Item label="Suco" value={cardapio.suco} />
      </div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-semibold text-[#00843D] uppercase tracking-wide">{label}</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
