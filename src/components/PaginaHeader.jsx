function PaginaHeader({ titulo, subtitulo, acao }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">{titulo}</h2>
        {subtitulo && <p className="text-sm text-gray-500 mt-0.5">{subtitulo}</p>}
      </div>
      {acao && <div className="shrink-0">{acao}</div>}
    </div>
  )
}

export default PaginaHeader
