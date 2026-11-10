import React, { useState } from 'react';
import { ArrowLeft, Smartphone, Building2, AlertCircle, Loader2, Check } from 'lucide-react';
import { Pack, BookingMode, PaymentMethod } from '../types';
import { ActivityFormData } from './Step5Activity';
import { formatFcfa, formatEur, formatDateFr } from '../utils/formatters';

interface Step6PaymentProps {
  pack: Pack;
  mode: BookingMode;
  date: string;
  slotTime: string;
  slotEndTime: string;
  activityData: ActivityFormData;
  /** Renvoie un message d'erreur à afficher, ou null quand la réservation est enregistrée. */
  onSubmit: (paymentMethod: PaymentMethod, consents: { cgv: boolean; data: boolean; image: boolean }) => Promise<string | null>;
  onPrev: () => void;
  onOpenLegal: (tab: 'cgv' | 'privacy') => void;
}

const MOBILE: { id: PaymentMethod; label: string }[] = [
  { id: 'tmoney', label: 'T-Money' },
  { id: 'flooz', label: 'Flooz' },
  { id: 'mtn_momo', label: 'MTN MoMo' },
];

export const Step6Payment: React.FC<Step6PaymentProps> = ({ pack, mode, date, slotTime, slotEndTime, activityData, onSubmit, onPrev, onOpenLegal }) => {
  const [method, setMethod] = useState<PaymentMethod>('tmoney');
  const [cgv, setCgv] = useState(false);
  const [data, setData] = useState(false);
  const [image, setImage] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const methods = mode === 'presentiel' ? [...MOBILE, { id: 'onsite' as PaymentMethod, label: 'Sur place au studio' }] : MOBILE;
  const ready = cgv && data && image;

  const submit = async () => {
    if (!ready) {
      setError('Cochez les trois cases pour réserver.');
      return;
    }
    setError('');
    setBusy(true);
    const message = await onSubmit(method, { cgv, data, image });
    setBusy(false);
    if (message) setError(message);
  };

  const Check3 = ({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) => (
    <label className="flex items-start gap-3 cursor-pointer text-sm text-neutral-800">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-5 w-5 accent-[#B84A14] shrink-0" />
      <span>{children}</span>
    </label>
  );

  return (
    <div className="bg-white border border-neutral-300 p-4 sm:p-6">
      <div className="border-b border-neutral-200 pb-4 mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-neutral-900">Vérifiez et réservez</h2>
        <p className="text-sm text-neutral-600 mt-1">Votre créneau est bloqué dès la réservation. Le studio confirme votre paiement et vous écrit.</p>
      </div>

      <dl className="border border-neutral-300 divide-y divide-neutral-200 text-sm mb-6">
        {[
          ['Formule', pack.name],
          ['Mode', mode === 'presentiel' ? 'Au studio de Lomé' : 'À distance'],
          ['Date', formatDateFr(date)],
          ['Heure', `${slotTime} à ${slotEndTime}, heure de Lomé`],
          ['Commerce', activityData.businessName],
          ["Numéro affiché à l'écran", activityData.onScreenPhone],
        ].map(([k, v]) => (
          <div key={k} className="flex flex-col sm:flex-row sm:justify-between gap-1 px-4 py-3">
            <dt className="text-neutral-500">{k}</dt>
            <dd className="font-semibold text-neutral-900 sm:text-right">{v}</dd>
          </div>
        ))}
        <div className="flex justify-between items-baseline px-4 py-3 bg-[#FDF3EC]">
          <dt className="font-bold text-neutral-900">Total</dt>
          <dd className="text-right">
            <span className="text-lg font-bold text-[#B84A14] tabular-nums">{formatFcfa(pack.priceFcfa)}</span>
            <span className="block text-xs text-neutral-600 tabular-nums">environ {formatEur(pack.priceEur)}</span>
          </dd>
        </div>
      </dl>

      <fieldset className="mb-6">
        <legend className="text-sm font-bold text-neutral-900 mb-3">Comment souhaitez-vous payer ?</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {methods.map((m) => (
            <label
              key={m.id}
              className={`flex items-center gap-3 border-2 px-4 py-3 cursor-pointer min-h-[52px] ${method === m.id ? 'border-[#B84A14] bg-[#FDF3EC]' : 'border-neutral-300 hover:border-neutral-500'}`}
            >
              <input type="radio" name="pay" checked={method === m.id} onChange={() => setMethod(m.id)} className="accent-[#B84A14] h-4 w-4" />
              {m.id === 'onsite' ? <Building2 className="w-4 h-4 text-[#B84A14]" /> : <Smartphone className="w-4 h-4 text-[#B84A14]" />}
              <span className="text-sm font-semibold">{m.label}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-neutral-600 mt-3">
          {method === 'onsite'
            ? 'Vous réglez au studio le jour de votre live.'
            : `Le studio vous envoie la demande de paiement ${methods.find((m) => m.id === method)?.label} sur WhatsApp et par e-mail. Aucun paiement n'est demandé ici.`}
        </p>
      </fieldset>

      <div className="space-y-3 mb-6">
        <Check3 checked={cgv} onChange={setCgv}>
          J'accepte les{' '}
          <button type="button" onClick={() => onOpenLegal('cgv')} className="underline text-[#B84A14] font-semibold">
            conditions de vente
          </button>
          . L'annulation est gratuite jusqu'à 72 h avant le live.
        </Check3>
        <Check3 checked={data} onChange={setData}>
          J'accepte que le studio utilise mes informations pour gérer ma réservation, comme le décrit la{' '}
          <button type="button" onClick={() => onOpenLegal('privacy')} className="underline text-[#B84A14] font-semibold">
            politique de confidentialité
          </button>
          .
        </Check3>
        <Check3 checked={image} onChange={setImage}>
          J'autorise la diffusion de mon image et de mes produits pendant le live.
        </Check3>
      </div>

      {error && (
        <div role="alert" className="flex items-start gap-2 border border-red-300 bg-red-50 text-red-800 text-sm p-3 mb-4">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-4 border-t border-neutral-200">
        <button
          type="button"
          onClick={onPrev}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 border border-neutral-300 px-5 py-3 text-sm font-semibold hover:bg-neutral-100 min-h-[48px]"
        >
          <ArrowLeft className="w-4 h-4 text-[#B84A14]" /> Étape précédente
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white min-h-[48px] ${ready ? 'bg-[#B84A14] hover:bg-[#9E3E0F]' : 'bg-neutral-400'}`}
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {busy ? 'Enregistrement' : 'Réserver mon créneau'}
        </button>
      </div>
    </div>
  );
};
