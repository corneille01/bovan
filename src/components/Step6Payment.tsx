import React, { useState, useRef } from 'react';
import { ShieldCheck, CreditCard, Smartphone, Building, ArrowLeft, ArrowRight, Lock, Check, AlertCircle } from 'lucide-react';
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
  onConfirmPayment: (paymentMethod: PaymentMethod, paymentRef: string) => void;
  onPrev: () => void;
}

export const Step6Payment: React.FC<Step6PaymentProps> = ({
  pack,
  mode,
  date,
  slotTime,
  slotEndTime,
  activityData,
  onConfirmPayment,
  onPrev
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('tmoney');
  const [phoneForPayment, setPhoneForPayment] = useState<string>(activityData.phone);
  const [cardNumber, setCardNumber] = useState<string>('4970 8821 3491 5502');
  const [cardExpiry, setCardExpiry] = useState<string>('08/28');
  const [cardCvc, setCardCvc] = useState<string>('312');
  const [acceptCgv, setAcceptCgv] = useState<boolean>(true);
  const [acceptImageRights, setAcceptImageRights] = useState<boolean>(true);
  const [acceptDataProtection, setAcceptDataProtection] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  const paymentInputsRef = useRef<HTMLDivElement>(null);

  const handleSelectMethod = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setTimeout(() => {
      paymentInputsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = paymentInputsRef.current?.querySelector<HTMLInputElement | HTMLSelectElement>('input, select');
      firstInput?.focus();
    }, 100);
  };

  const handleProcessPayment = () => {
    if (!acceptCgv || !acceptImageRights || !acceptDataProtection) {
      setValidationError('Vous devez accepter l’ensemble des consentements légaux (CGV, droit à l’image et protection des données) pour valider votre réservation.');
      return;
    }

    setValidationError('');
    setIsProcessing(true);

    // Simulate instant payment gateway handshake
    setTimeout(() => {
      const generatedRef = `PAY-${selectedMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsProcessing(false);
      onConfirmPayment(selectedMethod, generatedRef);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-300 p-6 shadow-xs">
        {/* Header - Clean Verticality of H2 */}
        <div className="border-b border-neutral-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Règlement Sécurisé & Validation du Créneau Live Streaming Studio OCD Live
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Paiement mobile instantané (T-Money, Flooz, MTN MoMo, Wave) ou carte bancaire. Votre place est immédiatement réservée dans la base de données sans double réservation.
          </p>
        </div>

        {/* Order Summary Box */}
        <div className="border border-neutral-300 bg-neutral-50 p-5 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3 pb-2 border-b border-neutral-200">
            Détails de la réservation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <div>
                <span className="text-neutral-500 block">Formule choisie :</span>
                <strong className="text-sm font-extrabold text-neutral-900 uppercase">
                  {pack.name} ({pack.durationLabel})
                </strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Mode de diffusion :</span>
                <strong className="text-neutral-800">
                  {mode === 'presentiel' ? 'Présentiel au studio (Lomé, Togo)' : `À distance (${activityData.country || 'International'})`}
                </strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Date et horaire (GMT Lomé) :</span>
                <strong className="text-neutral-900 capitalize">
                  {formatDateFr(date)} de {slotTime} à {slotEndTime} GMT
                </strong>
              </div>
            </div>

            <div className="space-y-2 md:border-l md:border-neutral-200 md:pl-4">
              <div>
                <span className="text-neutral-500 block">Commerce / Marque :</span>
                <strong className="text-neutral-800">{activityData.businessName}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block">Responsable & WhatsApp :</span>
                <span className="text-neutral-800 font-medium">
                  {activityData.fullName} - {activityData.countryCode} {activityData.phone}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Numéro public incrusté à l'écran :</span>
                <strong className="text-[#B84A14] font-mono">{activityData.onScreenPhone}</strong>
              </div>
            </div>
          </div>

          {/* Pricing Highlight */}
          <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block">
                Total net à régler
              </span>
              <span className="text-[11px] text-neutral-500">
                TVA et frais d'agrégateur régional inclus - Facture émise par House of Challenge
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#1A1A1A] font-mono-numbers block">
                {formatFcfa(pack.priceFcfa)}
              </span>
              <span className="text-xs text-neutral-500 font-mono-numbers">
                soit env. {formatEur(pack.priceEur)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase text-neutral-900 mb-3">
            Choisissez votre moyen de paiement sécurisé
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* T-Money */}
            <div
              onClick={() => handleSelectMethod('tmoney')}
              className={`border-2 p-3.5 cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === 'tmoney'
                  ? 'border-[#B84A14] bg-[#FDF3EC]'
                  : 'border-neutral-300 bg-white hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 border border-neutral-300 bg-amber-500 text-white font-bold text-xs">
                  TM
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">T-Money Togocom</span>
                  <span className="text-[10px] text-neutral-500">Paiement mobile Togo</span>
                </div>
              </div>
              {selectedMethod === 'tmoney' && <Check className="w-4 h-4 text-[#B84A14]" />}
            </div>

            {/* Flooz */}
            <div
              onClick={() => handleSelectMethod('flooz')}
              className={`border-2 p-3.5 cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === 'flooz'
                  ? 'border-[#B84A14] bg-[#FDF3EC]'
                  : 'border-neutral-300 bg-white hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 border border-neutral-300 bg-blue-600 text-white font-bold text-xs">
                  FL
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Moov Money / Flooz</span>
                  <span className="text-[10px] text-neutral-500">Paiement mobile Moov</span>
                </div>
              </div>
              {selectedMethod === 'flooz' && <Check className="w-4 h-4 text-[#B84A14]" />}
            </div>

            {/* MTN Mobile Money */}
            <div
              onClick={() => handleSelectMethod('mtn_momo')}
              className={`border-2 p-3.5 cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === 'mtn_momo'
                  ? 'border-[#B84A14] bg-[#FDF3EC]'
                  : 'border-neutral-300 bg-white hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 border border-neutral-900 bg-[#FFCC00] text-neutral-900 font-black text-xs">
                  MTN
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">MTN Mobile Money</span>
                  <span className="text-[10px] text-neutral-500">MoMo Bénin, Ghana, CI</span>
                </div>
              </div>
              {selectedMethod === 'mtn_momo' && <Check className="w-4 h-4 text-[#B84A14]" />}
            </div>

            {/* Carte Bancaire */}
            <div
              onClick={() => handleSelectMethod('card')}
              className={`border-2 p-3.5 cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === 'card'
                  ? 'border-[#B84A14] bg-[#FDF3EC]'
                  : 'border-neutral-300 bg-white hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 border border-neutral-300 bg-neutral-900 text-white">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Carte Bancaire</span>
                  <span className="text-[10px] text-neutral-500">Visa, Mastercard</span>
                </div>
              </div>
              {selectedMethod === 'card' && <Check className="w-4 h-4 text-[#B84A14]" />}
            </div>

            {/* Wave / Orange Money */}
            <div
              onClick={() => handleSelectMethod('wave_orange')}
              className={`border-2 p-3.5 cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === 'wave_orange'
                  ? 'border-[#B84A14] bg-[#FDF3EC]'
                  : 'border-neutral-300 bg-white hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 border border-neutral-300 bg-sky-500 text-white font-bold text-xs">
                  W~
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Wave / Orange Money</span>
                  <span className="text-[10px] text-neutral-500">CI, Sénégal, Mali, Diaspora</span>
                </div>
              </div>
              {selectedMethod === 'wave_orange' && <Check className="w-4 h-4 text-[#B84A14]" />}
            </div>

            {/* Virement Bancaire */}
            <div
              onClick={() => handleSelectMethod('bank_transfer')}
              className={`border-2 p-3.5 cursor-pointer transition-all flex items-center justify-between ${
                selectedMethod === 'bank_transfer'
                  ? 'border-[#B84A14] bg-[#FDF3EC]'
                  : 'border-neutral-300 bg-white hover:border-neutral-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 border border-neutral-300 bg-neutral-700 text-white">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Virement Bancaire</span>
                  <span className="text-[10px] text-neutral-500">RIB / IBAN Officiel</span>
                </div>
              </div>
              {selectedMethod === 'bank_transfer' && <Check className="w-4 h-4 text-[#B84A14]" />}
            </div>
          </div>
        </div>

        {/* Payment Details Input Box */}
        <div ref={paymentInputsRef} className="border border-neutral-300 bg-neutral-50/70 p-4 mb-6 text-xs">
          {selectedMethod === 'tmoney' && (
            <div className="space-y-3">
              <p className="font-bold text-neutral-800">
                Paiement via Togocom T-Money (Togo)
              </p>
              <p className="text-neutral-600">
                Un push de validation USSD sécurisé va être envoyé sur votre numéro Togocom pour autoriser le débit de <strong className="text-neutral-900">{formatFcfa(pack.priceFcfa)}</strong>.
              </p>
              <div className="max-w-xs">
                <label className="block font-bold text-neutral-700 mb-1">
                  Numéro T-Money de débit :
                </label>
                <div className="flex gap-2">
                  <span className="p-2 border border-neutral-300 bg-neutral-200 font-mono font-bold">+228</span>
                  <input
                    type="tel"
                    value={phoneForPayment}
                    onChange={(e) => setPhoneForPayment(e.target.value)}
                    className="flex-1 p-2 border border-neutral-300 bg-white font-mono text-sm focus:outline-none focus:border-[#B84A14]"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'flooz' && (
            <div className="space-y-3">
              <p className="font-bold text-neutral-800">
                Paiement via Moov Money / Flooz
              </p>
              <p className="text-neutral-600">
                Saisissez votre numéro Moov pour recevoir l'invite de confirmation sur votre terminal.
              </p>
              <div className="max-w-xs">
                <label className="block font-bold text-neutral-700 mb-1">
                  Numéro Flooz :
                </label>
                <input
                  type="tel"
                  value={phoneForPayment}
                  onChange={(e) => setPhoneForPayment(e.target.value)}
                  className="w-full p-2 border border-neutral-300 bg-white font-mono text-sm focus:outline-none focus:border-[#B84A14]"
                />
              </div>
            </div>
          )}

          {selectedMethod === 'mtn_momo' && (
            <div className="space-y-3">
              <p className="font-bold text-neutral-800 flex items-center gap-2">
                <span className="bg-[#FFCC00] text-black font-black px-1.5 py-0.5 text-[10px]">MTN MoMo</span>
                <span>Paiement via MTN Mobile Money</span>
              </p>
              <p className="text-neutral-600">
                Un push de débit sécurisé MoMo va être envoyé sur votre numéro MTN pour régler la somme de <strong className="text-neutral-900">{formatFcfa(pack.priceFcfa)}</strong>.
              </p>
              <div className="max-w-xs">
                <label className="block font-bold text-neutral-700 mb-1">
                  Numéro de téléphone MTN MoMo :
                </label>
                <input
                  type="tel"
                  value={phoneForPayment}
                  onChange={(e) => setPhoneForPayment(e.target.value)}
                  placeholder="Ex : 97 00 11 22"
                  className="w-full p-2 border border-neutral-300 bg-white font-mono text-sm focus:outline-none focus:border-[#B84A14]"
                />
              </div>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="space-y-3">
              <p className="font-bold text-neutral-800">
                Carte Bancaire Sécurisée (3D-Secure 2.0)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-neutral-700 mb-1">Numéro de carte :</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 border border-neutral-300 bg-white font-mono text-sm focus:outline-none focus:border-[#B84A14]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">Expiration :</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full p-2 border border-neutral-300 bg-white font-mono text-sm focus:outline-none focus:border-[#B84A14]"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'wave_orange' && (
            <div className="space-y-2">
              <p className="font-bold text-neutral-800">
                Wave / Orange Money Afrique & Diaspora
              </p>
              <p className="text-neutral-600">
                Paiement instantané par QR Code ou lien de validation sécurisé sur votre application mobile Wave ou Orange Money.
              </p>
              <div className="max-w-xs">
                <label className="block font-bold text-neutral-700 mb-1">Téléphone du compte mobile :</label>
                <input
                  type="tel"
                  value={phoneForPayment}
                  onChange={(e) => setPhoneForPayment(e.target.value)}
                  className="w-full p-2 border border-neutral-300 bg-white font-mono text-sm focus:outline-none focus:border-[#B84A14]"
                />
              </div>
            </div>
          )}

          {selectedMethod === 'bank_transfer' && (
            <div className="space-y-2">
              <p className="font-bold text-neutral-800">
                Virement bancaire direct (House of Challenge Lomé)
              </p>
              <p className="text-neutral-600">
                IBAN officiel émis pour House of Challenge avec référence automatique de virement. Le créneau reste pré-réservé pendant 48 heures.
              </p>
              <div className="border border-neutral-300 bg-white p-2.5 font-mono text-[11px] text-neutral-800">
                IBAN : TG56 1200 1001 0000 8920 1000 102 - BIC : HOCFTG22
              </div>
            </div>
          )}
        </div>

        {/* Legal Consents - Service Public & RGPD / Togo requirement */}
        <div className="border border-neutral-300 bg-neutral-50 p-4 mb-6 space-y-3 text-xs">
          <p className="font-bold uppercase tracking-wider text-neutral-800 text-[11px]">
            Consentements contractuels obligatoires
          </p>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptCgv}
              onChange={(e) => setAcceptCgv(e.target.checked)}
              className="mt-0.5 h-4 w-4 border-neutral-400 text-[#B84A14] focus:ring-0"
            />
            <span className="text-neutral-700">
              J'ai lu et j'accepte sans réserve les <strong className="text-neutral-900">Conditions Générales de Vente (CGV)</strong> du studio OCD Live et la politique d'annulation / report gratuit jusqu'à 72 heures avant le live.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptImageRights}
              onChange={(e) => setAcceptImageRights(e.target.checked)}
              className="mt-0.5 h-4 w-4 border-neutral-400 text-[#B84A14] focus:ring-0"
            />
            <span className="text-neutral-700">
              J'autorise la diffusion en direct et la rediffusion de mon intervention et de la présentation de mes produits sur les comptes officiels TikTok et Facebook de <strong className="text-neutral-900">House of Challenge</strong>.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptDataProtection}
              onChange={(e) => setAcceptDataProtection(e.target.checked)}
              className="mt-0.5 h-4 w-4 border-neutral-400 text-[#B84A14] focus:ring-0"
            />
            <span className="text-neutral-700">
              J'accepte le traitement de mes données pour la gestion de ma réservation et l'ouverture automatique de mon <strong className="text-neutral-900">Espace Commerçant sécurisé par code 2FA</strong> (conforme RGPD & Loi togolaise n° 2019-014).
            </span>
          </label>
        </div>

        {validationError && (
          <div className="mb-6 border-2 border-red-500 bg-red-50 p-3 text-xs text-red-800 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 pt-6 border-t border-neutral-200 flex items-center justify-between">
          <button
            type="button"
            disabled={isProcessing}
            onClick={onPrev}
            className="flex items-center gap-2 border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-500" />
            <span>Retour aux Informations</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleProcessPayment}
            className="flex items-center gap-2 border border-[#B84A14] bg-[#B84A14] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9E3E0F] active:bg-black transition-colors"
          >
            {isProcessing ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin border-2 border-white border-t-transparent" />
                <span>Traitement du règlement en cours...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Payer et Valider ({formatFcfa(pack.priceFcfa)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
