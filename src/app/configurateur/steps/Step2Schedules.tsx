'use client';

import { nanoid } from 'nanoid';
import type { GardeConfig } from '@/modules/ConfigurationStore/types';

type Props = {
  config: GardeConfig;
  onChange: (config: GardeConfig) => void;
  errors: string[];
};

export default function Step2Schedules({ config, onChange, errors }: Props) {
  const totalWeeks = config.weekSchedules.reduce((sum, s) => sum + s.weeksPerYear, 0);

  function addSchedule() {
    onChange({
      ...config,
      weekSchedules: [
        ...config.weekSchedules,
        { id: nanoid(), name: '', weeksPerYear: 0, days: {} },
      ],
    });
  }

  function removeSchedule(id: string) {
    onChange({
      ...config,
      weekSchedules: config.weekSchedules.filter((s) => s.id !== id),
    });
  }

  function updateSchedule(id: string, field: 'name' | 'weeksPerYear', value: string | number) {
    onChange({
      ...config,
      weekSchedules: config.weekSchedules.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    });
  }

  return (
    <div className="space-y-6">
      {errors.length > 0 && (
        <div className="rounded border border-red-200 bg-red-50 p-3 space-y-1">
          {errors.map((e, i) => (
            <p key={i} className="text-sm text-red-700">{e}</p>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Semaines types</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Total déclaré : <span className={totalWeeks > 52 ? 'text-red-600 font-semibold' : 'text-gray-700'}>{totalWeeks} semaines</span> / 52 max
          </p>
        </div>
        <button
          onClick={addSchedule}
          className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          + Ajouter une semaine type
        </button>
      </div>

      {totalWeeks > 52 && (
        <div className="rounded border border-orange-200 bg-orange-50 p-3">
          <p className="text-sm text-orange-700">
            Le total dépasse 52 semaines. Réduisez le nombre de semaines dans vos plannings.
          </p>
        </div>
      )}

      {config.weekSchedules.length === 0 && (
        <p className="text-sm text-gray-500 italic">Aucune semaine type. Ajoutez-en une.</p>
      )}

      {config.weekSchedules.map((schedule, idx) => (
        <div key={schedule.id} className="rounded border border-gray-200 p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Semaine type {idx + 1}</span>
            <button
              onClick={() => removeSchedule(schedule.id)}
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
                value={schedule.name}
                onChange={(e) => updateSchedule(schedule.id, 'name', e.target.value)}
                placeholder="Semaine classique"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600">Nombre de semaines / an *</span>
              <input
                type="number"
                min={0}
                max={52}
                value={schedule.weeksPerYear}
                onChange={(e) => updateSchedule(schedule.id, 'weeksPerYear', Number(e.target.value))}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
