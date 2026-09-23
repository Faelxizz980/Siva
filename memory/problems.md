# Problems

Base: `docs/analise-regras-negocio.md` §19. Status único: Pendente.

## PROB-001 — `maintenances` sem `authorize` / sem dono
- Descrição: rotas de escrita sem `authorize`; service não checa `funcionarioId == me` nem papel gestor.
- Impacto: funcionário altera atividade de outro da mesma empresa.
- Status: Pendente.

## PROB-002 — `company.service` sem actor
- Descrição: service não recebe ator/escopo para checagem de vínculo.
- Impacto: regra de isolamento fora do service, risco de bypass.
- Status: Pendente.

## PROB-003 — `update` sem revalidar FK destino
- Descrição: troca de `empresaId`/`funcionarioId` no update não revalida vínculo destino.
- Impacto: registro pode migrar para empresa indevida.
- Status: Pendente.

## PROB-004 — "Chamado de manutenção" confunde com Chamado
- Descrição: manutenção interna usa rótulo de chamado; solicitação da cliente (Chamado) não existe como entidade.
- Impacto: fluxos interno vs atendimento misturados.
- Status: Pendente.

## PROB-005 — `alerts` 501 sem ocorrência
- Descrição: endpoint de alertas não implementado; nada gera ocorrência automática.
- Impacto: Fluxo 3 (atendimento) sem gatilho automático.
- Status: Pendente.

## PROB-006 — Token ESP32 em texto plano + `JWT_SECRET` default
- Descrição: `device.token` gravado sem hash; secret com fallback inseguro.
- Impacto: vazamento de token/secret compromete ingestão e sessões.
- Status: Pendente.

## PROB-007 — `db.sql` × schema sem migration
- Descrição: duas fontes de verdade, sem migration inicial unificada.
- Impacto: deriva de schema entre ambientes.
- Status: Pendente.
