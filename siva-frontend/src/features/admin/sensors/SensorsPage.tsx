import { useMemo, useState } from 'react';
import { Pencil, Plus, Radio, RefreshCw, Trash2 } from 'lucide-react';

import { AlertMessage } from '../../../components/ui/AlertMessage';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { DataTable } from '../../../components/ui/DataTable';
import type { DataTableColumn } from '../../../components/ui/DataTable';
import { EmptyState } from '../../../components/ui/EmptyState';
import { SelectField } from '../../../components/ui/FormField';
import { LoadingBlock } from '../../../components/ui/LoadingBlock';
import { Pagination } from '../../../components/ui/Pagination';
import { useAsyncData } from '../../../hooks/use-async-data';
import { companyService } from '../../../services/companies/company.service';
import { sensorService } from '../../../services/sensors/sensor.service';
import type { Sensor } from '../../../types/sensor';
import { formatDate } from '../../../utils/format';
import { useAuthenticatedSession } from '../../auth/hooks/use-authenticated-session';
import { AdminTopbar } from '../layout/AdminTopbar';
import { useAdminLayout } from '../layout/admin-layout-context';
import { SensorFormDialog } from './components/SensorFormDialog';
import type { SensorSubmitPayload } from './components/SensorFormDialog';
import { useCompanyCatalog } from './use-company-catalog';

const PAGE_SIZE = 10;

