# Domínio: Usuários

**Status: IMPLEMENTADO**

- Entidade/tabela: `Usuario` → `usuario` (`id`, `nome`, `email unique`, `senha`
  hash, `tipo`, `empresa_id?`, `criado_em`).
- Relações: N-1 `Empresa`; 1-N `Manutencao` (como `funcionarioId`).
- Notas: 3 tipos (`super_admin`, `admin_empresa`, `funcionario`).
  `super_admin` tem `empresaId=null` (global). Sem `operador`, sem `cargo` —
  PLANEJADO (ver `spec/business-rules/usuarios-e-permissoes.md`).
