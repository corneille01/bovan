import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressBarProps {
  currentStep: number;
  onGoToStep: (step: number) => void;
  canNavigateTo: (step: number) => boolean;
}

const STEPS = ['Mode', 'Formule', 'Date', 'Heure', 'Activité', 'Réservation', 'Confirmation'];

export const StepProgressBar: React.FC<StepProgressBarProps> = ({ currentStep, onGoToStep, canNavigateTo }) => (
  <nav aria-label="Étapes de la réservation" className="bg-white border-b border-neutral-300">
    <ol className="mx-auto max-w-6xl px-2 sm:px-4 py-2 grid grid-cols-7 gap-1">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const current = step === currentStep;
        const done = step < currentStep;
        const allowed = canNavigateTo(step) && currentStep < 7 && step < 7;
        return (
          <li key={label} className="min-w-0">
            <button
              type="button"
              disabled={!allowed || current}
              onClick={() => onGoToStep(step)}
              aria-current={current ? 'step' : undefined}
              aria-label={`Étape ${step} : ${label}${done ? ', terminée' : ''}`}
              className={`w-full flex flex-col items-center gap-1 py-1 min-h-[44px] border-b-4 ${current ? 'border-[#B84A14]' : done ? 'border-neutral-900' : 'border-neutral-200'} ${allowed && !current ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span
                className={`h-6 w-6 flex items-center justify-center text-xs font-bold tabular-nums ${current ? 'bg-[#B84A14] text-white' : done ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : step}
              </span>
              <span
                className={`hidden md:block text-xs font-semibold truncate max-w-full ${current ? 'text-[#B84A14]' : done ? 'text-neutral-900' : 'text-neutral-500'}`}
              >
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  </nav>
);
