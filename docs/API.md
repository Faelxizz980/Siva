# Guia da API REST

Este documento complementa a documentação interativa: com o servidor rodando, a versão sempre-atualizada e navegável fica em `http://localhost:3000/docs` (Swagger UI), gerada a partir de [`src/docs/openapi.ts`](../src/docs/openapi.ts). Aqui você encontra as convenções gerais e exemplos completos de request/response — a lista de campos de cada schema em detalhe está no Swagger.

## Convenções

- **Base URL**: todas as rotas de negócio ficam sob `/api` (ex.: `http://localhost:3000/api/sectors`). `/api/health` não exige autenticação.
- **Formato de resposta** — toda resposta é um envelope JSON:
  ```json
  { "success": true, "data": { }, "meta": { } }
  ```
  `meta` só aparece em listagens paginadas. Erros usam `success: false` — ver [ERROR_HANDLING.md](./ERROR_HANDLING.md).
- **Paginação** — listagens aceitam `?page=1&pageSize=20` (`pageSize` máximo 100) e devolvem:
  ```json
  { "success": true, "data": [ ], "meta": { "total": 42, "page": 1, "pageSize": 20 } }
  ```
- **Autenticação** — duas formas, nunca misturadas na mesma rota (ver [AUTHENTICATION.md](./AUTHENTICATION.md) para o fluxo completo):
  - `Authorization: Bearer <jwt>` — usuários do dashboard.
  - `X-Token: <token-do-dispositivo>` — só usado por `POST /api/readings` (o firmware do ESP32).
- **Content-Type**: `application/json` em todo request com corpo.

## Catálogo de endpoints

| Método | Rota | Auth | Papéis extras | Descrição |
| --- | --- | --- | --- | --- |
| `GET` | `/api/health` | — | — | Healthcheck (status, modo mock, ambiente) |
| `POST` | `/api/auth/login` | — | — | Login por e-mail/senha, devolve JWT |
| `GET` | `/api/auth/me` | Bearer | — | Dados do usuário autenticado |
| `GET` | `/api/companies` | Bearer | — | Lista empresas (escopado à própria, exceto super_admin) |
| `GET` | `/api/companies/:id` | Bearer | — | Detalhe de uma empresa |
| `POST` | `/api/companies` | Bearer | `super_admin` | Cria empresa |
| `PATCH` | `/api/companies/:id` | Bearer | `super_admin` | Edita empresa |
| `DELETE` | `/api/companies/:id` | Bearer | `super_admin` | Remove empresa |
| `GET` | `/api/users` | Bearer | `super_admin`, `admin_empresa` | Lista usuários (`?empresaId=`) |
| `GET` | `/api/users/:id` | Bearer | `super_admin`, `admin_empresa` | Detalhe de um usuário |
| `POST` | `/api/users` | Bearer | `super_admin`, `admin_empresa` | Cria usuário |
| `PATCH` | `/api/users/:id` | Bearer | `super_admin`, `admin_empresa` | Edita usuário (nome/senha) |
| `DELETE` | `/api/users/:id` | Bearer | `super_admin` | Remove usuário |
| `GET` | `/api/sectors` | Bearer | — | Lista setores (`?empresaId=`) |
| `GET` | `/api/sectors/:id` | Bearer | — | Detalhe de um setor |
| `POST` | `/api/sectors` | Bearer | `super_admin`, `admin_empresa` | Cria setor |
| `PATCH` | `/api/sectors/:id` | Bearer | `super_admin`, `admin_empresa` | Edita setor |
| `DELETE` | `/api/sectors/:id` | Bearer | `super_admin`, `admin_empresa` | Remove setor |
| `GET` | `/api/assets` | Bearer | — | Lista ativos (`?setorId=`, obrigatório) |
| `GET` | `/api/assets/:id` | Bearer | — | Detalhe de um ativo |
| `POST` | `/api/assets` | Bearer | `super_admin`, `admin_empresa` | Cria ativo |
| `PATCH` | `/api/assets/:id` | Bearer | `super_admin`, `admin_empresa` | Edita ativo |
| `DELETE` | `/api/assets/:id` | Bearer | `super_admin`, `admin_empresa` | Remove ativo |
| `GET` | `/api/devices` | Bearer | — | Lista ESP32s (`?setorId=`, obrigatório; token nunca aparece) |
| `GET` | `/api/devices/:id` | Bearer | — | Detalhe de um ESP32 (sem o token) |
| `POST` | `/api/devices` | Bearer | `super_admin`, `admin_empresa` | Cria ESP32 — **token aparece só nesta resposta** |
| `PATCH` | `/api/devices/:id` | Bearer | `super_admin`, `admin_empresa` | Edita descrição do ESP32 |
| `DELETE` | `/api/devices/:id` | Bearer | `super_admin`, `admin_empresa` | Remove ESP32 |
| `GET` | `/api/sensors` | Bearer | — | Lista sensores (`?esp32Id=` e/ou `?ativoId=`) |
| `GET` | `/api/sensors/:id` | Bearer | — | Detalhe de um sensor |
| `POST` | `/api/sensors` | Bearer | `super_admin`, `admin_empresa` | Cria sensor (ativo + esp32 do mesmo setor) |
| `PATCH` | `/api/sensors/:id` | Bearer | `super_admin`, `admin_empresa` | Edita sensor |
| `DELETE` | `/api/sensors/:id` | Bearer | `super_admin`, `admin_empresa` | Remove sensor |
| `GET` | `/api/readings` | Bearer | — | Histórico de leituras (`?sensorId=`, obrigatório) |
| `POST` | `/api/readings` | **X-Token** | — | Ingestão de leitura pelo firmware do ESP32 |
| `GET` | `/api/maintenances` | Bearer | — | Lista chamados (`?sensorId=`, obrigatório) |
| `GET` | `/api/maintenances/:id` | Bearer | — | Detalhe de um chamado |
| `POST` | `/api/maintenances` | Bearer | — | Abre chamado (status sempre `aberto`) |
| `PATCH` | `/api/maintenances/:id` | Bearer | — | Atualiza status/descrição/responsável |
| `DELETE` | `/api/maintenances/:id` | Bearer | — | Remove chamado |
| `GET` | `/api/alerts` | Bearer | — | 🚧 Sempre `501 NOT_IMPLEMENTED` nesta etapa |

