# RU-IFMA Frontend

## Stack

React 19, Vite 7, TailwindCSS 4 (via @tailwindcss/vite), React Router DOM, Axios, date-fns, react-icons, Google Fonts (Instrument Serif)

## Como rodar

```bash
npm install
npm run dev    # http://localhost:5173
```

## Variaveis de ambiente

- `VITE_API_URL` - URL da API (default: `http://localhost:8080`)
- Arquivo `.env.development` para desenvolvimento local
- Arquivo `.env.example` como template (commitado no repositorio)
- Arquivos `.env` e `.env.*` estao no `.gitignore` (exceto `.env.example`)

## Estrutura

```
src/
  main.jsx             → Ponto de entrada (BrowserRouter + AuthProvider)
  App.jsx              → Definicao de rotas
  index.css            → Import do TailwindCSS
  services/
    api.js             → Instancia Axios com interceptors (auth + 401)
  contexts/
    AuthContext.jsx     → Estado de autenticacao (login/logout/admin)
  components/
    Header.jsx         → Cabecalho com logo RU e navegacao
    Footer.jsx         → Rodape da aplicacao
    LogoRU.jsx         → Componente SVG do logo do RU
    PrivateRoute.jsx   → Protege rotas admin (redireciona para /login)
    CardapioCard.jsx   → Card de cardapio (almoco/jantar)
    AdminLayout.jsx    → Layout do painel admin com sidebar
    CampoFormulario.jsx → Campo de formulario reutilizavel com label
    EstadoVazio.jsx    → Componente de estado vazio (icone + mensagem)
    ModalConfirmacao.jsx → Modal de confirmacao reutilizavel
    PaginaHeader.jsx   → Header de pagina com titulo, subtitulo e acao
  pages/
    Home.jsx           → Pagina publica com cardapio do dia
    Login.jsx          → Formulario de login
    Dashboard.jsx      → Visao geral com contadores
    CardapioList.jsx   → Listagem de cardapios (admin)
    CardapioForm.jsx   → Criar/editar cardapio (admin)
    AdminList.jsx      → Listagem de administradores (admin)
    AdminForm.jsx      → Criar/editar administrador (admin)
```

## Rotas

| Rota                                | Componente     | Acesso   |
|-------------------------------------|----------------|----------|
| /                                   | Home           | Publico  |
| /login                              | Login          | Publico  |
| /admin                              | Dashboard      | Admin    |
| /admin/cardapios                    | CardapioList   | Admin    |
| /admin/cardapios/novo               | CardapioForm   | Admin    |
| /admin/cardapios/:id/editar         | CardapioForm   | Admin    |
| /admin/administradores              | AdminList      | Admin    |
| /admin/administradores/novo         | AdminForm      | Admin    |
| /admin/administradores/:id/editar   | AdminForm      | Admin    |

## Autenticacao

- Login via POST /api/auth/login (retorna accessToken + refreshToken em cookie)
- AccessToken armazenado em memoria (nao persiste entre abas)
- RefreshToken armazenado em cookie HttpOnly com SameSite=Strict
- Interceptor de request: adiciona header `Authorization: Bearer {accessToken}` automaticamente
- Interceptor de response: ao receber 401, tenta renovar token via POST /api/auth/refresh (com fila para requisicoes concorrentes)
- Silent refresh: AuthProvider tenta renovar token no mount (checa refresh cookie)
- Logout: POST /api/auth/logout invalida refresh token e limpa cookie
- AuthContext expoe: admin, login(), logout(), loading
- PrivateRoute redireciona para /login se nao autenticado

## Regras de negocio no frontend

- Admin principal (`admin@ifma.edu.br`) nao aparece na listagem de administradores
- Senha minima de 8 caracteres validada no formulario de admin (frontend + backend)

## Integracao com API

Base URL: configurada via `VITE_API_URL` (fallback: `http://localhost:8080`)

Todas as chamadas via instancia Axios em `src/services/api.js`:
- `api.get('/api/cardapios?data=YYYY-MM-DD')` → cardapios publicos
- `api.post('/api/cardapios', body)` → criar (autenticado)
- `api.put('/api/cardapios/{id}', body)` → atualizar (autenticado)
- `api.delete('/api/cardapios/{id}')` → deletar (autenticado)
- `api.get('/api/admin')` → listar admins (autenticado)
- `api.post('/api/auth/login', body)` → login, retorna accessToken + admin, cookie com refreshToken (publico)
- `api.post('/api/auth/refresh')` → renova tokens, retorna novo accessToken, novo cookie (publico, com refresh token cookie)
- `api.post('/api/auth/logout')` → invalida refresh token e limpa cookie (autenticado)
- `api.get('/api/auth/me')` → admin logado (autenticado)
- `api.put('/api/auth/alterar-senha', body)` → altera senha e invalida todos refresh tokens (autenticado)

## Deploy

- Hospedado na Vercel
- Variavel `VITE_API_URL` configurada no painel da Vercel
- Headers de seguranca configurados no `vercel.json` (CSP, HSTS, X-Frame-Options, etc)
- Sourcemaps desabilitados no build de producao

## Design

- Cores IFMA: verde `#00843D`, branco, cinza claro (`bg-gray-50`)
- Componentes com TailwindCSS (classes utilitarias, sem CSS custom)
- Icones via react-icons (pacote Fi - Feather Icons)
- Fontes: Inter via Google Fonts (corpo), Instrument Serif via Google Fonts (headings)
- Responsivo (mobile-first com breakpoints sm/md)
- Cards com bordas arredondadas (`rounded-xl`, `rounded-2xl`), sombras suaves
- Loading spinner com `animate-spin` verde
- Login com layout diagonal, animacoes CSS (loginReveal, loginFadeIn, loginFadeInUp, loginShake, loginFloat)

## REGRA OBRIGATORIA: Acentuacao em portugues

Todos os textos visiveis ao usuario DEVEM ter acentuacao correta em portugues.
Isso inclui: labels, botoes, mensagens, placeholders, titulos, erros, tooltips.

Exemplos corretos:
- "Cardapio" → "Cardápio"
- "Refeicao" → "Refeição"
- "Proximo" → "Próximo"
- "Nao encontrado" → "Não encontrado"
- "Descricao" → "Descrição"
- "Obrigatorio" → "Obrigatório"
- "Acoes" → "Ações"
- "Administracao" → "Administração"

## Convencoes

- Componentes funcionais com hooks (nunca class components)
- Logica de API separada em services (componentes nao fazem fetch direto)
- Estado global via Context API (nao Redux)
- Codigo em portugues (nomes de componentes, variaveis, funcoes)
- Sem comentarios no codigo — autoexplicativo
- Sem emojis em lugar nenhum
- Imports organizados no topo de cada arquivo
