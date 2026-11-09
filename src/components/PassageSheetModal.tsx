import React from 'react';
import { Printer, Download, X, MapPin, Clock, Phone, Mail, Building, User, CheckCircle2 } from 'lucide-react';
import { Booking } from '../types';
import { PACKS } from '../data/packs';
import { formatFcfa, formatDateFr, formatEur } from '../utils/formatters';

interface PassageSheetModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const PassageSheetModal: React.FC<PassageSheetModalProps> = ({
  booking,
  onClose
}) => {
  if (!booking) return null;
  const pack = PACKS.find(p => p.id === booking.packId) || PACKS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-3 sm:p-4 pt-14 sm:pt-20 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-2 border-neutral-900 w-full max-w-2xl mb-12 p-4 sm:p-6 shadow-2xl relative"
      >
        {/* Modal Controls (No Print) */}
        <div className="no-print flex items-center justify-between pb-4 border-b border-neutral-300 mb-6 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-[#B84A14] text-white px-2 py-0.5 uppercase">
              Fiche Régie Officielle
            </span>
            <span className="text-[11px] text-neutral-500 hidden sm:inline">Prêt pour l'impression ou l'archivage</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-bold uppercase text-white hover:bg-neutral-800 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#D96528]" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="border-2 border-neutral-800 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-1.5 text-xs font-bold uppercase text-neutral-900 cursor-pointer transition-colors"
              title="Fermer la fiche régie (ou cliquez dans le vide)"
            >
              ✕ Fermer
            </button>
          </div>
        </div>

        {/* PRINTABLE CONTENT */}
        <div className="p-4 border-2 border-neutral-800 bg-white space-y-6 text-xs text-neutral-900">
          {/* Header sheet */}
          <div className="flex items-start justify-between border-b-2 border-neutral-800 pb-4">
            <div className="space-y-1">
              <div className="border border-[#D96528] bg-black inline-block px-3 py-1 mb-1">
                <span className="font-black text-[#D96528] text-lg">OCD</span>
                <span className="ml-1 text-xs font-bold text-white uppercase">Live</span>
              </div>
              <h1 className="text-base font-black uppercase tracking-tight">
                Studio House of Challenge - Lomé
              </h1>
              <p className="text-[11px] text-neutral-600">
                Fiche de passage régie & diffusion direct TikTok / Facebook
              </p>
            </div>

            <div className="text-right border border-neutral-800 p-2 bg-neutral-50">
              <span className="text-[10px] text-neutral-500 uppercase block font-bold">RÉFÉRENCE DOSSIER</span>
              <span className="text-sm font-mono font-black">{booking.reference}</span>
              <span className="text-[10px] text-emerald-800 block font-bold mt-0.5">● CRÉNEAU VALIDÉ</span>
            </div>
          </div>

          {/* Core Slot Details */}
          <div className="grid grid-cols-2 gap-4 border border-neutral-300 p-3 bg-neutral-50">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase block font-bold">DATE & HEURE STUDIO (GMT)</span>
              <p className="text-sm font-bold capitalize">{formatDateFr(booking.date)}</p>
              <p className="font-mono text-xs">{booking.slotTime} – {booking.slotEndTime} GMT (Heure de Lomé)</p>
            </div>

            <div>
              <span className="text-[10px] text-neutral-500 uppercase block font-bold">FORMULE & MODALITÉ</span>
              <p className="text-sm font-bold uppercase">{pack.name} ({pack.durationLabel})</p>
              <p className="text-xs">
                {booking.mode === 'presentiel' ? 'Présentiel : Studio Lomé' : `À distance : ${booking.country || 'Monde'} (Assistante Lomé)`}
              </p>
            </div>
          </div>

          {/* On-screen contact highlight */}
          <div className="border-2 border-[#B84A14] bg-[#FDF3EC] p-3 text-center">
            <span className="text-[10px] text-[#B84A14] font-bold uppercase tracking-wider block mb-0.5">
              NUMÉRO WHATSAPP INCRUSTÉ À L'ÉCRAN PENDANT LE LIVE :
            </span>
            <span className="text-xl font-mono font-black text-neutral-900 tracking-wider">
              {booking.onScreenPhone}
            </span>
          </div>

          {/* Merchant & Business info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">ENTREPRISE / MARQUE</span>
              <p className="font-bold text-neutral-900 text-sm">{booking.businessName}</p>
              <p className="text-neutral-600">Secteur : {booking.sector}</p>
              <p className="text-neutral-600">Pays : {booking.country || 'Togo'}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-neutral-500 uppercase font-bold block">CONTACT RESPONSABLE</span>
              <p className="font-bold text-neutral-900">{booking.fullName}</p>
              <p className="font-mono text-neutral-700">{booking.countryCode} {booking.phone}</p>
              <p className="text-neutral-600">{booking.email}</p>
            </div>
          </div>

          {/* Products to feature */}
          <div className="border border-neutral-300 p-3">
            <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">
              PRODUITS & ARGUMENTAIRE COMMERCIAL :
            </span>
            <p className="text-xs text-neutral-800 leading-relaxed">
              {booking.productsDescription}
            </p>
            {booking.liveGoal && (
              <p className="text-xs text-neutral-600 mt-2">
                Objectif visé : {booking.liveGoal}
              </p>
            )}
          </div>

          {/* Payment receipt confirmation */}
          <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-[11px] text-neutral-600">
            <div>
              <span>Règlement : <strong>{formatFcfa(booking.totalFcfa)}</strong></span> - 
              <span className="font-mono"> {booking.paymentMethod.toUpperCase()} ({booking.paymentReference})</span>
            </div>
            <div>
              <span>Facturation Officielle House of Challenge</span>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t-2 border-neutral-800 text-[10px] text-neutral-600">
            <div>
              <p className="font-bold uppercase mb-8">Visa Commerçant OCD :</p>
              <div className="border-b border-neutral-400"></div>
            </div>
            <div>
              <p className="font-bold uppercase mb-8">Visa Régie Studio BOVAN :</p>
              <div className="border-b border-neutral-400"></div>
            </div>
          </div>
        </div>

        {/* Bottom Close Affordance (No Print) */}
        <div className="no-print mt-4 pt-3 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">
            Cliquez en dehors ou sur Fermer pour quitter
          </span>
          <button
            onClick={onClose}
            className="border-2 border-neutral-800 bg-neutral-900 text-white hover:bg-neutral-800 px-5 py-2 text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            ✕ Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
};
