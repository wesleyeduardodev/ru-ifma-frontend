function CampoFormulario({ label, destaque, children }) {
  return (
    <div className={destaque ? 'bg-ifma-50 rounded-xl p-4' : ''}>
      <label className={`block text-sm font-semibold mb-1.5 ${destaque ? 'text-ifma' : 'text-gray-700'}`}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default CampoFormulario
