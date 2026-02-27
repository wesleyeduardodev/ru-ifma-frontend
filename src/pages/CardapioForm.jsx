import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

export default function CardapioForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    data: format(new Date(), 'yyyy-MM-dd'),
    tipoRefeicao: 'ALMOCO',
    pratoPrincipal: '',
    acompanhamento: '',
    salada: '',
    sobremesa: '',
    suco: '',
  });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      api.get(`/api/cardapios/${id}`)
        .then(res => {
          const c = res.data;
          setForm({
            data: c.data,
            tipoRefeicao: c.tipoRefeicao,
            pratoPrincipal: c.pratoPrincipal,
            acompanhamento: c.acompanhamento,
            salada: c.salada,
            sobremesa: c.sobremesa,
            suco: c.suco,
          });
        })
        .catch(() => navigate('/admin/cardapios'));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/api/cardapios/${id}`, form);
      } else {
        await api.post('/api/cardapios', form);
      }
      navigate('/admin/cardapios');
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao salvar cardápio';
      setErro(typeof msg === 'string' ? msg : 'Verifique os campos obrigatórios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/cardapios')} className="text-gray-500 hover:text-gray-700">
          <FiArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {isEditing ? 'Editar Cardápio' : 'Novo Cardápio'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5 max-w-2xl">
        {erro && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{erro}</div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00843D]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Refeição</label>
            <select
              name="tipoRefeicao"
              value={form.tipoRefeicao}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00843D]"
            >
              <option value="ALMOCO">Almoço</option>
              <option value="JANTAR">Jantar</option>
            </select>
          </div>
        </div>

        <Field label="Prato Principal" name="pratoPrincipal" value={form.pratoPrincipal} onChange={handleChange} />
        <Field label="Acompanhamento" name="acompanhamento" value={form.acompanhamento} onChange={handleChange} />
        <Field label="Salada" name="salada" value={form.salada} onChange={handleChange} />
        <Field label="Sobremesa" name="sobremesa" value={form.sobremesa} onChange={handleChange} />
        <Field label="Suco" name="suco" value={form.suco} onChange={handleChange} />

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#00843D] text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition disabled:opacity-50"
        >
          <FiSave size={16} />
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </AdminLayout>
  );
}

function Field({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00843D]"
      />
    </div>
  );
}
