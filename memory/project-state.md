# Project State

Data: 2026-09-23 (consolidado da sessão completa)

## Sessão de hoje — histórico completo

1. Lido `ai.md` — mentalidade Senior Backend SIVA (clareza→segurança→manutenibilidade→escalabilidade→performance; fluxo requisito→análise→planejamento→implementação→validação→testes→revisão).
2. Análise da estrutura do sistema + divergência MySQL real × PostgreSQL do `ai.md`.
3. Lido `opneai.md` (arquivo com erro de digitação; seria `openai.md`) — spec para gerar `docs/backend-architecture.md`; terminava truncado em `Expliq`.
4. Gerado `docs/backend-architecture.md` (visão, stack, camadas, 8 entidades, 3 perfis, rotas, gaps, riscos).
5. Gerado `docs/backend-functionalities.json` (13 funcionalidades separadas; validado `JSON OK`).
6. Análise somente-leitura das regras vendedora×cliente → gerado `docs/analise-regras-negocio.md` (22 seções; sem tocar código).
7. Consolidação definitiva: MANUTENÇÃO INTERNA = funcionário + preventiva/inspeção; ATENDIMENTO = cliente + Chamado + operador + OS; sem `Manutencao.alvo`; cargo≠perfil.
8. Executado `separação.md` (Engenharia de Contexto): criados `AI.md` + `spec/` (31) + `decisions/` (ADR-006–009) + `tasks/` (3) + `memory/` (4). Apagados `separação.md` e `opneai.md` após consolidação.

## Implementado (código)

- Auth dupla: JWT (usuários) + X-Token (ESP32).
- CRUDs: users, companies, sectors, assets, devices, sensors; readings imutável; maintenances CRUD parcial.
- Envelope `{success,data,meta}`, paginação, erros centralizados, MOCK_MODE, Swagger `/docs`.

## Parcial

- `maintenances` sem `authorize`, sem dono, sem filtros globais (PROB-001).
- Isolamento só cliente×cliente; vendedora×clientes ausente (PROB-002/003).
- JWT stateless; `company.service` sem actor; FK destino sem revalidação.

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
