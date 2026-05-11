'use client';

import { useState, useEffect, useRef } from 'react';
import type { GardeConfig } from '@/modules/ConfigurationStore/types';
import type { AggregatedResult } from '@/modules/CostAggregator/types';

function isConfigSufficient(config: GardeConfig): boolean {
  if (config.families.length === 0) return false;
  if (config.children.length === 0) return false;
  if (config.nounouNetSalary <= 0) return false;
  if (config.weekSchedules.length === 0) return false;
  return config.weekSchedules.some((schedule) =>
    Object.values(schedule.days).some((dayEntries) =>
      dayEntries.some((entry) => entry.slots.length > 0)
    )
  );
}

type Status =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; data: AggregatedResult }
  | { type: 'error'; message: string };

type Props = {
  config: GardeConfig;
};

export default function ResultsSummary({ config }: Props) {
  const [status, setStatus] = useState<Status>({ type: 'idle' });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const configKey = JSON.stringify(config);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!isConfigSufficient(config)) {
        setStatus({ type: 'idle' });
        return;
      }

      setStatus({ type: 'loading' });

      fetch('/api/aggregate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json();
            throw new Error((data as { error?: string }).error ?? 'Erreur serveur');
          }
          return res.json() as Promise<AggregatedResult>;
        })
        .then((data) => setStatus({ type: 'success', data }))
        .catch((err: unknown) =>
          setStatus({
            type: 'error',
            message: err instanceof Error ? err.message : 'Erreur inconnue',
          })
        );
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey]);

  const sufficient = isConfigSufficient(config);

  if (!sufficient) {
    return (
      <div className="rounded border border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
        Complétez la configuration pour voir les résultats (au moins 1 famille, 1 enfant,
        1 planning avec des horaires, et un salaire &gt; 0).
      </div>
    );
  }

  if (status.type === 'idle' || status.type === 'loading') {
    return (
      <div className="rounded border border-blue-100 bg-blue-50 p-4 text-sm text-blue-600">
        {status.type === 'loading' ? 'Calcul en cours...' : 'En attente…'}
      </div>
    );
  }

  if (status.type === 'error') {
    return (
      <div className="rounded border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
        Impossible de calculer : {status.message}
      </div>
    );
  }

  const result = status.data;

  return (
    <div className="rounded border border-blue-100 bg-blue-50 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-blue-900">Aperçu des résultats</h3>
      <p className="text-xs text-blue-700">
        Coût employeur total :{' '}
        <span className="font-semibold">{result.totalEmployerCost.toFixed(2)} €/mois</span>
      </p>
      <div className="space-y-2">
        {result.families.map((f) => (
          <div key={f.familyId} className="rounded bg-white border border-blue-100 p-2.5 text-xs space-y-0.5">
            <p className="font-medium text-gray-800">{f.familyName || 'Famille sans nom'}</p>
            <div className="text-gray-600 grid grid-cols-2 gap-x-4">
              <span>Part brute : {f.grossShare.toFixed(2)} €</span>
              <span>CMG déduit : -{f.cmgDeduction.toFixed(2)} €</span>
              <span>Frais : +{f.expensesShare.toFixed(2)} €</span>
              <span className="font-semibold text-blue-800 col-span-2">
                Reste à charge : {f.netCharge.toFixed(2)} €/mois
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
