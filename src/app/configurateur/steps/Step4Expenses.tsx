'use client';

import { nanoid } from 'nanoid';
import type { GardeConfig } from '@/modules/ConfigurationStore/types';

type Props = {
  config: GardeConfig;
  onChange: (config: GardeConfig) => void;
  errors: string[];
};

type ExpenseRule = 'equal-split' | 'proportional-to-hours' | 'per-child';

export default function Step4Expenses({ config, onChange, errors }: Props) {
  function addExpense() {
    onChange({
      ...config,
      expenses: [
        ...config.expenses,
        { id: nanoid(), label: '', amount: 0, rule: 'equal-split' as ExpenseRule },
      ],
    });
  }

  function removeExpense(id: string) {
    onChange({
      ...config,
      expenses: config.expenses.filter((e) => e.id !== id),
    });
  }

  function updateExpense(id: string, field: string, value: string | number | undefined) {
    onChange({
      ...config,
      expenses: config.expenses.map((e) =>
        e.id === id ? { ...e, [field]: value } : e
      ),
    });
  }

  const RULE_LABELS: Record<ExpenseRule, string> = {
    'equal-split': 'Parts égales entre familles',
    'proportional-to-hours': 'Proportionnel aux heures',
    'per-child': 'Par enfant (à charge d\'une famille)',
  };

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
          <h2 className="text-base font-semibold text-gray-900">Frais annexes</h2>
          <p className="text-sm text-gray-500 mt-0.5">Repas, fournitures, activités, etc.</p>
        </div>
        <button
          onClick={addExpense}
          className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          + Ajouter un frais
        </button>
      </div>

      {config.expenses.length === 0 && (
        <p className="text-sm text-gray-500 italic">Aucun frais annexe. Cette section est optionnelle.</p>
      )}

      {config.expenses.map((expense, idx) => (
        <div key={expense.id} className="rounded border border-gray-200 p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Frais {idx + 1}</span>
            <button
              onClick={() => removeExpense(expense.id)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Supprimer
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-medium text-gray-600">Libellé</span>
              <input
                type="text"
                value={expense.label}
                onChange={(e) => updateExpense(expense.id, 'label', e.target.value)}
                placeholder="Repas du midi"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-600">Montant mensuel (€)</span>
              <input
                type="number"
                min={0}
                value={expense.amount}
                onChange={(e) => updateExpense(expense.id, 'amount', Number(e.target.value))}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium text-gray-600">Règle de répartition</span>
              <select
                value={expense.rule}
                onChange={(e) => {
                  const rule = e.target.value as ExpenseRule;
                  updateExpense(expense.id, 'rule', rule);
                  if (rule !== 'per-child') {
                    updateExpense(expense.id, 'childId', undefined);
                  }
                }}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                {(Object.entries(RULE_LABELS) as [ExpenseRule, string][]).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
            {expense.rule === 'per-child' && (
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium text-gray-600">Enfant concerné</span>
                <select
                  value={expense.childId ?? ''}
                  onChange={(e) => updateExpense(expense.id, 'childId', e.target.value || undefined)}
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">-- Sélectionner un enfant --</option>
                  {config.children.map((child) => {
                    const family = config.families.find((f) => f.id === child.familyId);
                    return (
                      <option key={child.id} value={child.id}>
                        {child.name || 'Enfant sans nom'}{family ? ` (${family.name || 'Famille sans nom'})` : ''}
                      </option>
                    );
                  })}
                </select>
              </label>
            )}
          </div>
        </div>
      ))}

      {config.expenses.length > 0 && (
        <div className="rounded border border-gray-200 bg-white p-3">
          <p className="text-sm font-medium text-gray-700">
            Total frais annexes :{' '}
            <span className="text-gray-900">
              {config.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)} €/mois
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
