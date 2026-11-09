import React, { useRef } from 'react';
import { Check, ArrowRight, ArrowLeft, Star, Clock } from 'lucide-react';
import { PACKS } from '../data/packs';
import { PackId, BookingMode } from '../types';
import { formatFcfa, formatEur } from '../utils/formatters';

interface Step2PackProps {
  mode: BookingMode;
  selectedPackId: PackId;
  onSelectPack: (packId: PackId) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2Pack: React.FC<Step2PackProps> = ({
  mode,
  selectedPackId,
  onSelectPack,
  onNext,
  onPrev
}) => {
  const continueBtnRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (packId: PackId) => {
    onSelectPack(packId);
    setTimeout(() => {
      continueBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      continueBtnRef.current?.focus();
    }, 120);
  };

  return (
    <div className="space-y-6">
      {/* Step Header - Clean Verticality of H2 */}
      <div className="bg-white border border-neutral-300 p-6 shadow-xs">
        <div className="border-b border-neutral-200 pb-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                Formules et Packs de Diffusion Live Streaming Studio OCD Live
              </h2>
            </div>
            <div className="border border-neutral-300 bg-neutral-100 px-3 py-1.5 text-xs">
              <span className="text-neutral-500">Mode actif :</span>{' '}
              <strong className="text-neutral-900 uppercase">
                {mode === 'presentiel' ? 'Présentiel au studio (Lomé)' : 'À distance (Afrique / Monde)'}
              </strong>
            </div>
          </div>
          <p className="text-xs text-neutral-600 mt-2">
            Tarifs transparents en Francs CFA (XOF) et équivalents en Euros. Choisissez la durée de live et l'intensité commerciale adaptées à votre catalogue de vente.
          </p>
        </div>

        {/* 6 Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKS.map((pack) => {
            const isSelected = pack.id === selectedPackId;

            return (
              <div
                key={pack.id}
                onClick={() => handleSelect(pack.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(pack.id); }}
                className={`border-2 p-5 cursor-pointer transition-all flex flex-col justify-between relative ${
                  isSelected
                    ? 'border-[#B84A14] bg-[#FDF3EC] shadow-sm ring-1 ring-[#B84A14]'
                    : 'border-neutral-300 bg-white hover:border-neutral-400'
                }`}
              >
                {/* Recommended tag if applicable */}
                {pack.recommended && (
                  <div className="absolute -top-3 right-4 border border-[#B84A14] bg-[#B84A14] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Recommandé BOVAN</span>
                  </div>
                )}

                <div>
                  {/* Header pack info */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-extrabold text-neutral-900 uppercase tracking-tight">
                      {pack.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-neutral-600 border border-neutral-200 bg-neutral-100 px-2 py-0.5">
                      <Clock className="w-3 h-3 text-[#B84A14]" />
                      <span>{pack.durationLabel}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="my-3 pb-3 border-b border-neutral-200">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#1A1A1A] font-mono-numbers">
                        {formatFcfa(pack.priceFcfa)}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 font-mono-numbers">
                      soit env. {formatEur(pack.priceEur)} (parité fixe 1 € = 655,957 FCFA)
                    </span>
                  </div>

                  {/* Headline & Description */}
                  <p className="text-xs font-semibold text-[#B84A14] mb-1">
                    {pack.headline}
                  </p>
                  <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
                    {pack.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 text-xs text-neutral-700 border-t border-neutral-200 pt-3">
                    {pack.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Selection Action */}
                <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isSelected ? 'text-[#B84A14]' : 'text-neutral-500'
                    }`}
                  >
                    {isSelected ? '✓ Pack Sélectionné' : 'Cliquer pour choisir'}
                  </span>
                  <div
                    className={`h-4 w-4 border-2 flex items-center justify-center ${
                      isSelected ? 'border-[#B84A14] bg-[#B84A14]' : 'border-neutral-400 bg-white'
                    }`}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 bg-white" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Buttons Row with direct redirection target */}
        <div className="mt-8 pt-6 border-t border-neutral-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center gap-2 border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-500" />
            <span>Retour au Mode</span>
          </button>

          <button
            ref={continueBtnRef}
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 border border-neutral-900 bg-neutral-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 focus:ring-2 focus:ring-[#B84A14] transition-all cursor-pointer shadow-sm"
          >
            <span>Continuer vers le Calendrier</span>
            <ArrowRight className="w-4 h-4 text-[#D96528]" />
          </button>
        </div>
      </div>
    </div>
  );
};
