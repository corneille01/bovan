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

export const Step5Activity: React.FC<Step5ActivityProps> = ({
  mode,
  initialData,
  onSubmitData,
  onPrev,
  currentUser
}) => {
  const [formData, setFormData] = useState<ActivityFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Le nom et prénom du responsable sont obligatoires.';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'Le numéro WhatsApp de contact est obligatoire.';
    } else if (formData.phone.replace(/\D/g, '').length < 6) {
      errs.phone = 'Veuillez saisir un numéro de téléphone valide.';
    }
    if (!formData.email.trim()) {
      errs.email = 'L’adresse e-mail est obligatoire pour l’envoi de la facture et de la fiche régie.';
    } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
      errs.email = 'Veuillez renseigner une adresse e-mail valide.';
    }
    if (!formData.businessName.trim()) {
      errs.businessName = 'Le nom commercial de votre marque / commerce est obligatoire.';
    }
    if (!formData.productsDescription.trim()) {
      errs.productsDescription = 'Veuillez décrire brièvement les produits ou services présentés.';
    }
    if (!formData.onScreenPhone.trim()) {
      errs.onScreenPhone = 'Le numéro WhatsApp à afficher à l’écran est obligatoire pour vos clients.';
    }
    if (mode === 'distance' && !formData.country.trim()) {
      errs.country = 'Pour un live à distance, votre pays de diffusion est obligatoire.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmitData(formData);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-300 p-6 shadow-xs">
        {/* Header - Clean Verticality of H2 */}
        <div className="border-b border-neutral-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Fiche d'Activité Commerçant & Paramétrage Titrage Régie
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Renseignez votre marque et vos coordonnées. La régie BOVAN incrustera en continu votre numéro WhatsApp à l'écran pour les spectateurs TikTok et Facebook.
          </p>

          {currentUser && (
            <div className="mt-3 bg-neutral-100 border border-neutral-300 px-3 py-2 text-xs text-neutral-700 flex items-center justify-between">
              <span>
                Données synchronisées depuis votre compte commerçant : <strong>{currentUser.businessName}</strong>
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-700">✓ Pré-rempli</span>
            </div>
          )}
        </div>

        {/* Global form errors if any */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 border-2 border-red-500 bg-red-50 p-4 text-xs text-red-800" role="alert">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Veuillez corriger les {Object.keys(errors).length} champs signalés ci-dessous :</span>
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
          <div className="border border-neutral-200 p-4 bg-neutral-50/50">
            <h3 className="text-sm font-bold uppercase text-neutral-900 mb-4 pb-2 border-b border-neutral-200 flex items-center gap-2">
              <User className="w-4 h-4 text-[#B84A14]" />
              <span>1. Responsable & Contact Officiel</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
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

              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="email">
                  Adresse e-mail (reçu & notifications) <span className="text-red-600">*</span>
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

              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="phone">
                  Numéro WhatsApp principal (réception code & régie) <span className="text-red-600">*</span>
                </label>
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="w-full sm:w-auto min-w-[130px] p-2.5 border border-neutral-300 bg-neutral-100 text-xs font-bold font-mono text-neutral-800 focus:border-[#B84A14] focus:outline-none"
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
                    className={`w-full sm:flex-1 p-2.5 border bg-white text-sm font-mono text-neutral-900 focus:outline-none ${
                      errors.phone ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#B84A14]'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="country">
                  Pays de localisation {mode === 'distance' ? <span className="text-red-600">*</span> : '(Optionnel)'}
                </label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => {
                    const selectedVal = e.target.value;
                    const found = ALL_COUNTRIES.find(c => c.name === selectedVal);
                    setFormData({
                      ...formData,
                      country: selectedVal,
                      countryCode: found ? found.code : formData.countryCode
                    });
                  }}
                  className={`w-full p-2.5 border bg-white text-sm text-neutral-900 focus:outline-none ${
                    errors.country ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#B84A14]'
                  }`}
                >
                  <option value="">-- Sélectionnez votre pays --</option>
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
          <div className="border border-neutral-200 p-4 bg-neutral-50/50">
            <h3 className="text-sm font-bold uppercase text-neutral-900 mb-4 pb-2 border-b border-neutral-200 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#B84A14]" />
              <span>2. Entreprise & Affichage Régie</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="businessName">
                  Nom commercial de la boutique / marque (« OCD ») <span className="text-red-600">*</span>
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

              <div>
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
                Numéro WhatsApp public à afficher en direct pendant le live <span className="text-red-600">*</span>
              </label>
              <input
                id="onScreenPhone"
                type="text"
                value={formData.onScreenPhone}
                onChange={(e) => setFormData({ ...formData, onScreenPhone: e.target.value })}
                placeholder="Ex : +228 90 12 34 56 (Visible par tous les spectateurs TikTok / Facebook)"
                className={`w-full p-2.5 border bg-white text-sm font-mono text-neutral-900 focus:outline-none ${
                  errors.onScreenPhone ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#B84A14]'
                }`}
              />
              <p className="text-[11px] text-neutral-500 mt-1">
                Ce numéro sera incrusté en continu dans le bandeau inférieur de la vidéo par la régie pour que les clients vous contactent directement.
              </p>
              {errors.onScreenPhone && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.onScreenPhone}</p>}
            </div>

            <div className="mb-4">
              <label className="block font-bold text-neutral-800 mb-1" htmlFor="productsDescription">
                Description des produits / services phares présentés <span className="text-red-600">*</span>
              </label>
              <textarea
                id="productsDescription"
                rows={3}
                value={formData.productsDescription}
                onChange={(e) => setFormData({ ...formData, productsDescription: e.target.value })}
                placeholder="Ex : Robes wax brodées, chemises lin homme, accessoires perlés faits main. Tailles S à 3XL. Prix promo spécial live..."
                className={`w-full p-2.5 border bg-white text-sm text-neutral-900 focus:outline-none ${
                  errors.productsDescription ? 'border-red-500 bg-red-50/30' : 'border-neutral-300 focus:border-[#B84A14]'
                }`}
              />
              {errors.productsDescription && <p className="text-[11px] text-red-600 font-semibold mt-1">{errors.productsDescription}</p>}
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1" htmlFor="liveGoal">
                Objectif prioritaire du live (Philosophie OCD : Le marketing avant la vente)
              </label>
              <input
                id="liveGoal"
                type="text"
                value={formData.liveGoal}
                onChange={(e) => setFormData({ ...formData, liveGoal: e.target.value })}
                placeholder="Ex : Placer mon adresse boutique à Lomé, acquérir 50 nouveaux contacts WhatsApp qualifiés..."
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
            className="flex items-center justify-center gap-2 border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-500" />
            <span>Retour au Créneau</span>
          </button>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 border border-neutral-900 bg-neutral-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800 transition-colors"
          >
            <span>Continuer vers l'Étape de Paiement</span>
            <ArrowRight className="w-4 h-4 text-[#D96528]" />
          </button>
        </div>
      </form>
    </div>
  );
};
