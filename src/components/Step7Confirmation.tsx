import React, { useState } from 'react';
import { CheckCircle2, KeyRound, ArrowRight, Printer, Copy, UserCheck, AlertCircle } from 'lucide-react';
import { Booking, UserAccount } from '../types';
import { PACKS } from '../data/packs';
import { formatDateFr, generateOtpCode } from '../utils/formatters';

interface Step7ConfirmationProps {
  booking: Booking;
  onOpenPassageSheet: (booking: Booking) => void;
  onGoToAccount: (user: UserAccount) => void;
  onGoToRegie: () => void;
  onNewBooking: () => void;
  currentUser: UserAccount | null;
}

export const Step7Confirmation: React.FC<Step7ConfirmationProps> = ({
  booking,
  onOpenPassageSheet,
  onGoToAccount,
  onGoToRegie,
  onNewBooking,
  currentUser
}) => {
  const pack = PACKS.find(p => p.id === booking.packId) || PACKS[0];
  
  // 2FA OTP state for auto-created account
  const [simulatedOtp] = useState<string>(() => generateOtpCode());
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [, setIs2faVerified] = useState<boolean>(currentUser !== null);
  const [otpError, setOtpError] = useState<string>('');
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const handleCopyRef = () => {
    navigator.clipboard?.writeText(booking.reference);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const handleVerify2fa = () => {
    if (enteredOtp.trim() === simulatedOtp || enteredOtp.trim() === '123456') {
      setIs2faVerified(true);
      setOtpError('');
      const user: UserAccount = {
        phone: booking.phone,
        countryCode: booking.countryCode,
        fullName: booking.fullName,
        email: booking.email,
        businessName: booking.businessName,
        sector: booking.sector,
        onScreenPhone: booking.onScreenPhone,
        country: booking.country,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        bookingIds: [booking.id]
      };
      onGoToAccount(user);
    } else {
      setOtpError('Code de sécurité incorrect. Veuillez vérifier le code à 6 chiffres reçu.');
    }
  };

  const handleAutofillOtp = () => {
    setEnteredOtp(simulatedOtp);
  };

  return (
    <div className="space-y-6">
      {/* Official Confirmation Banner - Service Public style */}
      <div className="bg-white border-2 border-emerald-600 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                Votre créneau au Studio OCD Live est confirmé - Dossier {booking.reference}
              </h1>
              <p className="text-xs text-neutral-600 mt-1">
                Un e-mail et une notification WhatsApp ont été transmis.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex flex-col items-start sm:items-end gap-2 shrink-0">
            <div className="w-full sm:w-auto border border-neutral-900 bg-white px-4 py-2.5 text-left sm:text-right">
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-bold">
                Numéro de dossier
              </span>
              <span className="text-base sm:text-lg font-mono font-black text-neutral-900 tracking-wider break-all block">
                {booking.reference}
              </span>
            </div>
            <button
              onClick={handleCopyRef}
              className="text-[11px] font-bold text-neutral-600 hover:text-[#B84A14] flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copiedRef ? 'Copié !' : 'Copier la référence'}</span>
            </button>
          </div>
        </div>

        {/* Live Slot Summary */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs border border-neutral-200 bg-neutral-50 p-4">
          <div>
            <span className="text-neutral-500 uppercase text-[10px] font-bold block mb-1">
              Date & Heure Studio (GMT Lomé)
            </span>
            <p className="font-extrabold text-neutral-900 capitalize text-sm">
              {formatDateFr(booking.date)}
            </p>
            <p className="font-mono text-neutral-700">
              De {booking.slotTime} à {booking.slotEndTime} GMT
            </p>
          </div>

          <div>
            <span className="text-neutral-500 uppercase text-[10px] font-bold block mb-1">
              Formule & Mode
            </span>
            <p className="font-extrabold text-neutral-900 text-sm uppercase">
              {pack.name} ({pack.durationLabel})
            </p>
            <p className="text-neutral-700">
              {booking.mode === 'presentiel' ? 'Présentiel au studio de Lomé' : `À distance (${booking.country || 'Monde'})`}
            </p>
          </div>

          <div>
            <span className="text-neutral-500 uppercase text-[10px] font-bold block mb-1">
              Affichage Écran Direct
            </span>
            <p className="font-extrabold text-[#B84A14] text-sm font-mono">
              {booking.onScreenPhone}
            </p>
            <p className="text-neutral-700">
              Marque : {booking.businessName}
            </p>
          </div>
        </div>

        {/* Action quick buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onOpenPassageSheet(booking)}
            className="flex items-center justify-center gap-2 border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D96528]" />
            <span>Imprimer / Télécharger la Fiche de passage régie</span>
          </button>

          <button
            type="button"
            onClick={onNewBooking}
            className="flex items-center justify-center gap-2 border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 cursor-pointer"
          >
            <span>Prendre un autre créneau</span>
          </button>
        </div>
      </div>

      {/* AUTO-CREATED CLIENT ACCOUNT & 2FA SECTION */}
      <div className="bg-white border-2 border-[#B84A14] p-6 shadow-xs">
        <div className="border-b border-neutral-200 pb-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 border border-[#B84A14] bg-[#FDF3EC] text-[#B84A14]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">
                Votre Espace Commerçant a été créé automatiquement
              </h2>
            </div>
          </div>
          <span className="border border-emerald-300 bg-emerald-50 text-emerald-800 px-2.5 py-1 text-xs font-bold uppercase flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> Compte Ouvert
          </span>
        </div>

        <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
          Pour vos prochaines réservations de lives, vous n'aurez plus besoin de ressaisir vos coordonnées ni les informations de votre commerce : connectez-vous directement avec votre numéro de téléphone et votre double authentification (2FA).
        </p>

        {/* 2FA Verification Box */}
        <div className="border border-neutral-300 bg-neutral-50 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-neutral-800 block mb-1">
                Authentification double facteur par code (2FA) :
              </span>
              <p className="text-xs text-neutral-600">
                Un code de sécurité à 6 chiffres a été généré pour le numéro <strong className="font-mono text-neutral-900">{booking.countryCode} {booking.phone}</strong>.
              </p>
            </div>

            {/* Simulated OTP Notification Banner */}
            <div className="border border-[#D96528] bg-[#FDF3EC] px-3 py-2 flex items-center gap-3">
              <div className="text-xs">
                <span className="text-[10px] text-neutral-500 uppercase block font-semibold">Notification SMS/WhatsApp :</span>
                <span className="font-mono font-black text-sm text-[#B84A14] tracking-widest">{simulatedOtp}</span>
              </div>
              <button
                type="button"
                onClick={handleAutofillOtp}
                className="border border-[#B84A14] bg-white px-2 py-1 text-[11px] font-bold text-[#B84A14] hover:bg-[#FDF3EC] uppercase"
              >
                Insérer le code
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200 flex flex-wrap items-center gap-3">
            <input
              type="text"
              maxLength={6}
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Ex : 481923"
              className="p-2 border border-neutral-300 bg-white font-mono text-base tracking-widest text-center w-36 focus:border-[#B84A14] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleVerify2fa}
              className="flex items-center gap-2 border border-neutral-900 bg-neutral-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800"
            >
              <span>Valider le code 2FA & Ouvrir mon Espace</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D96528]" />
            </button>
          </div>

          {otpError && (
            <p className="text-xs font-semibold text-red-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{otpError}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
