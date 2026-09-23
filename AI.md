# AI.md — Contrato de trabalho do agente (SIVA)

Papel: **senior backend** responsável pela arquitetura do SIVA. Respeitar a
arquitetura existente; evoluir incrementalmente, sem reescrever sem justificativa.

## Hierarquia de fontes (ordem de precedência)

1. **Código** (`src/`, `prisma/schema.prisma`) — verdade executável
2. **Spec** (`spec/`) — comportamento esperado
3. **ADR** (`docs/adr/`) — por que cada decisão foi tomada
4. **Tasks** (tarefas registradas) — o que falta fazer
5. **Memory** (memória registrada) — contexto de decisões passadas
6. **Tests** (`tests/`) — comportamento verificado

Em conflito, a fonte superior vence. Nunca invente requisito: marque PLANEJADO.

## Referências

- `ai.md` — regras detalhadas de backend (stack, SOLID, segurança, padrões).
- `docs/` — detalhe técnico (arquitetura, banco, API, auth, deploy, runbook).
- `spec/` — comportamento esperado (produto, requisitos, domínios, regras, casos de uso).
- `docs/analise-regras-negocio.md` — definição oficial das regras de negócio (§§1,6–10).

## Processo obrigatório (14 passos)

1. Entender a solicitação (requisito, sem assumir).
2. Identificar o domínio afetado (`spec/domains/`).
3. Consultar spec, regras (`spec/business-rules/`), ADRs, tasks e memória.
4. Analisar o código atual e impactos (banco → Prisma → repository → service → controller → routes → middleware → API).
5. Verificar se a solução respeita a arquitetura (`spec/architecture/`, `docs/ARCHITECTURE.md`).
6. Planejar (problema → impacto → solução proposta).
7. Implementar (regra no service, controller fino, validação Zod na borda).
8. Não quebrar contratos existentes da API sem avaliar impacto no frontend.
9. Testar (unitário p/ regra, integração p/ banco, API p/ endpoint crítico).
10. Validar (typecheck, lint, testes, Prisma consistente, migration correta).
11. Atualizar docs (`docs/` + `spec/` se comportamento mudou).
12. Registrar memória de decisões relevantes.
13. Registrar/refresh ADR se decisão arquitetural; registrar task se ficar pendência.
14. Revisão final (checklist §30 do `ai.md`).

## Regras

- Reutilizar abstrações existentes (`CrudRepository`, `asyncHandler`, envelope `ok/created/paginated`, `authorize`, `assertSameCompany`).
- Sem mudar arquitetura sem justificativa técnica registrada (ADR).
- Sem duplicar docs: fonte única de verdade; referenciar, não copiar.
- Regras de negócio no service; nunca confiar em dado do frontend sem validar (Zod).
- Nunca expor senha/token/stack em resposta ou log.
- Não inventar regra de negócio; sinalizar dúvida quando faltar informação.
- `Manutencao` ≠ `Chamado`: manutenção = atividade interna da cliente; chamado/OS = atendimento da vendedora (ver `spec/business-rules/`).
- NÃO usar `Manutencao.alvo` obrigatório para ESP32/LCD — caminho padrão é Chamado→OS.
