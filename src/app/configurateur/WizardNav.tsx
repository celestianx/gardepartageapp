'use client';

import { useState } from 'react';
import type { GardeConfig } from '@/modules/ConfigurationStore/types';

const STEP_LABELS = ['Familles & Enfants', 'Plannings', 'Horaires', 'Frais annexes'];

type WizardNavProps = {
  step: 1 | 2 | 3 | 4;
  config: GardeConfig;
  onStepChange: (step: 1 | 2 | 3 | 4) => void;
  onPrev: () => void;
  onNext: () => void;
};

export default function WizardNav({ step, config, onStepChange, onPrev, onNext }: WizardNavProps) {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [sharing, setSharing] = useState(false);

  async function handleShare() {
    setSharing(true);
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      setShareLink(`${base}/r/${data.id}`);
    } catch {
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSharing(false);
    }
  }

  async function handleCopy() {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Step indicators */}
      <nav className="flex items-center gap-2">
        {STEP_LABELS.map((label, i) => {
          const s = (i + 1) as 1 | 2 | 3 | 4;
          const isCurrent = step === s;
          const isDone = step > s;
          return (
            <button
              key={s}
              onClick={() => onStepChange(s)}
              className={[
                'flex-1 py-2 px-3 rounded text-sm font-medium transition-colors',
                isCurrent
                  ? 'bg-blue-600 text-white'
                  : isDone
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200',
              ].join(' ')}
            >
              <span className="hidden sm:inline">{i + 1}. {label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          );
        })}
      </nav>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onPrev}
          disabled={step === 1}
          className="px-4 py-2 rounded border border-gray-300 text-gray-700 disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          ← Précédent
        </button>

        <span className="text-sm text-gray-500">Étape {step} / 4</span>

        {step < 4 ? (
          <button
            onClick={onNext}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium"
          >
            Suivant →
          </button>
        ) : (
          <button
            onClick={handleShare}
            disabled={sharing}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 text-sm font-medium"
          >
            {sharing ? 'Sauvegarde...' : 'Partager'}
          </button>
        )}
      </div>

      {/* Share link */}
      {shareLink && (
        <div className="rounded border border-green-200 bg-green-50 p-3 flex items-center gap-3">
          <a
            href={shareLink}
            className="text-sm text-green-800 truncate flex-1 underline"
            target="_blank"
            rel="noreferrer"
          >
            {shareLink}
          </a>
          <button
            onClick={handleCopy}
            className="shrink-0 px-3 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
          >
            {copying ? 'Copié !' : 'Copier le lien'}
          </button>
        </div>
      )}
    </div>
  );
}
