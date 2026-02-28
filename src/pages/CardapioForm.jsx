import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { FiSave, FiArrowLeft, FiAlertCircle, FiMoon, FiSun } from 'react-icons/fi';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import CampoFormulario from '../components/CampoFormulario';

const inputClasses = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ifma/20 focus:border-ifma text-sm transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed';

const criarFormularioItens = () => ({
  pratoPrincipal: '',
  acompanhamento: '',
  salada: '',
  sobremesa: '',
  suco: '',
});

const possuiConteudo = (formulario) => Object.values(formulario).some(valor => valor.trim() !== '');
const possuiCamposObrigatorios = (formulario) => Object.values(formulario).every(valor => valor.trim() !== '');

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

  const [dataCadastro, setDataCadastro] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formAlmoco, setFormAlmoco] = useState(criarFormularioItens());
  const [formJantar, setFormJantar] = useState(criarFormularioItens());
  const [tiposExistentes, setTiposExistentes] = useState([]);
  const [carregandoTipos, setCarregandoTipos] = useState(false);

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
  }, [id, isEditing, navigate]);

  useEffect(() => {
    if (isEditing) return;

    setCarregandoTipos(true);
    api.get(`/api/cardapios?data=${dataCadastro}`)
      .then(res => {
        const tipos = Array.isArray(res.data)
          ? res.data.map(cardapio => cardapio.tipoRefeicao)
          : [];
        setTiposExistentes(tipos);
      })
      .catch(() => setTiposExistentes([]))
      .finally(() => setCarregandoTipos(false));
  }, [dataCadastro, isEditing]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleChangeItens = (tipo, campo, valor) => {
    if (tipo === 'ALMOCO') {
      setFormAlmoco(prev => ({ ...prev, [campo]: valor }));
      return;
    }
    setFormJantar(prev => ({ ...prev, [campo]: valor }));
  };

  const enviarCadastro = async () => {
    const almocoJaCadastrado = tiposExistentes.includes('ALMOCO');
    const jantarJaCadastrado = tiposExistentes.includes('JANTAR');

    if (almocoJaCadastrado && jantarJaCadastrado) {
      setErro('Almoço e jantar já estão cadastrados para esta data.');
      return;
    }

    const payloads = [];

    if (!almocoJaCadastrado && possuiConteudo(formAlmoco)) {
      if (!possuiCamposObrigatorios(formAlmoco)) {
        setErro('Preencha todos os campos do cardápio de almoço.');
        return;
      }
      payloads.push({ data: dataCadastro, tipoRefeicao: 'ALMOCO', ...formAlmoco });
    }

    if (!jantarJaCadastrado && possuiConteudo(formJantar)) {
      if (!possuiCamposObrigatorios(formJantar)) {
        setErro('Preencha todos os campos do cardápio de jantar.');
        return;
      }
      payloads.push({ data: dataCadastro, tipoRefeicao: 'JANTAR', ...formJantar });
    }

    if (payloads.length === 0) {
      setErro('Preencha ao menos um cardápio (almoço ou jantar) para salvar.');
      return;
    }

    await Promise.all(payloads.map(payload => api.post('/api/cardapios', payload)));
    navigate('/admin/cardapios');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      if (isEditing) {
        await api.put(`/api/cardapios/${id}`, form);
        navigate('/admin/cardapios');
        return;
      }

      await enviarCadastro();
    } catch (err) {
      const msg = err.response?.data?.erro || 'Erro ao salvar cardápio';
      setErro(typeof msg === 'string' ? msg : 'Verifique os campos obrigatórios');
    } finally {
      setLoading(false);
    }
  };

  const almocoJaCadastrado = tiposExistentes.includes('ALMOCO');
  const jantarJaCadastrado = tiposExistentes.includes('JANTAR');

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

      <form onSubmit={handleSubmit} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${isEditing ? 'max-w-2xl' : 'max-w-6xl'}`}>
        {erro && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 border-l-4 border-l-red-400 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
            <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
            <span>{erro}</span>
          </div>
        )}

        {isEditing ? (
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
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Informações gerais</h3>
              <div className="max-w-sm">
                <CampoFormulario label="Data">
                  <input
                    type="date"
                    value={dataCadastro}
                    onChange={(e) => setDataCadastro(e.target.value)}
                    required
                    className={inputClasses}
                  />
                </CampoFormulario>
              </div>
              {(almocoJaCadastrado || jantarJaCadastrado) && (
                <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 border-l-4 border-l-amber-400 text-amber-800 px-4 py-3 rounded-xl text-sm">
                  <FiAlertCircle className="shrink-0 mt-0.5" size={16} />
                  <span>
                    Já existe cadastro nesta data para: {almocoJaCadastrado && 'almoço'}
                    {almocoJaCadastrado && jantarJaCadastrado && ' e '}
                    {jantarJaCadastrado && 'jantar'}.
                  </span>
                </div>
              )}
            </div>

            <hr className="border-gray-100" />

            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Itens do cardápio</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-100/50 p-4 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <FiSun className="text-ifma" size={16} /> Almoço
                    </h4>
                    {almocoJaCadastrado && (
                      <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full">Já cadastrado</span>
                    )}
                  </div>
                  <CampoFormulario label="Prato Principal" destaque>
                    <input
                      type="text"
                      value={formAlmoco.pratoPrincipal}
                      onChange={(e) => handleChangeItens('ALMOCO', 'pratoPrincipal', e.target.value)}
                      disabled={almocoJaCadastrado || carregandoTipos || loading}
                      className={inputClasses}
                    />
                  </CampoFormulario>
                  <CampoFormulario label="Acompanhamento">
                    <input
                      type="text"
                      value={formAlmoco.acompanhamento}
                      onChange={(e) => handleChangeItens('ALMOCO', 'acompanhamento', e.target.value)}
                      disabled={almocoJaCadastrado || carregandoTipos || loading}
                      className={inputClasses}
                    />
                  </CampoFormulario>
                  <CampoFormulario label="Salada">
                    <input
                      type="text"
                      value={formAlmoco.salada}
                      onChange={(e) => handleChangeItens('ALMOCO', 'salada', e.target.value)}
                      disabled={almocoJaCadastrado || carregandoTipos || loading}
                      className={inputClasses}
                    />
                  </CampoFormulario>
                  <CampoFormulario label="Sobremesa">
                    <input
                      type="text"
                      value={formAlmoco.sobremesa}
                      onChange={(e) => handleChangeItens('ALMOCO', 'sobremesa', e.target.value)}
                      disabled={almocoJaCadastrado || carregandoTipos || loading}
                      className={inputClasses}
                    />
                  </CampoFormulario>
                  <CampoFormulario label="Suco">
                    <input
                      type="text"
                      value={formAlmoco.suco}
                      onChange={(e) => handleChangeItens('ALMOCO', 'suco', e.target.value)}
                      disabled={almocoJaCadastrado || carregandoTipos || loading}
                      className={inputClasses}
                    />
                  </CampoFormulario>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-100/50 p-4 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <FiMoon className="text-blue-600" size={16} /> Jantar
                    </h4>
                    {jantarJaCadastrado && (
                      <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full">Já cadastrado</span>
                    )}
                  </div>
                  <CampoFormulario label="Prato Principal" destaque>
                    <input
                      type="text"
                      value={formJantar.pratoPrincipal}
                      onChange={(e) => handleChangeItens('JANTAR', 'pratoPrincipal', e.target.value)}
                      disabled={jantarJaCadastrado || carregandoTipos || loading}
                      className={inputClasses}
                    />
                  </CampoFormulario>
                  <CampoFormulario label="Acompanhamento">
                    <input
                      type="text"
                      value={formJantar.acompanhamento}
                      onChange={(e) => handleChangeItens('JANTAR', 'acompanhamento', e.target.value)}
                      disabled={jantarJaCadastrado || carregandoTipos || loading}
                      className={inputClasses}
                    />
                  </CampoFormulario>
                  <CampoFormulario label="Salada">
                    <input
                      type="text"
                      value={formJantar.salada}
                      onChange={(e) => handleChangeItens('JANTAR', 'salada', e.target.value)}
                      disabled={jantarJaCadastrado || carregandoTipos || loading}
                      className={inputClasses}
                    />
                  </CampoFormulario>
                  <CampoFormulario label="Sobremesa">
                    <input
                      type="text"
                      value={formJantar.sobremesa}
                      onChange={(e) => handleChangeItens('JANTAR', 'sobremesa', e.target.value)}
                      disabled={jantarJaCadastrado || carregandoTipos || loading}
                      className={inputClasses}
                    />
                  </CampoFormulario>
                  <CampoFormulario label="Suco">
                    <input
                      type="text"
                      value={formJantar.suco}
                      onChange={(e) => handleChangeItens('JANTAR', 'suco', e.target.value)}
                      disabled={jantarJaCadastrado || carregandoTipos || loading}
                      className={inputClasses}
                    />
                  </CampoFormulario>
                </div>
              </div>
            </div>
          </div>
        )}

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
