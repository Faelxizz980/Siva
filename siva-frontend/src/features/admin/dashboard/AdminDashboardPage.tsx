import { Building, Radio, RefreshCw, Users, Waypoints } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { AlertMessage } from '../../../components/ui/AlertMessage';
import { Button } from '../../../components/ui/Button';
import { LoadingBlock } from '../../../components/ui/LoadingBlock';
import { StatCard } from '../../../components/ui/StatCard';
import { useAsyncData } from '../../../hooks/use-async-data';
import { formatNumber } from '../../../utils/format';
import { dashboardService } from '../../../services/dashboard/dashboard.service';
import { useAuthenticatedSession } from '../../auth/hooks/use-authenticated-session';
import { AdminTopbar } from '../layout/AdminTopbar';
import { useAdminLayout } from '../layout/admin-layout-context';

const FUNCIONARIO_CARDS = [
  { key: 'gestores', label: 'Gestores' },
  { key: 'tecnicos', label: 'Técnicos' },
  { key: 'mecanicos', label: 'Mecânicos' },
  { key: 'eletricistas', label: 'Eletricistas' },
  { key: 'ativos', label: 'Usuários ativos' },
  { key: 'inativos', label: 'Usuários inativos' },
] as const;

export default function AdminDashboardPage() {
  const { openMenu } = useAdminLayout();
  const session = useAuthenticatedSession();
  const prefersReducedMotion = useReducedMotion();

  const { data, isLoading, error, reload } = useAsyncData(() => {
    if (!session) return Promise.reject(new Error('Sessão expirada.'));
    return dashboardService.adminSummary(session.token);
  }, session?.token);

  if (!session) return null;

  return (
    <>
      <AdminTopbar
        title="Dashboard"
        description="Resumo operacional da plataforma"
        onOpenMenu={openMenu}
        actions={
          <Button variant="outline" onClick={reload} disabled={isLoading}>
            <RefreshCw className={isLoading ? 'size-4 animate-spin' : 'size-4'} aria-hidden="true" />
            Atualizar
          </Button>
        }
      />

      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {error ? (
          <AlertMessage tone="danger" title="Não foi possível carregar o resumo">
            {error}
          </AlertMessage>
        ) : null}

        {isLoading && !data ? (
          <LoadingBlock label="Carregando indicadores…" />
        ) : data ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Empresas', value: data.nEmpresas, icon: Building, hint: 'Contratantes ativas' },
                { label: 'Funcionários', value: data.nFuncionarios, icon: Users, hint: 'Contas de acesso' },
                { label: 'Sensores', value: data.nSensores, icon: Radio, hint: 'Pontos de medição' },
                { label: 'ESP32', value: data.nEsp32, icon: Waypoints, hint: 'Dispositivos IoT' },
              ].map((card, index) => (
                <motion.div
                  key={card.label}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: prefersReducedMotion ? 0 : index * 0.05 }}
                >
                  <StatCard label={card.label} value={formatNumber(card.value)} icon={card.icon} hint={card.hint} />
                </motion.div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Distribuição de funcionários
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Contagens calculadas pelo back-end a partir dos usuários cadastrados.
                </p>

                <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {FUNCIONARIO_CARDS.map((item) => (
                    <div
                      key={item.key}
                      className="rounded-lg border border-slate-200 bg-slate-50/70 px-4 py-3"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {item.label}
                      </dt>
                      <dd className="mt-1 font-display text-2xl font-extrabold text-slate-900">
                        {formatNumber(data.funcionarios[item.key])}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="rounded-xl border border-slate-200 bg-siva-900 p-5 shadow-sm">
                <h2 className="font-display text-lg font-bold text-white">Como ler estes números</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  O resumo é calculado pelo servidor a cada carregamento, com base nas empresas,
                  usuários, sensores e dispositivos registrados no banco de dados do SIVA.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Um usuário <strong className="text-slate-200">inativo</strong> continua vinculado ao
                  histórico, mas não consegue entrar no sistema.
                </p>
              </section>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
