import { useMemo, useState } from 'react';

import { AlertMessage } from '../../../../components/ui/AlertMessage';
import { Button } from '../../../../components/ui/Button';
import { CheckboxField, InputField, SelectField, TextAreaField } from '../../../../components/ui/FormField';
import { Modal } from '../../../../components/ui/Modal';
import type { Company } from '../../../../types/company';
import type { CreateSensorPayload, Sensor, UpdateSensorPayload } from '../../../../types/sensor';
import { extractApiFieldErrors } from '../../forms/extract-api-field-errors';
import { useCompanyCatalog } from '../use-company-catalog';

/** Payload discriminado: o diálogo sabe se está criando ou alterando. */
export type SensorSubmitPayload =
  | { mode: 'create'; payload: CreateSensorPayload }
  | { mode: 'update'; payload: UpdateSensorPayload };

interface SensorFormDialogProps {
  open: boolean;
  /** `null` para criação; um sensor para edição. */
  sensor: Sensor | null;
  companies: Company[];
  token: string;
  onClose: () => void;
  onSubmit: (submit: SensorSubmitPayload) => Promise<void>;
}

const FIELD_MESSAGES: Record<string, string> = {
  ativoId: 'Selecione o ativo do sensor.',
  esp32Id: 'Selecione o dispositivo ESP32.',
  sensorId: 'Informe o identificador do sensor.',
  tag: 'Informe uma tag de até 50 caracteres.',
  descricao: 'Informe uma descrição de até 100 caracteres.',
};

