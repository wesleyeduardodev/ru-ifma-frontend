# RU-IFMA Frontend

## Stack

React 19, Vite 7, TailwindCSS 4 (via @tailwindcss/vite), React Router DOM, Axios, date-fns, react-icons

## Como rodar

```bash
npm install
npm run dev    # http://localhost:5173
```

## Estrutura

```
src/
  main.jsx             → Ponto de entrada (BrowserRouter + AuthProvider)
  App.jsx              → Definicao de rotas
  index.css            → Import do TailwindCSS
  services/
    api.js             → Instancia Axios com interceptor Basic Auth
  contexts/
    AuthContext.jsx     → Estado de autenticacao (login/logout/admin)
  components/
    Header.jsx         → Cabecalho com logo RU e navegacao
    PrivateRoute.jsx   → Protege rotas admin (redireciona para /login)
    CardapioCard.jsx   → Card de cardapio (almoco/jantar)
    AdminLayout.jsx    → Layout do painel admin com sidebar
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

- Login via POST /api/auth/login (valida credenciais)
- Credenciais armazenadas em localStorage como base64 (chave: `ru_credentials`)
- Interceptor Axios adiciona header `Authorization: Basic {credentials}` automaticamente
- AuthContext expoe: admin, login(), logout(), loading
- PrivateRoute redireciona para /login se nao autenticado

## Integracao com API

Base URL: `http://localhost:8080`

Todas as chamadas via instancia Axios em `src/services/api.js`:
- `api.get('/api/cardapios?data=YYYY-MM-DD')` → cardapios publicos
- `api.post('/api/cardapios', body)` → criar (autenticado)
- `api.put('/api/cardapios/{id}', body)` → atualizar (autenticado)
- `api.delete('/api/cardapios/{id}')` → deletar (autenticado)
- `api.get('/api/admin')` → listar admins (autenticado)
- `api.post('/api/auth/login', body)` → login (publico)
- `api.get('/api/auth/me')` → admin logado (autenticado)

## Design

- Cores IFMA: verde `#00843D`, branco, cinza claro (`bg-gray-50`)
- Componentes com TailwindCSS (classes utilitarias, sem CSS custom)
- Icones via react-icons (pacote Fi - Feather Icons)
- Responsivo (mobile-first com breakpoints sm/md)
- Cards com bordas arredondadas (`rounded-xl`, `rounded-2xl`), sombras suaves
- Loading spinner com `animate-spin` verde

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