export default function SensorsPage() {
  const { openMenu } = useAdminLayout();
  const session = useAuthenticatedSession();

  const [page, setPage] = useState(1);
  const [filterEmpresaId, setFilterEmpresaId] = useState('');
  const [filterSetorId, setFilterSetorId] = useState('');
  const [filterAtivoId, setFilterAtivoId] = useState('');
  const [filterEsp32Id, setFilterEsp32Id] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Sensor | null>(null);
  const [sensorToDelete, setSensorToDelete] = useState<Sensor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const { data: companies } = useAsyncData(() => {
    if (!session) return Promise.reject(new Error('Sessão expirada.'));
    return companyService.list(session.token, { page: 1, pageSize: 100 });
  }, session?.token);

  const { catalog } = useCompanyCatalog(
    session?.token ?? '',
    useMemo(
      () => (companies?.items ?? []).map((company) => String(company.id)),
      [companies],
    ),
  );

  const { data, isLoading, error, reload } = useAsyncData(() => {
    if (!session) return Promise.reject(new Error('Sessão expirada.'));
    return sensorService.list(session.token, {
      page,
      pageSize: PAGE_SIZE,
      ativoId: filterAtivoId ? Number(filterAtivoId) : null,
      esp32Id: filterEsp32Id ? Number(filterEsp32Id) : null,
    });
  }, `${session?.token ?? ''}:${page}:${filterAtivoId}:${filterEsp32Id}`);

  if (!session) return null;

  const availableSectors = filterEmpresaId
    ? catalog.setores.filter((sector) => sector.empresaId === Number(filterEmpresaId))
    : catalog.setores;

  const availableAssets = filterSetorId
    ? catalog.assets.filter((asset) => asset.setorId === Number(filterSetorId))
    : catalog.assets;
  const availableDevices = filterSetorId
    ? catalog.devices.filter((device) => device.setorId === Number(filterSetorId))
    : catalog.devices;

  const handleSubmit = async (submit: SensorSubmitPayload): Promise<void> => {
    if (submit.mode === 'update' && editing) {
      await sensorService.update(session.token, editing.id, submit.payload);
      setActionSuccess('Sensor atualizado.');
    } else if (submit.mode === 'create') {
      await sensorService.create(session.token, submit.payload);
      setActionSuccess('Sensor cadastrado.');
    }
    setIsFormOpen(false);
    reload();
  };

  const handleDelete = async (): Promise<void> => {
    if (!sensorToDelete) return;

    setIsDeleting(true);
    setActionError(null);
    try {
      await sensorService.remove(session.token, sensorToDelete.id);
      setActionSuccess('Sensor excluído.');
      setSensorToDelete(null);
      reload();
    } catch (deleteError: unknown) {
      setActionError(
        deleteError instanceof Error ? deleteError.message : 'Não foi possível excluir o sensor.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: DataTableColumn<Sensor>[] = [
    {
      key: 'tag',
      header: 'Sensor',
      render: (sensor) => (
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-siva-50 text-bright-teal-blue">
            <Radio className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{sensor.tag ?? `Sensor #${sensor.id}`}</p>
            <p className="truncate font-mono text-xs text-slate-500">{sensor.sensorId}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'descricao',
      header: 'Descrição',
      render: (sensor) => (
        <span className="line-clamp-2 max-w-xs text-slate-600">{sensor.descricao ?? '—'}</span>
      ),
    },
    {
      key: 'ativo',
      header: 'Ativo',
      render: (sensor) => {
        const asset = catalog.assets.find((item) => item.id === sensor.ativoId);
        return (
          <div>
            <p className="text-slate-700">{asset?.nome ?? `Ativo #${sensor.ativoId}`}</p>
            {asset?.tag ? <p className="font-mono text-xs text-slate-500">{asset.tag}</p> : null}
          </div>
        );
      },
    },
    {
      key: 'esp32',
      header: 'ESP32',
      render: (sensor) => {
        const device = catalog.devices.find((item) => item.id === sensor.esp32Id);
        return <span className="font-mono text-xs">{device?.espId ?? `ESP32 #${sensor.esp32Id}`}</span>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (sensor) => (
        <Badge tone={sensor.ativoStatus ? 'success' : 'warning'}>
          {sensor.ativoStatus ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'criadoEm',
      header: 'Cadastrado em',
      render: (sensor) => <span className="text-slate-500">{formatDate(sensor.criadoEm)}</span>,
    },
    {
      key: 'acoes',
      header: 'Ações',
      align: 'right',
      render: (sensor) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => {
              setEditing(sensor);
              setActionError(null);
              setIsFormOpen(true);
            }}
            className="inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-siva-50 hover:text-bright-teal-blue"
            aria-label={`Editar sensor ${sensor.tag ?? sensor.id}`}
            title="Editar"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setSensorToDelete(sensor)}
            className="inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label={`Excluir sensor ${sensor.tag ?? sensor.id}`}
            title="Excluir"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminTopbar
        title="Sensores"
        description="Pontos de medição de vazão instalados"
        onOpenMenu={openMenu}
        actions={
          <>
            <Button variant="outline" onClick={reload} disabled={isLoading}>
              <RefreshCw className={isLoading ? 'size-4 animate-spin' : 'size-4'} aria-hidden="true" />
              Atualizar
            </Button>
            <Button
              onClick={() => {
                setEditing(null);
                setActionError(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="size-4" aria-hidden="true" />
              Novo sensor
            </Button>
          </>
        }
      />

      <div className="space-y-4 px-4 py-6 sm:px-6 lg:px-8">
        {actionError ? <AlertMessage tone="danger">{actionError}</AlertMessage> : null}
        {actionSuccess ? <AlertMessage tone="success">{actionSuccess}</AlertMessage> : null}
        {error ? (
          <AlertMessage tone="danger" title="Não foi possível carregar os sensores">
            {error}
          </AlertMessage>
        ) : null}

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SelectField
              name="filtroEmpresa"
              label="Empresa"
              value={filterEmpresaId}
              onChange={(value) => {
                setFilterEmpresaId(value);
                setFilterSetorId('');
                setFilterAtivoId('');
                setFilterEsp32Id('');
                setPage(1);
              }}
              placeholder="Todas as empresas"
              options={(companies?.items ?? []).map((company) => ({
                value: String(company.id),
                label: company.nome,
              }))}
            />

            <SelectField
              name="filtroSetor"
              label="Setor"
              value={filterSetorId}
              onChange={(value) => {
                setFilterSetorId(value);
                setFilterAtivoId('');
                setFilterEsp32Id('');
                setPage(1);
              }}
              placeholder={
                filterEmpresaId === '' ? 'Selecione a empresa primeiro' : 'Todos os setores'
              }
              disabled={filterEmpresaId === ''}
              options={availableSectors.map((sector) => ({
                value: String(sector.id),
                label: sector.nome,
              }))}
            />

            <SelectField
              name="filtroAtivo"
              label="Ativo"
              value={filterAtivoId}
              onChange={(value) => {
                setFilterAtivoId(value);
                setPage(1);
              }}
              placeholder="Todos os ativos"
              options={availableAssets.map((asset) => ({
                value: String(asset.id),
                label: asset.tag ? `${asset.nome} (${asset.tag})` : asset.nome,
              }))}
            />

            <SelectField
              name="filtroEsp32"
              label="ESP32"
              value={filterEsp32Id}
              onChange={(value) => {
                setFilterEsp32Id(value);
                setPage(1);
              }}
              placeholder="Todos os dispositivos"
              options={availableDevices.map((device) => ({
                value: String(device.id),
                label: device.espId,
              }))}
            />
          </div>
        </section>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {isLoading && !data ? (
            <LoadingBlock label="Carregando sensores…" />
          ) : (
            <DataTable
              columns={columns}
              rows={data?.items ?? []}
              rowKey={(sensor) => sensor.id}
              caption="Sensores cadastrados"
              empty={
                <EmptyState
                  icon={Radio}
                  title="Nenhum sensor encontrado"
                  description="Cadastre um sensor vinculando um ativo e um dispositivo ESP32."
                />
              }
            />
          )}

          {data ? (
            <Pagination
              page={data.meta.page}
              totalPages={data.meta.totalPages}
              total={data.meta.total}
              pageSize={data.meta.pageSize}
              onPageChange={setPage}
            />
          ) : null}
        </div>
      </div>

      <SensorFormDialog
        open={isFormOpen}
        sensor={editing}
        companies={companies?.items ?? []}
        token={session.token}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={sensorToDelete !== null}
        title="Excluir sensor"
        description={`O sensor "${sensorToDelete?.tag ?? sensorToDelete?.sensorId ?? ''}" será removido permanentemente, junto com seu vínculo de medição.`}
        confirmLabel="Excluir"
        isLoading={isDeleting}
        onConfirm={() => void handleDelete()}
        onCancel={() => setSensorToDelete(null)}
      />
    </>
  );
}
