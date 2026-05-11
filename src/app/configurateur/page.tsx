'use client';

import { useState } from 'react';
import type { GardeConfig } from '@/modules/ConfigurationStore/types';
import WizardNav from './WizardNav';
import Step1Families from './steps/Step1Families';
import Step2Schedules from './steps/Step2Schedules';
import Step3Hours from './steps/Step3Hours';
import Step4Expenses from './steps/Step4Expenses';
import ResultsSummary from './ResultsSummary';

type WizardState = {
  step: 1 | 2 | 3 | 4;
  config: GardeConfig;
};

const emptyConfig: GardeConfig = {
  families: [],
  children: [],
  weekSchedules: [],
  expenses: [],
  nounouNetSalary: 1500,
  splitRule: 'per-family',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function validateStep(step: 1 | 2 | 3 | 4, config: GardeConfig): string[] {
  const errs: string[] = [];
  if (step === 1) {
    if (config.families.length === 0) errs.push('Ajoutez au moins une famille.');
    const hasUnnamedFamily = config.families.some((f) => !f.name.trim());
    if (hasUnnamedFamily) errs.push('Toutes les familles doivent avoir un nom.');
    if (config.children.length === 0) errs.push('Ajoutez au moins un enfant.');
    const hasUnnamedChild = config.children.some((c) => !c.name.trim());
    if (hasUnnamedChild) errs.push('Tous les enfants doivent avoir un prénom.');
    if (config.nounouNetSalary <= 0) errs.push('Le salaire net mensuel doit être supérieur à 0.');
  }
  if (step === 2) {
    if (config.weekSchedules.length === 0) errs.push('Ajoutez au moins une semaine type.');
    const hasUnnamed = config.weekSchedules.some((s) => !s.name.trim());
    if (hasUnnamed) errs.push('Toutes les semaines types doivent avoir un nom.');
    const hasZeroWeeks = config.weekSchedules.some((s) => s.weeksPerYear <= 0);
    if (hasZeroWeeks) errs.push('Chaque semaine type doit avoir un nombre de semaines > 0.');
    const total = config.weekSchedules.reduce((sum, s) => sum + s.weeksPerYear, 0);
    if (total > 52) errs.push('La somme des semaines dépasse 52.');
  }
  return errs;
}

export default function ConfigurateurPage() {
  const [state, setState] = useState<WizardState>({
    step: 1,
    config: emptyConfig,
  });
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  function setConfig(config: GardeConfig) {
    setState((s) => ({ ...s, config }));
  }

  function goToStep(step: 1 | 2 | 3 | 4) {
    setStepErrors([]);
    setState((s) => ({ ...s, step }));
  }

  function handleNext() {
    const errs = validateStep(state.step, state.config);
    if (errs.length > 0) {
      setStepErrors(errs);
      return;
    }
    setStepErrors([]);
    if (state.step < 4) {
      setState((s) => ({ ...s, step: (s.step + 1) as 1 | 2 | 3 | 4 }));
    }
  }

  function handlePrev() {
    setStepErrors([]);
    if (state.step > 1) {
      setState((s) => ({ ...s, step: (s.step - 1) as 1 | 2 | 3 | 4 }));
    }
  }

  const STEP_TITLES = ['Familles & Enfants', 'Plannings', 'Horaires', 'Frais annexes'];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurateur de garde partagée</h1>
          <p className="mt-1 text-sm text-gray-500">
            Renseignez votre situation en 4 étapes pour obtenir le reste à charge de chaque famille.
          </p>
        </div>

        <WizardNav
          step={state.step}
          config={state.config}
          onStepChange={goToStep}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main form area */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                {STEP_TITLES[state.step - 1]}
              </h2>
              {state.step === 1 && (
                <Step1Families
                  config={state.config}
                  onChange={setConfig}
                  errors={stepErrors}
                />
              )}
              {state.step === 2 && (
                <Step2Schedules
                  config={state.config}
                  onChange={setConfig}
                  errors={stepErrors}
                />
              )}
              {state.step === 3 && (
                <Step3Hours
                  config={state.config}
                  onChange={setConfig}
                  errors={stepErrors}
                />
              )}
              {state.step === 4 && (
                <Step4Expenses
                  config={state.config}
                  onChange={setConfig}
                  errors={stepErrors}
                />
              )}
            </div>
          </div>

          {/* Sidebar: live results */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <ResultsSummary config={state.config} />
            </div>
          </div>
        </div>

        {/* Bottom nav (duplicate for convenience) */}
        <WizardNav
          step={state.step}
          config={state.config}
          onStepChange={goToStep}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </main>
  );
}
