# Pending Decisions

Nenhuma decisão tomada. Aguardando definição.

1. Operador: todas as clientes ou só atribuídas? Quem atribui?
2. Quem abre Chamado (funcionário direto ou só via gestor)? Quem vê quais chamados?
3. Cardinalidade Chamado→OS (1-N ou 1-1)? OS sem chamado permitida?
4. Corretiva interna do sensor permitida ou só via OS?
5. Renomear `admin_empresa` → `gestor` (ou alias)? → RESOLVIDO 2026-10-13:
   `ADMIN|GESTOR|TECNICO` + `especialidade MECANICO|ELETRICISTA` implementados
   (migration `db/migrations/001_roles_status.sql`).
6. SLA/prioridade/custo/anexos obrigatórios?
7. MySQL × Postgres; `db.sql` × Prisma como fonte da verdade?
