# Project State

Data: 2026-10-13 (migração ADMIN/GESTOR/TECNICO + integração front-end)

## Sessão 2026-10-13 — implementação completa (ver `memory/sessions/2026-10-13.md`)

1. Análise read-only inicial → `RELATORIO_BACKEND_FRONTEND.md` (estrutura, banco, auth, 40+ endpoints).
2. Leitura de `ai.md` — mentalidade ENTENDER→…→REVISAR assumida.
3. Migração de roles: `super_admin→ADMIN`, `admin_empresa→GESTOR`, `funcionario→TECNICO`
   (+`especialidade` obrigatória p/ TECNICO, +`status ATIVO|INATIVO`, INATIVO não loga).
4. Novos endpoints: `PATCH /users/:id/status`, `GET /companies/:id/details`,
   `GET /companies/:id/users`, `GET /dashboard/admin-summary`.
5. Endurecimento: `POST/PATCH/DELETE /users` só ADMIN; `DELETE`/`remove` com 409 em vínculos;
   `funcionarioId` validado na manutenção; Prisma `P2002/P2003→409`, `P2025→404`;
   `paginated()` + `totalPages`; filtros `?empresaId=&tipo=&status=`.
6. Docs + Swagger + relatório final atualizados. Validação: typecheck/build OK, lint 0 erros, 39/39 testes.

## Sessão 2026-09-23 — histórico completo (consolidado anterior)

1. Lido `ai.md` — mentalidade Senior Backend SIVA (clareza→segurança→manutenibilidade→escalabilidade→performance; fluxo requisito→análise→planejamento→implementação→validação→testes→revisão).
2. Análise da estrutura do sistema + divergência MySQL real × PostgreSQL do `ai.md`.
3. Lido `opneai.md` (arquivo com erro de digitação; seria `openai.md`) — spec para gerar `docs/backend-architecture.md`; terminava truncado em `Expliq`.
4. Gerado `docs/backend-architecture.md` (visão, stack, camadas, 8 entidades, 3 perfis, rotas, gaps, riscos).
5. Gerado `docs/backend-functionalities.json` (13 funcionalidades separadas; validado `JSON OK`).
6. Análise somente-leitura das regras vendedora×cliente → gerado `docs/analise-regras-negocio.md` (22 seções; sem tocar código).
7. Consolidação definitiva: MANUTENÇÃO INTERNA = funcionário + preventiva/inspeção; ATENDIMENTO = cliente + Chamado + operador + OS; sem `Manutencao.alvo`; cargo≠perfil.
8. Executado `separação.md` (Engenharia de Contexto): criados `AI.md` + `spec/` (31) + `decisions/` (ADR-006–009) + `tasks/` (3) + `memory/` (4). Apagados `separação.md` e `opneai.md` após consolidação.

## Implementado (código) — atualizado 2026-10-13

- Auth dupla: JWT (usuários) + X-Token (ESP32). INATIVO bloqueado no login e `/me` (403).
- Roles definitivos: `ADMIN` (global) / `GESTOR` (empresa) / `TECNICO` (empresa + `MECANICO|ELETRICISTA`).
- Status `ATIVO|INATIVO` + `PATCH /users/:id/status` (só ADMIN); escrita de users só ADMIN.
- CRUDs: users, companies (+`/:id/details`, `/:id/users`), sectors, assets, devices, sensors;
  readings imutável; maintenances com `funcionarioId` validado (ATIVO + mesma empresa).
- Dashboard admin com contadores reais; envelope `{success,data,meta+totalPages}`; erros
  Prisma mapeados (409/404); MOCK_MODE; Swagger `/docs` atualizado.

## Parcial (atualizado 2026-10-13)

- `maintenances` agora valida `funcionarioId` (existe/ATIVO/mesma empresa), mas segue sem
  `authorize` na rota e sem dono (`funcionarioId == me`) — PROB-001 parcialmente resolvido.
- Isolamento só cliente×cliente; vendedora×clientes ausente (PROB-002/003).
- JWT stateless sem revogação: token de usuário inativado vale até expirar (PROB-006 parcial).
- Migration criada (`db/migrations/001_roles_status.sql`) mas sem Prisma Migrate unificado (PROB-007 parcial).

## Planejado

- `operador`, `cargo`, `Empresa.tipo` (+ vínculo operador×clientes) — TASK-001.
- `Chamado`, `OrdemServico` (+ rotas, estados) — TASK-002/003.
- Travas maintenances, hardening token/JWT/migration, P3 (agenda, checklist, alertas, dashboard).

## Documentação de contexto (fonte de verdade)

- Contrato: `AI.md` (agente) + `ai.md` (regras backend).
- Esperado: `spec/` (produto, requisitos, 10 domínios, 6 regras, 6 use-cases, 6 arquitetura).
- Decisões: `docs/adr/0001-0005` (base) + `decisions/ADR-006–009` (negócio).
- Detalhe técnico: `docs/` + `docs/backend-architecture.md` + `docs/analise-regras-negocio.md`.
- Trabalho: `tasks/` (backlog TASK-001–008, current, completed).
- Memória: `memory/` (este arquivo, problems, pending, sessions/).

## Próximo passo

- Decidir escopo do operador (todas vs atribuídas — ver `memory/pending.md`) e implementar TASK-001.
