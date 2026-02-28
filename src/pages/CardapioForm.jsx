import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FiSave, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import CampoFormulario from '../components/CampoFormulario';

const inputClasses = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ifma/20 focus:border-ifma text-sm transition-all duration-200';

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
        <button
          onClick={() => navigate('/admin/cardapios')}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
        >
          <FiArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          {isEditing ? 'Editar Cardápio' : 'Novo Cardápio'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        {erro && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 border-l-4 border-l-red-400 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
            <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
            <span>{erro}</span>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Informações gerais</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <CampoFormulario label="Data">
                <input
                  type="date"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </CampoFormulario>
              <CampoFormulario label="Tipo de Refeição">
                <select
                  name="tipoRefeicao"
                  value={form.tipoRefeicao}
                  onChange={handleChange}
                  className={inputClasses}
                >
                  <option value="ALMOCO">Almoço</option>
                  <option value="JANTAR">Jantar</option>
                </select>
              </CampoFormulario>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Itens do cardápio</h3>
            <div className="space-y-4">
              <CampoFormulario label="Prato Principal" destaque>
                <input
                  type="text"
                  name="pratoPrincipal"
                  value={form.pratoPrincipal}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                />
              </CampoFormulario>
              <CampoFormulario label="Acompanhamento">
                <input type="text" name="acompanhamento" value={form.acompanhamento} onChange={handleChange} required className={inputClasses} />
              </CampoFormulario>
              <CampoFormulario label="Salada">
                <input type="text" name="salada" value={form.salada} onChange={handleChange} required className={inputClasses} />
              </CampoFormulario>
              <CampoFormulario label="Sobremesa">
                <input type="text" name="sobremesa" value={form.sobremesa} onChange={handleChange} required className={inputClasses} />
              </CampoFormulario>
              <CampoFormulario label="Suco">
                <input type="text" name="suco" value={form.suco} onChange={handleChange} required className={inputClasses} />
              </CampoFormulario>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-ifma text-white px-6 py-2.5 rounded-xl font-medium hover:bg-ifma-dark shadow-sm active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
          >
            <FiSave size={16} />
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/cardapios')}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
          >
            Cancelar
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