## Exemplos completos

### 1. Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "carla.mendes@aquaplas.com",
  "senha": "senha123"
}
```

```json
200 OK
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 2,
      "nome": "Carla Mendes",
      "email": "carla.mendes@aquaplas.com",
      "tipo": "admin_empresa",
      "empresaId": 1,
      "criadoEm": "2026-07-08T22:16:32.630Z"
    }
  }
}
```

Erros possíveis: `401 UNAUTHORIZED` (e-mail ou senha incorretos), `422 VALIDATION_ERROR` (payload fora do formato — `email` inválido ou `senha` ausente).

### 2. Criar um setor

```http
POST /api/sectors
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "empresaId": 1,
  "nome": "Envase"
}
```

```json
201 Created
{
  "success": true,
  "data": { "id": 3, "empresaId": 1, "nome": "Envase", "criadoEm": "2026-08-07T12:00:00.000Z" }
}
```

Erros possíveis: `401 UNAUTHORIZED` (sem token), `403 FORBIDDEN` (usuário tentando criar setor em empresa que não é a sua), `422 VALIDATION_ERROR` (`nome` ausente/curto, `empresaId` ausente).

### 3. Criar um ESP32 (token só aparece aqui)

```http
POST /api/devices
Authorization: Bearer <jwt>
Content-Type: application/json

{ "setorId": 1, "espId": "esp_04", "descricao": "ESP32 da linha de envase" }
```

```json
201 Created
{
  "success": true,
  "data": {
    "id": 4,
    "setorId": 1,
    "espId": "esp_04",
    "token": "dev-abc123xyz...",
    "descricao": "ESP32 da linha de envase",
    "ultimoContato": null,
    "criadoEm": "2026-08-07T12:05:00.000Z"
  }
}
```

Guarde o `token` agora — nenhuma outra chamada (`GET /api/devices` ou `GET /api/devices/:id`) volta a mostrá-lo (ver [BUSINESS_FLOWS.md](./BUSINESS_FLOWS.md#fluxo-2--provisionamento-da-hierarquia-cadastro-inicial-de-uma-empresa)).

### 4. Ingestão de leitura (firmware → API)

```http
POST /api/readings
X-Token: dev-token-esp01
Content-Type: application/json

{ "esp_id": "esp_01", "setor": "producao", "sensor_id": "sensor_01", "vazao": 13.5 }
```

```json
201 Created
{ "success": true, "data": { "id": 76, "sensorId": 1, "vazao": 13.5, "registradoEm": "2026-08-07T02:16:46.881Z" } }
```

Erros possíveis:
- `401 UNAUTHORIZED` — `X-Token` ausente ou inválido.
- `403 FORBIDDEN` — `esp_id` do corpo não corresponde ao dono do token.
- `404 NOT_FOUND` — `sensor_id` não existe para esse ESP32.
- `422 VALIDATION_ERROR` — `vazao` negativa ou ausente.

### 5. Listar leituras (dashboard)

```http
GET /api/readings?sensorId=1&page=1&pageSize=3
Authorization: Bearer <jwt>
```

```json
200 OK
{
  "success": true,
  "data": [
    { "id": 25, "sensorId": 1, "vazao": 12.5, "registradoEm": "2026-08-07T02:16:32.630Z" },
    { "id": 24, "sensorId": 1, "vazao": 12.84, "registradoEm": "2026-08-07T01:16:32.630Z" },
    { "id": 23, "sensorId": 1, "vazao": 12.86, "registradoEm": "2026-08-07T00:16:32.630Z" }
  ],
  "meta": { "total": 25, "page": 1, "pageSize": 3 }
}
```

### 6. Erro de validação cruzada (sensor em setores diferentes)

```http
POST /api/sensors
Authorization: Bearer <jwt>
Content-Type: application/json

{ "ativoId": 1, "esp32Id": 3, "sensorId": "sensor_02" }
```

Se `ativo #1` for do setor 1 e `esp32 #3` for do setor 2:

```json
422 Unprocessable Entity
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "O ativo e o ESP32 informados precisam pertencer ao mesmo setor."
  }
}
```

## Testando sem escrever código

- `npm run simulate:esp32` — simula um ESP32 chamando `POST /api/readings` de verdade, em loop.
- Swagger UI (`/docs`) tem um botão "Try it out" em cada rota.
- Coleção de exemplos via `curl` para todo o fluxo de login → listagem está no [README raiz](../README.md#-como-executar).
