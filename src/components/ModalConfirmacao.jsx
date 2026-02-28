import { FiAlertTriangle } from 'react-icons/fi';

export default function ModalConfirmacao({
  aberto,
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  carregando = false,
  onConfirmar,
  onCancelar,
}) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]"
        onClick={carregando ? undefined : onCancelar}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <FiAlertTriangle size={18} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{titulo}</h3>
            <p className="text-sm text-gray-600 mt-1">{mensagem}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancelar}
            disabled={carregando}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={carregando}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
          >
            {carregando ? 'Excluindo...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
