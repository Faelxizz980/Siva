# SIVA — Front-end

Front-end público do SIVA (página inicial), autenticação e área administrativa integrada à API do back-end.

## Stack

| Item | Versão |
|---|---|
| React | 19 |
| Vite | 8 |
| TypeScript | 6 |
| Tailwind CSS | 4 (`@tailwindcss/vite`) |
| React Router | 7 |
| Lucide React | 1 (ícones) |
| Motion | 13 (animações pontuais: modal e cards do dashboard) |
| Fontsource | Inter (texto) + Manrope (títulos) |
| Oxlint | lint |

## Como rodar

```bash
npm install

# terminal 1 — back-end (a API precisa estar no ar para o login funcionar)
cd .. && npm run dev:mock     # http://localhost:3000, sem MySQL

# terminal 2 — front-end
npm run dev                   # http://localhost:5173
```

Configure a URL da API (padrão: `http://localhost:3000/api`):

```bash
cp .env.example .env
```

> A CORS do back-end é configurada por `CORS_ORIGIN` (ver `../.env.example`).
> O padrão do repositório já é `http://localhost:5173`.

### Credenciais de teste (modo mock do back-end)

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `super@siva.com` | `senha123` |
| Gestor | `carla.mendes@aquaplas.com` | `senha123` |
| Técnico | `diego.ramos@aquaplas.com` | `senha123` |

## Scripts

```bash
npm run dev       # servidor de desenvolvimento
npm run build     # typecheck (tsc -b) + build de produção em dist/
npm run lint      # oxlint
npm run preview   # serve o build de produção
```

## Rotas

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | público | Página inicial institucional |
| `/login` | público | Autenticação |
| `/admin` | ADMIN | Dashboard com o resumo da plataforma |
| `/admin/empresas` | ADMIN | CRUD de empresas + detalhes (`/admin/empresas/:id`) |
| `/admin/usuarios` | ADMIN | CRUD de usuários, ativação/inativação e filtros |
| `/admin/sensores` | ADMIN | CRUD de sensores e filtros em cascata |

A proteção de rota (`<RequireAdmin>`) é apenas UX: **a autorização real é sempre
validada no back-end** (RBAC por `tipo` + isolamento multiempresa).

## Contrato de autenticação

Confirmado em `../src/modules/auth` (back-end):

| Item | Valor |
|---|---|
| Endpoint | `POST /api/auth/login` |
| Body | `{ email: string, senha: string }` |
| Resposta 200 | `{ success: true, data: { token, user } }` |
| Erros | `401` credenciais inválidas · `403` usuário inativo · `422` validação (Zod) · `429` rate limit |
| Mecanismo | JWT stateless (HS256, 8h) via header `Authorization: Bearer <token>` |
| Sessão | `GET /api/auth/me` revalida o token ao abrir o app |

Não há cookie de sessão, refresh token nem logout no servidor: o front-end guarda o
JWT em `localStorage` (chave `siva.auth.session`) e o descarta no logout.

## Endpoints consumidos pela área administrativa

| Recurso | Endpoints | Permissão |
|---|---|---|
| Dashboard | `GET /api/dashboard/admin-summary` | ADMIN |
| Empresas | `GET /api/companies`, `GET /api/companies/:id`, `GET /api/companies/:id/details`, `POST`, `PATCH /:id`, `DELETE /:id` | leitura: autenticado · escrita: ADMIN |
| Usuários | `GET /api/users` (filtros `empresaId`, `tipo`, `status`), `GET /:id`, `POST`, `PATCH /:id`, `PATCH /:id/status`, `DELETE /:id` | leitura: ADMIN/GESTOR · escrita: ADMIN |
| Sensores | `GET /api/sensors` (filtros `esp32Id`, `ativoId`), `GET /:id`, `POST`, `PATCH /:id`, `DELETE /:id` | leitura: autenticado · escrita: ADMIN/GESTOR |
| Apoio | `GET /api/sectors?empresaId`, `GET /api/assets?setorId`, `GET /api/devices?setorId` | autenticado |

Regras de negócio replicadas no front-end (o back-end continua sendo a fonte da verdade):
- `ADMIN` → sem empresa e sem especialidade;
- `GESTOR` → empresa obrigatória, sem especialidade;
- `TECNICO` → empresa e especialidade obrigatórias;
- e-mail duplicado → `409`; empresa/usuário com vínculos → `409` (usar inativação).

## Estrutura

```text
src/
  components/   # brand (logo) e ui (Button, DataTable, Modal, FormField, ...)
  config/       # env (URL da API)
  features/
    admin/      # área administrativa (layout, guard e telas)
      companies/  dashboard/  guards/  layout/  sensors/  users/
    auth/       # contexto, hooks, componentes e persistência da sessão
    landing/    # seções da página inicial
  hooks/        # useAsyncData
  pages/        # LandingPage, LoginPage, ForbiddenPage, NotFoundPage
  services/
    api/        # cliente HTTP (fetch + normalização de erro)
    auth/ companies/ users/ sensors/ dashboard/ catalog/
  types/        # contratos da API
  utils/        # cn, formatação pt-BR
```

A área administrativa é carregada sob demanda (`React.lazy`), isolando `motion` e as
tabelas do bundle público.

## Identidade visual

Tokens centralizados em `src/index.css` (`@theme`, Tailwind CSS 4):

| Token | Hex | Uso |
|---|---|---|
| `yale-blue` | `#00487C` | azul institucional |
| `cool-sky` | `#4BB3FD` | destaques e links sobre fundo escuro |
| `blue-slate` | `#3E6680` | neutros |
| `dodger-blue` | `#0496FF` | botões principais |
| `bright-teal-blue` | `#027BCE` | elementos interativos e foco |

A escala `siva-50…950` deriva as superfícies escuras e neutras.

## Identidade (logo)

- `assets/logo.png` — arquivo original fornecido (1024×1024, RGBA).
- `src/assets/siva-logo.png` — mesmo arquivo com as margens transparentes
  removidas (recorte de bounding box do canal alfa; a arte não foi alterada).
- `public/siva-logo.png` — favicon quadrado (256×256) recortado da gota da marca.

## Observações de operação

- O back-end limita a **100 requisições por minuto** por IP (`RATE_LIMIT_MAX`).
  A UI trata o `429` com mensagem amigável e botão desabilitado durante o envio.
- O servidor de produção precisa de fallback de SPA (redirecionar rotas desconhecidas
  para `index.html`).