export function SensorFormDialog({
  open,
  sensor,
  companies,
  token,
  onClose,
  onSubmit,
}: SensorFormDialogProps) {
  // A `key` remonta o formulário a cada abertura/troca de sensor, garantindo
  // estado inicial limpo sem efeitos colaterais.
  return (
    <SensorFormDialogBody
      key={`${sensor?.id ?? 'novo'}-${open ? 'aberto' : 'fechado'}`}
      open={open}
      sensor={sensor}
      companies={companies}
      token={token}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function SensorFormDialogBody({
  open,
  sensor,
  companies,
  token,
  onClose,
  onSubmit,
}: SensorFormDialogProps) {
  const isEditing = sensor !== null;

  const [empresaId, setEmpresaId] = useState('');
  const [setorId, setSetorId] = useState('');
  const [ativoId, setAtivoId] = useState('');
  const [esp32Id, setEsp32Id] = useState('');
  const [sensorId, setSensorId] = useState('');
  const [tag, setTag] = useState(sensor?.tag ?? '');
  const [descricao, setDescricao] = useState(sensor?.descricao ?? '');
  const [ativoStatus, setAtivoStatus] = useState(sensor?.ativoStatus ?? true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { catalog, isLoading: isCatalogLoading } = useCompanyCatalog(token, empresaId ? [empresaId] : []);

  const assetsBySetor = useMemo(() => {
    const grouped = new Map<number, typeof catalog.assets>();
    for (const asset of catalog.assets) {
      const list = grouped.get(asset.setorId) ?? [];
      list.push(asset);
      grouped.set(asset.setorId, list);
    }
    return grouped;
  }, [catalog.assets]);

  const devicesBySetor = useMemo(() => {
    const grouped = new Map<number, typeof catalog.devices>();
    for (const device of catalog.devices) {
      const list = grouped.get(device.setorId) ?? [];
      list.push(device);
      grouped.set(device.setorId, list);
    }
    return grouped;
  }, [catalog.devices]);

  const availableAssets = setorId ? (assetsBySetor.get(Number(setorId)) ?? []) : [];
  const availableDevices = setorId ? (devicesBySetor.get(Number(setorId)) ?? []) : [];

  const handleSubmit = async (): Promise<void> => {
    if (isSaving) return;

    const nextErrors: Record<string, string> = {};

    if (!isEditing) {
      if (ativoId === '') nextErrors.ativoId = FIELD_MESSAGES.ativoId;
      if (esp32Id === '') nextErrors.esp32Id = FIELD_MESSAGES.esp32Id;
      if (sensorId.trim().length === 0) nextErrors.sensorId = FIELD_MESSAGES.sensorId;
    }

    if (tag.length > 50) nextErrors.tag = FIELD_MESSAGES.tag;
    if (descricao.length > 100) nextErrors.descricao = FIELD_MESSAGES.descricao;

    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    try {
      if (isEditing && sensor) {
        await onSubmit({
          mode: 'update',
          payload: {
            tag: tag.trim().length > 0 ? tag.trim() : null,
            descricao: descricao.trim().length > 0 ? descricao.trim() : null,
            ativoStatus,
          },
        });
      } else {
        await onSubmit({
          mode: 'create',
          payload: {
            ativoId: Number(ativoId),
            esp32Id: Number(esp32Id),
            sensorId: sensorId.trim(),
            tag: tag.trim().length > 0 ? tag.trim() : null,
            descricao: descricao.trim().length > 0 ? descricao.trim() : null,
            ativoStatus,
          },
        });
      }
    } catch (error: unknown) {
      const apiErrors = extractApiFieldErrors(error, FIELD_MESSAGES);
      if (Object.keys(apiErrors).length > 0) {
        setErrors(apiErrors);
      } else {
        setFormError(error instanceof Error ? error.message : 'Não foi possível salvar o sensor.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar sensor' : 'Novo sensor'}
      description={
        isEditing
          ? 'Vínculos com ativo, ESP32 e sensorId são imutáveis — apenas os dados descritivos podem ser alterados.'
          : 'Vincule o sensor a um ativo e a um dispositivo ESP32 do mesmo setor.'
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={isSaving}>
            {isSaving ? 'Salvando…' : isEditing ? 'Salvar alterações' : 'Cadastrar sensor'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {formError ? <AlertMessage tone="danger">{formError}</AlertMessage> : null}

        {isEditing && sensor ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <p className="font-semibold text-slate-800">{sensor.tag ?? `Sensor #${sensor.id}`}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              sensorId {sensor.sensorId} · ativo #{sensor.ativoId} · ESP32 #{sensor.esp32Id}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                name="empresa"
                label="Empresa"
                required
                value={empresaId}
                onChange={(value) => {
                  setEmpresaId(value);
                  setSetorId('');
                  setAtivoId('');
                  setEsp32Id('');
                }}
                placeholder="Selecione a empresa"
                disabled={isSaving}
                options={companies.map((company) => ({
                  value: String(company.id),
                  label: company.nome,
                }))}
              />

              <SelectField
                name="setor"
                label="Setor"
                required
                value={setorId}
                onChange={(value) => {
                  setSetorId(value);
                  setAtivoId('');
                  setEsp32Id('');
                }}
                placeholder={
                  empresaId === ''
                    ? 'Selecione a empresa primeiro'
                    : isCatalogLoading
                      ? 'Carregando setores…'
                      : 'Selecione o setor'
                }
                disabled={isSaving || empresaId === '' || isCatalogLoading}
                options={catalog.setores.map((sector) => ({
                  value: String(sector.id),
                  label: sector.nome,
                }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                name="ativo"
                label="Ativo"
                required
                value={ativoId}
                onChange={setAtivoId}
                error={errors.ativoId}
                placeholder={setorId === '' ? 'Selecione o setor primeiro' : 'Selecione o ativo'}
                disabled={isSaving || setorId === ''}
                options={availableAssets.map((asset) => ({
                  value: String(asset.id),
                  label: asset.tag ? `${asset.nome} (${asset.tag})` : asset.nome,
                }))}
              />

              <SelectField
                name="esp32"
                label="Dispositivo ESP32"
                required
                value={esp32Id}
                onChange={setEsp32Id}
                error={errors.esp32Id}
                placeholder={setorId === '' ? 'Selecione o setor primeiro' : 'Selecione o ESP32'}
                disabled={isSaving || setorId === ''}
                options={availableDevices.map((device) => ({
                  value: String(device.id),
                  label: device.espId,
                }))}
              />
            </div>

            <InputField
              name="sensorId"
              label="Identificador do sensor"
              required
              value={sensorId}
              onChange={setSensorId}
              error={errors.sensorId}
              placeholder="sensor_01"
              disabled={isSaving}
            />
          </>
        )}

        <InputField
          name="tag"
          label="Tag"
          value={tag}
          onChange={setTag}
          error={errors.tag}
          placeholder="SN-PRD-001"
          hint="Opcional."
          disabled={isSaving}
        />

        <TextAreaField
          name="descricao"
          label="Descrição"
          value={descricao}
          onChange={setDescricao}
          error={errors.descricao}
          placeholder="Sensor de vazão na saída do tanque de ETA."
          disabled={isSaving}
        />

        <CheckboxField
          name="ativoStatus"
          label="Sensor ativo"
          checked={ativoStatus}
          onChange={setAtivoStatus}
          disabled={isSaving}
        />
      </div>
    </Modal>
  );
}
