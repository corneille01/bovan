import React from 'react';
import { Check } from 'lucide-react';

interface StepProgressBarProps {
  currentStep: number;
  onGoToStep: (step: number) => void;
  canNavigateTo: (step: number) => boolean;
}

const STEPS = [
  { step: 1, label: 'Mode' },
  { step: 2, label: 'Pack' },
  { step: 3, label: 'Date' },
  { step: 4, label: 'Créneau' },
  { step: 5, label: 'Activité' },
  { step: 6, label: 'Paiement' },
  { step: 7, label: 'Confirmation' }
];

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  onGoToStep,
  canNavigateTo
}) => {
  return (
    <div className="bg-white border-b-2 border-neutral-900 py-2.5 px-3 sm:px-4 shadow-xs w-full">
      <div className="mx-auto max-w-6xl">
        {/* Mobile step progress indicator */}
        <div className="md:hidden flex items-center justify-between text-xs font-bold text-neutral-900">
          <div className="flex items-center gap-2">
            <span className="bg-[#B84A14] text-white px-2 py-0.5 font-mono text-[11px]">
              {currentStep} / 7
            </span>
            <span className="uppercase tracking-wide">
              {STEPS[currentStep - 1]?.label}
            </span>
          </div>
          <div className="flex gap-1">
            {STEPS.map((s) => (
              <button
                key={s.step}
                type="button"
                disabled={!canNavigateTo(s.step)}
                onClick={() => onGoToStep(s.step)}
                className={`w-2.5 h-2.5 rounded-none border cursor-pointer ${
                  s.step === currentStep
                    ? 'bg-[#B84A14] border-[#B84A14]'
                    : s.step < currentStep
                    ? 'bg-neutral-800 border-neutral-800'
                    : 'bg-neutral-200 border-neutral-300'
                }`}
                title={`Étape ${s.step}: ${s.label}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Step Tracker */}
        <ol className="hidden md:grid grid-cols-7 gap-1">
          {STEPS.map((item) => {
            const isCurrent = item.step === currentStep;
            const isCompleted = item.step < currentStep;
            const isAllowed = canNavigateTo(item.step);

            return (
              <li key={item.step} className="relative">
                <button
                  type="button"
                  disabled={!isAllowed}
                  onClick={() => onGoToStep(item.step)}
                  className={`w-full text-left p-2 border transition-all flex flex-col justify-between h-full cursor-pointer ${
                    isCurrent
                      ? 'border-[#B84A14] bg-[#FDF3EC] border-b-4 border-b-[#B84A14]'
                      : isCompleted
                      ? 'border-neutral-300 bg-white hover:bg-neutral-100'
                      : 'border-neutral-200 bg-white opacity-50 cursor-not-allowed'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 ${
                        isCurrent
                          ? 'bg-[#B84A14] text-white'
                          : isCompleted
                          ? 'bg-neutral-900 text-white'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {item.step}
                    </span>
                    {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>

                  <span
                    className={`text-xs font-semibold uppercase tracking-wider truncate block ${
                      isCurrent
                        ? 'text-[#B84A14]'
                        : isCompleted
                        ? 'text-neutral-900'
                        : 'text-neutral-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};
