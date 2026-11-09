import React, { useRef } from 'react';
import { Clock, Check, ArrowRight, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';
import { PACKS, TIME_SLOTS_1H30, TIME_SLOTS_4H } from '../data/packs';
import { PackId, Booking } from '../types';
import { formatDateFr } from '../utils/formatters';

interface Step4SlotProps {
  packId: PackId;
  date: string;
  selectedSlotTime: string;
  onSelectSlot: (time: string, endTime: string) => void;
  onNext: () => void;
  onPrev: () => void;
  existingBookings: Booking[];
}

export const Step4Slot: React.FC<Step4SlotProps> = ({
  packId,
  date,
  selectedSlotTime,
  onSelectSlot,
  onNext,
  onPrev,
  existingBookings
}) => {
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const currentPack = PACKS.find(p => p.id === packId) || PACKS[0];
  const isMarathon = currentPack.isContinuousBlock;
  const availableSlotOptions = isMarathon ? TIME_SLOTS_4H : TIME_SLOTS_1H30;

  // Bookings on this selected date
  const bookingsOnDate = existingBookings.filter(b => b.date === date && b.status !== 'cancelled');

  // Check if a slot is taken
  const isSlotTaken = (slotTime: string) => {
    return bookingsOnDate.some(b => b.slotTime === slotTime);
  };

  const getOccupantDetails = (slotTime: string) => {
    const b = bookingsOnDate.find(bk => bk.slotTime === slotTime);
    if (!b) return null;
    return `${b.businessName} (${b.sector})`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-300 p-6 shadow-xs">
        {/* Header - Clean Verticality of H2 */}
        <div className="border-b border-neutral-200 pb-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                Créneau Horaire Certifié GMT Lomé - Diffusion Studio Sans Chevauchement
              </h2>
            </div>
            <div className="border border-neutral-300 bg-neutral-100 px-3 py-1 text-xs">
              <span className="text-neutral-500">Date retenue :</span>{' '}
              <strong className="text-neutral-900 capitalize">{formatDateFr(date)}</strong>
            </div>
          </div>
          <p className="text-xs text-neutral-600 mt-2">
            Règle absolue du studio OCD Live : <strong className="text-neutral-900">1 seul live à la fois</strong>. Aucun chevauchement n'est possible, la régie est entièrement dédiée à votre passage.
          </p>
        </div>

        {/* Multi-sessions reminder if applicable */}
        {currentPack.sessionsCount > 1 && (
          <div className="border border-[#D96528] bg-[#FDF3EC] p-4 mb-6 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#B84A14] shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-800">
              <strong className="text-[#B84A14] uppercase block mb-0.5">
                Formule multi-séances ({currentPack.sessionsCount} diffusions)
              </strong>
              Vous réservez ici le créneau de votre <strong>premier live</strong>. Les dates et horaires des sessions suivantes seront planifiés d'un commun accord avec l'équipe régie de BOVAN selon votre calendrier commercial.
            </div>
          </div>
        )}

        {/* Slots List */}
        <div className="space-y-3 mb-6">
          {availableSlotOptions.map((slot) => {
            const taken = isSlotTaken(slot.time);
            const isSelected = selectedSlotTime === slot.time;
            const occupant = taken ? getOccupantDetails(slot.time) : null;

            return (
              <div
                key={slot.time}
                onClick={() => {
                  if (!taken) {
                    onSelectSlot(slot.time, slot.endTime);
                    setTimeout(() => {
                      ctaButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 150);
                  }
                }}
                className={`border-2 p-4 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  isSelected
                    ? 'border-[#B84A14] bg-[#FDF3EC] ring-1 ring-[#B84A14]'
                    : !taken
                    ? 'border-neutral-300 bg-white hover:border-[#B84A14] hover:bg-neutral-50 cursor-pointer'
                    : 'border-neutral-200 bg-neutral-100 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 border ${
                      isSelected
                        ? 'border-[#B84A14] bg-[#B84A14] text-white'
                        : !taken
                        ? 'border-neutral-300 bg-neutral-100 text-neutral-700'
                        : 'border-neutral-200 bg-neutral-200 text-neutral-400'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold font-mono-numbers text-neutral-900">
                        {slot.label}
                      </span>
                      {isSelected && (
                        <span className="border border-[#B84A14] bg-[#B84A14] text-white px-2 py-0.5 text-[10px] font-bold uppercase">
                          Sélectionné
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500">
                      Régie studio + assistants cadrage / streaming en duplex
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {taken ? (
                    <div className="text-right">
                      <span className="border border-neutral-300 bg-neutral-200 text-neutral-600 px-2.5 py-1 text-xs font-bold uppercase tracking-wider block">
                        Indisponible (Réservé)
                      </span>
                      {occupant && (
                        <span className="text-[11px] text-neutral-500 block mt-0.5">
                          Studio occupé par : {occupant}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isSelected ? 'text-[#B84A14]' : 'text-emerald-700'
                        }`}
                      >
                        {isSelected ? '✓ Créneau validé' : 'Libre pour réservation'}
                      </span>
                      <div
                        className={`h-4 w-4 border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#B84A14] bg-[#B84A14]' : 'border-neutral-400 bg-white'
                        }`}
                      >
                        {isSelected && <div className="h-1.5 w-1.5 bg-white" />}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected slot feedback */}
        {selectedSlotTime ? (
          <div className="border border-[#B84A14] bg-[#FDF3EC] p-4 flex items-center justify-between text-xs">
            <div>
              <p className="text-neutral-600">Créneau horaire sélectionné :</p>
              <p className="text-sm font-bold text-neutral-900 font-mono-numbers">
                {selectedSlotTime} (GMT Lomé) - Durée {currentPack.durationLabel}
              </p>
            </div>
            <span className="font-bold text-[#B84A14] uppercase">
              Prêt pour vos informations d'activité
            </span>
          </div>
        ) : (
          <div className="border border-neutral-300 bg-neutral-50 p-4 flex items-center gap-3 text-xs text-neutral-600">
            <AlertCircle className="w-4 h-4 text-neutral-400 shrink-0" />
            <span>Veuillez sélectionner l'un des horaires libres ci-dessus pour continuer.</span>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-neutral-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center gap-2 border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-500" />
            <span>Retour au Calendrier</span>
          </button>

          <button
            ref={ctaButtonRef}
            type="button"
            disabled={!selectedSlotTime}
            onClick={onNext}
            className={`flex items-center gap-2 border px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
              selectedSlotTime
                ? 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800'
                : 'border-neutral-200 bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <span>Continuer vers Votre Activité</span>
            <ArrowRight className="w-4 h-4 text-[#D96528]" />
          </button>
        </div>
      </div>
    </div>
  );
};
