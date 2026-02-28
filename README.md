# RU-IFMA Frontend

Interface web do sistema de cardapios do Restaurante Universitario do IFMA.

## Tecnologias

- React 19
- Vite 7
- TailwindCSS 4
- React Router DOM
- Axios
- date-fns
- react-icons (Feather Icons)

## Pre-requisitos

- Node.js 18+
- npm 9+
- Backend rodando (local ou remoto)

## Instalacao

```bash
git clone https://github.com/seu-usuario/ru-ifma.git
cd ru-ifma/ru-ifma-frontend
npm install
```

## Configuracao

Crie um arquivo `.env.development` na raiz do frontend (use `.env.example` como base):

```bash
cp .env.example .env.development
```

Edite o arquivo com a URL do backend:

```env
VITE_API_URL=http://localhost:8080
```

Para producao, configure a variavel `VITE_API_URL` no painel da Vercel.

## Executando

```bash
npm run dev
```

Acesse http://localhost:5173

## Build de producao

```bash
npm run build
```

Os arquivos serao gerados em `dist/`. Sourcemaps estao desabilitados por seguranca.

## Estrutura do projeto

```
src/
  main.jsx              Ponto de entrada
  App.jsx               Definicao de rotas
  index.css             Import do TailwindCSS
  services/
    api.js              Cliente HTTP (Axios + interceptors)
  contexts/
    AuthContext.jsx      Estado global de autenticacao
  components/
    Header.jsx           Cabecalho com navegacao
    Footer.jsx           Rodape
    LogoRU.jsx           Logo SVG do RU
    PrivateRoute.jsx     Protecao de rotas admin
    AdminLayout.jsx      Layout do painel admin
    CardapioCard.jsx     Card de cardapio
    CampoFormulario.jsx  Campo de formulario reutilizavel
    EstadoVazio.jsx      Estado vazio com icone
    ModalConfirmacao.jsx Modal de confirmacao
    PaginaHeader.jsx     Header de pagina admin
  pages/
    Home.jsx             Cardapio do dia (publico)
    Login.jsx            Formulario de login
    Dashboard.jsx        Painel admin
    CardapioList.jsx     Listagem de cardapios
    CardapioForm.jsx     Criar/editar cardapio
    AdminList.jsx        Listagem de administradores
    AdminForm.jsx        Criar/editar administrador
```

## Rotas

| Rota | Acesso | Descricao |
|------|--------|-----------|
| `/` | Publico | Cardapio do dia |
| `/login` | Publico | Login do administrador |
| `/admin` | Admin | Dashboard |
| `/admin/cardapios` | Admin | Gerenciar cardapios |
| `/admin/cardapios/novo` | Admin | Novo cardapio |
| `/admin/cardapios/:id/editar` | Admin | Editar cardapio |
| `/admin/administradores` | Admin | Gerenciar admins |
| `/admin/administradores/novo` | Admin | Novo admin |
| `/admin/administradores/:id/editar` | Admin | Editar admin |

## Autenticacao

O sistema usa HTTP Basic Auth. As credenciais sao armazenadas em `sessionStorage` (apagadas ao fechar o navegador) e enviadas automaticamente pelo interceptor do Axios.

Ao receber uma resposta 401 do backend, o sistema limpa as credenciais e redireciona para `/login`.

## Deploy

O frontend esta hospedado na **Vercel**. A configuracao de deploy inclui:

- Headers de seguranca (CSP, HSTS, X-Frame-Options) via `vercel.json`
- Variavel de ambiente `VITE_API_URL` configurada no painel da Vercel
- SPA fallback via rewrite no `vercel.json`

## Licenca

Projeto academico - IFMA
