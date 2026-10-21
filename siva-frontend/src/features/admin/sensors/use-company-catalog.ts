import { useMemo } from 'react';

import { useAsyncData } from '../../../hooks/use-async-data';
import { catalogService } from '../../../services/catalog/catalog.service';
import type { Asset, Device, Sector } from '../../../types/catalog';

export interface CompanyCatalog {
  setores: Sector[];
  assets: Asset[];
  devices: Device[];
}

const EMPTY_CATALOG: CompanyCatalog = { setores: [], assets: [], devices: [] };

/**
 * Carrega o catálogo de um conjunto de empresas: setores, ativos e dispositivos ESP32.
 *
 * O back-end exige `setorId` nas listas de ativos e dispositivos, então a
 * carga é feita em cascata (empresa → setores → ativos/dispositivos).
 */
export function useCompanyCatalog(
  token: string,
  empresaIds: string[],
): { catalog: CompanyCatalog; isLoading: boolean } {
  const key = empresaIds.join(',');

  const { data, isLoading } = useAsyncData<CompanyCatalog>(async () => {
    if (empresaIds.length === 0) return EMPTY_CATALOG;

    const sectorResults = await Promise.all(
      empresaIds.map((id) => catalogService.sectors(token, Number(id))),
    );
    const allSectors = sectorResults.flatMap((result) => result.items);

    const perSector = await Promise.all(
      allSectors.map(async (sector) => {
        const [assets, devices] = await Promise.all([
          catalogService.assets(token, sector.id),
          catalogService.devices(token, sector.id),
        ]);
        return { assets: assets.items, devices: devices.items };
      }),
    );

    return {
      setores: allSectors,
      assets: perSector.flatMap((entry) => entry.assets),
      devices: perSector.flatMap((entry) => entry.devices),
    };
  }, `${token}:${key}`);

  const catalog = useMemo(() => data ?? EMPTY_CATALOG, [data]);

  return { catalog, isLoading };
}
