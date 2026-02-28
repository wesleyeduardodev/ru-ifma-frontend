function EstadoVazio({ icone: Icone, titulo, descricao }) {
  return (
    <div className="text-center py-14 px-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Icone size={24} className="text-gray-400" />
      </div>
      <p className="text-gray-700 font-semibold mb-1.5">{titulo}</p>
      {descricao && <p className="text-gray-400 text-sm max-w-xs mx-auto">{descricao}</p>}
    </div>
  )
}

export default EstadoVazio
