'use client';

import { nanoid } from 'nanoid';
import type { GardeConfig } from '@/modules/ConfigurationStore/types';

type Props = {
  config: GardeConfig;
  onChange: (config: GardeConfig) => void;
  errors: string[];
};

export default function Step1Families({ config, onChange, errors }: Props) {
  function addFamily() {
    onChange({
      ...config,
      families: [
        ...config.families,
        {
          id: nanoid(),
          name: '',
          annualNetRevenue: 0,
          youngestChildAge: 0,
          declaredMonthlyHours: 0,
          actualCMGOverride: undefined,
        },
      ],
    });
  }

  function removeFamily(id: string) {
    onChange({
      ...config,
      families: config.families.filter((f) => f.id !== id),
      children: config.children.filter((c) => c.familyId !== id),
    });
  }

  function updateFamily(id: string, field: string, value: string | number | undefined) {
    onChange({
      ...config,
      families: config.families.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      ),
    });
  }

  function addChild() {
    if (config.families.length === 0) return;
    onChange({
      ...config,
      children: [
        ...config.children,
        { id: nanoid(), familyId: config.families[0].id, name: '' },
      ],
    });
  }

  function removeChild(id: string) {
    onChange({
      ...config,
      children: config.children.filter((c) => c.id !== id),
    });
  }

  function updateChild(id: string, field: string, value: string) {
    onChange({
      ...config,
      children: config.children.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  }

  return (
    <div className="space-y-8">
      {errors.length > 0 && (
        <div className="rounded border border-red-200 bg-red-50 p-3 space-y-1">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-700">{e}</p>
          ))}
        </div>
      )}

      {/* Salary & split rule */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-gray-900">Configuration générale</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Salaire net mensuel souhaité (€)</span>
            <input
              type="number"
              min={0}
              value={config.nounouNetSalary}
              onChange={(e) => onChange({ ...config, nounouNetSalary: Number(e.target.value) })}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Règle de répartition</span>
            <select
              value={config.splitRule}
              onChange={(e) => onChange({ ...config, splitRule: e.target.value as 'per-family' | 'per-child' })}
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="per-family">Parts égales entre familles</option>
              <option value="per-child">Proportionnel aux heures</option>
            </select>
          </label>
        </div>
      </section>

      {/* Families */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Familles</h2>
          <button
            onClick={addFamily}
            className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            + Ajouter une famille
          </button>
        </div>
        {config.families.length === 0 && (
          <p className="text-sm text-gray-500 italic">Aucune famille. Ajoutez-en une pour commencer.</p>
        )}
        {config.families.map((family, idx) => (
          <div key={family.id} className="rounded border border-gray-200 p-4 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Famille {idx + 1}</span>
              <button
                onClick={() => removeFamily(family.id)}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Nom *</span>
                <input
                  type="text"
                  value={family.name}
                  onChange={(e) => updateFamily(family.id, 'name', e.target.value)}
                  placeholder="Famille Dupont"
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Revenu annuel net (€)</span>
                <input
                  type="number"
                  min={0}
                  value={family.annualNetRevenue}
                  onChange={(e) => updateFamily(family.id, 'annualNetRevenue', Number(e.target.value))}
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Âge du plus jeune enfant</span>
                <input
                  type="number"
                  min={0}
                  max={18}
                  value={family.youngestChildAge}
                  onChange={(e) => updateFamily(family.id, 'youngestChildAge', Number(e.target.value))}
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-gray-600">Heures mensuelles déclarées Pajemploi</span>
                <input
                  type="number"
                  min={0}
                  value={family.declaredMonthlyHours}
                  onChange={(e) => updateFamily(family.id, 'declaredMonthlyHours', Number(e.target.value))}
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-gray-600">CMG réel (€/mois, optionnel — laissez vide pour calcul auto)</span>
                <input
                  type="number"
                  min={0}
                  value={family.actualCMGOverride ?? ''}
                  onChange={(e) => updateFamily(
                    family.id,
                    'actualCMGOverride',
                    e.target.value === '' ? undefined : Number(e.target.value)
                  )}
                  placeholder="Calcul automatique"
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </label>
            </div>
          </div>
        ))}
      </section>

      {/* Children */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Enfants</h2>
          <button
            onClick={addChild}
            disabled={config.families.length === 0}
            className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + Ajouter un enfant
          </button>
        </div>
        {config.families.length === 0 && (
          <p className="text-sm text-gray-500 italic">Ajoutez d&apos;abord une famille pour créer des enfants.</p>
        )}
        {config.children.length === 0 && config.families.length > 0 && (
          <p className="text-sm text-gray-500 italic">Aucun enfant. Ajoutez-en un.</p>
        )}
        {config.children.map((child, idx) => (
          <div key={child.id} className="rounded border border-gray-200 p-3 flex flex-wrap gap-3 items-end bg-gray-50">
            <span className="text-sm font-medium text-gray-700 self-center">Enfant {idx + 1}</span>
            <label className="block flex-1 min-w-[140px]">
              <span className="text-xs font-medium text-gray-600">Prénom *</span>
              <input
                type="text"
                value={child.name}
                onChange={(e) => updateChild(child.id, 'name', e.target.value)}
                placeholder="Emma"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="block flex-1 min-w-[140px]">
              <span className="text-xs font-medium text-gray-600">Famille *</span>
              <select
                value={child.familyId}
                onChange={(e) => updateChild(child.id, 'familyId', e.target.value)}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                {config.families.map((f) => (
                  <option key={f.id} value={f.id}>{f.name || `Famille sans nom`}</option>
                ))}
              </select>
            </label>
            <button
              onClick={() => removeChild(child.id)}
              className="text-xs text-red-500 hover:text-red-700 self-end pb-1.5"
            >
              Supprimer
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
