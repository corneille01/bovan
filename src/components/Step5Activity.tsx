import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Building2, Phone, Mail, User, MapPin, Tag, MessageSquare, AlertCircle } from 'lucide-react';
import { ActivitySector, BookingMode, UserAccount } from '../types';
import { SECTORS, COUNTRY_CODES } from '../data/sectors';
import { ALL_COUNTRIES } from '../data/countries';

export interface ActivityFormData {
  fullName: string;
  phone: string;
  countryCode: string;
  email: string;
  businessName: string;
  sector: ActivitySector;
  productsDescription: string;
  country: string;
  onScreenPhone: string;
  liveGoal: string;
}

interface Step5ActivityProps {
  mode: BookingMode;
  initialData: ActivityFormData;
  onSubmitData: (data: ActivityFormData) => void;
  onPrev: () => void;
  currentUser: UserAccount | null;
}

export const Step5Activity: React.FC<Step5ActivityProps> = ({ initialData, onSubmitData, onPrev, currentUser }) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    ...initialData,
    country: initialData.country || 'Togo',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Indiquez votre nom et prénom.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Indiquez votre numéro WhatsApp.';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      errs.phone = 'Le numéro doit avoir au moins 8 chiffres.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Indiquez votre adresse e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = "Cette adresse e-mail n'est pas valide.";
    }
    if (!formData.businessName.trim()) {
      errs.businessName = 'Indiquez le nom de votre boutique ou de votre marque.';
    }
    if (!formData.productsDescription.trim()) {
      errs.productsDescription = 'Décrivez les produits ou services que vous présentez.';
    }
    if (!formData.onScreenPhone.trim()) {
      errs.onScreenPhone = 'Indiquez le numéro à afficher pendant le live.';
    } else if (formData.onScreenPhone.replace(/\D/g, '').length < 8) {
      errs.onScreenPhone = 'Le numéro doit avoir au moins 8 chiffres.';
    }
    if (!formData.country.trim()) {
      errs.country = 'Choisissez votre pays.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmitData({
        ...formData,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        businessName: formData.businessName.trim(),
        onScreenPhone: formData.onScreenPhone.trim(),
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-300 p-6 shadow-xs">
        {/* Header - Clean Verticality of H2 */}
        <div className="border-b border-neutral-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-neutral-900 ">Vos informations</h2>
          <p className="text-xs text-neutral-600 mt-1">
            Indiquez votre boutique et vos coordonnées. L'équipe du studio affiche votre numéro WhatsApp à l'écran pendant le live.
          </p>

          {currentUser && (
            <div className="mt-3 bg-neutral-100 border border-neutral-300 px-3 py-2 text-xs text-neutral-700 flex flex-wrap items-center justify-between gap-2">
              <span>
                Informations reprises de votre compte : <strong>{currentUser.businessName}</strong>
              </span>
              <span className="text-[10px] font-bold text-[#9E3E0F]">Déjà rempli</span>
            </div>
          )}
        </div>

        {/* Global form errors if any */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 border-2 border-red-500 bg-red-50 p-4 text-xs text-red-800" role="alert">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Corrigez les champs signalés ci-dessous :</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5">
              {Object.values(errors).map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-6 text-xs">
          {/* Section 1: Identité du Commerçant */}
          <div className="border border-neutral-200 p-4 bg-white">
            <h3 className="text-sm font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-200 flex items-center gap-2">
              <User className="w-4 h-4 text-[#B84A14]" />
              <span>Vos coordonnées</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="min-w-0">
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="fullName">
                  Nom et prénom du responsable <span className="text-red-600">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ex : Koffi Mensah"
                  className={`w-full p-2.5 border bg-white text-sm text-neutral-900 focus:outline-none ${
                    errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#B84A14]'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.fullName}</p>}
              </div>

              <div className="min-w-0">
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="email">
                  Adresse e-mail pour la confirmation <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ex : contact@maboutique.com"
                  className={`w-full p-2.5 border bg-white text-sm text-neutral-900 focus:outline-none ${
                    errors.email ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#B84A14]'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.email}</p>}
              </div>

              <div className="min-w-0">
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="phone">
                  Votre numéro WhatsApp <span className="text-red-600">*</span>
                </label>
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="w-full sm:w-auto min-w-0 sm:min-w-[130px] p-2.5 border border-neutral-300 bg-neutral-100 text-xs font-bold tabular-nums text-neutral-800 focus:border-[#B84A14] focus:outline-none"
                    aria-label="Indicatif téléphonique"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.id || `${c.country}-${c.code}`} value={c.code}>
                        {c.flag} {c.code} ({c.country})
                      </option>
                    ))}
                  </select>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Ex : 90 12 34 56"
                    className={`w-full sm:flex-1 p-2.5 border bg-white text-sm tabular-nums text-neutral-900 focus:outline-none ${
                      errors.phone ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#B84A14]'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.phone}</p>}
              </div>

              <div className="min-w-0">
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="country">
                  Votre pays <span className="text-red-600">*</span>
                </label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => {
                    const selectedVal = e.target.value;
                    const found = ALL_COUNTRIES.find((c) => c.name === selectedVal);
                    setFormData({
                      ...formData,
                      country: selectedVal,
                      countryCode: found ? found.code : formData.countryCode,
                    });
                  }}
                  className={`w-full p-2.5 border bg-white text-sm text-neutral-900 focus:outline-none ${
                    errors.country ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#B84A14]'
                  }`}
                >
                  <option value="">Choisissez votre pays</option>
                  {ALL_COUNTRIES.map((c) => (
                    <option key={c.iso} value={c.name}>
                      {c.flag} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Votre Entreprise / Marque */}
          <div className="border border-neutral-200 p-4 bg-white">
            <h3 className="text-sm font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#B84A14]" />
              <span>Votre activité</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="min-w-0">
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="businessName">
                  Nom de votre boutique ou de votre marque <span className="text-red-600">*</span>
                </label>
                <input
                  id="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="Ex : Lomé Wax Élégance"
                  className={`w-full p-2.5 border bg-white text-sm text-neutral-900 focus:outline-none ${
                    errors.businessName ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#B84A14]'
                  }`}
                />
                {errors.businessName && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.businessName}</p>}
              </div>

              <div className="min-w-0">
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="sector">
                  Secteur d'activité <span className="text-red-600">*</span>
                </label>
                <select
                  id="sector"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value as ActivitySector })}
                  className="w-full p-2.5 border border-neutral-300 bg-white text-sm text-neutral-900 focus:border-[#B84A14] focus:outline-none"
                >
                  {SECTORS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-bold text-neutral-800 mb-1" htmlFor="onScreenPhone">
                Numéro à afficher pendant le live <span className="text-red-600">*</span>
              </label>
              <input
                id="onScreenPhone"
                type="text"
                value={formData.onScreenPhone}
                onChange={(e) => setFormData({ ...formData, onScreenPhone: e.target.value })}
                placeholder="Ex : +228 90 12 34 56"
                className={`w-full p-2.5 border bg-white text-sm tabular-nums text-neutral-900 focus:outline-none ${
                  errors.onScreenPhone ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#B84A14]'
                }`}
              />
              <p className="text-[11px] text-neutral-500 mt-1">Ce numéro sera visible par tous les spectateurs, en bas de l'écran, pendant tout le live.</p>
              {errors.onScreenPhone && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.onScreenPhone}</p>}
            </div>

            <div className="mb-4">
              <label className="block font-bold text-neutral-800 mb-1" htmlFor="productsDescription">
                Produits ou services présentés <span className="text-red-600">*</span>
              </label>
              <textarea
                id="productsDescription"
                rows={3}
                value={formData.productsDescription}
                onChange={(e) => setFormData({ ...formData, productsDescription: e.target.value })}
                placeholder="Ex : robes en wax, chemises en lin, accessoires perlés. Tailles S à 3XL."
                className={`w-full p-2.5 border bg-white text-sm text-neutral-900 focus:outline-none ${
                  errors.productsDescription ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#B84A14]'
                }`}
              />
              {errors.productsDescription && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.productsDescription}</p>}
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1" htmlFor="liveGoal">
                Objectif de votre live (facultatif)
              </label>
              <input
                id="liveGoal"
                type="text"
                value={formData.liveGoal}
                onChange={(e) => setFormData({ ...formData, liveGoal: e.target.value })}
                placeholder="Ex : faire connaître ma boutique à Lomé et recevoir des messages WhatsApp."
                className="w-full p-2.5 border border-neutral-300 bg-white text-sm text-neutral-900 focus:border-[#B84A14] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-neutral-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center justify-center gap-2 border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-500" />
            <span>Retour au créneau</span>
          </button>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 border border-neutral-900 bg-neutral-900 px-6 py-3 text-xs font-bold text-white hover:bg-neutral-800 transition-colors"
          >
            <span>Continuer vers le paiement</span>
            <ArrowRight className="w-4 h-4 text-[#B84A14]" />
          </button>
        </div>
      </form>
    </div>
  );
};
