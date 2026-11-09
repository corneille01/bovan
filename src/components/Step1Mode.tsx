import React, { useRef } from 'react';
import { MapPin, Globe, Check, ArrowRight } from 'lucide-react';
import { BookingMode } from '../types';

interface Step1ModeProps {
  selectedMode: BookingMode;
  onSelectMode: (mode: BookingMode) => void;
  onNext: () => void;
}

export const Step1Mode: React.FC<Step1ModeProps> = ({
  selectedMode,
  onSelectMode,
  onNext
}) => {
  const continueBtnRef = useRef<HTMLButtonElement>(null);

  const handleSelect = (mode: BookingMode) => {
    onSelectMode(mode);
    setTimeout(() => {
      continueBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      continueBtnRef.current?.focus();
    }, 120);
  };

  return (
    <div className="space-y-8">
      {/* Studio Banner & High-intent SEO Header - Clean Verticality of H1 */}
      <div className="border border-neutral-300 bg-white p-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight leading-tight">
              Studio OCD Live Lomé - Réservation de Live Streaming Commerçants House of Challenge
            </h1>
            
            <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
              Diffusez vos articles, votre numéro WhatsApp et vos offres de vente en direct devant des dizaines de milliers d'acheteurs sur TikTok et Facebook.
              <strong className="text-neutral-900"> « Le marketing avant la vente. »</strong>
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs text-neutral-600">
              <span className="flex items-center gap-1.5 font-semibold text-neutral-800">
                <span className="text-[#D96528]">■</span> 1 seul live à la fois (zéro chevauchement de créneau)
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-neutral-800">
                <span className="text-[#D96528]">■</span> Assistance régie et incrustation en continu de votre contact WhatsApp
              </span>
            </div>
          </div>

          {/* Real studio photo of BOVAN at Studio OCD Live */}
          <div className="lg:col-span-4 border border-neutral-300 bg-neutral-100 p-2">
            <div className="relative aspect-[9/12] max-h-56 w-full overflow-hidden bg-black">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-11-07_at_19.57.14_0a412c55.jpeg"
                alt="Studio OCD Live Lomé House of Challenge tournage en direct"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2 text-white">
                <p className="text-[11px] font-bold">Studio OCD Live Lomé</p>
                <p className="text-[10px] text-neutral-300">« De la créativité dans la simplicité »</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Choice Section - Clean Verticality of H2 */}
      <div className="bg-white border border-neutral-300 p-6 shadow-xs">
        <div className="border-b border-neutral-200 pb-4 mb-6">
          <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
            Mode de déroulement de votre live : Présentiel à Lomé ou À distance
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Sélectionnez votre formule de présence : venez directement au studio House of Challenge à Lomé ou intervenez à distance en duplex depuis votre boutique ou atelier partout en Afrique et dans le monde.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option 1: Présentiel à Lomé */}
          <div
            onClick={() => handleSelect('presentiel')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect('presentiel'); }}
            className={`border-2 p-6 cursor-pointer transition-all flex flex-col justify-between ${
              selectedMode === 'presentiel'
                ? 'border-[#B84A14] bg-[#FDF3EC] ring-1 ring-[#B84A14]'
                : 'border-neutral-300 bg-white hover:border-neutral-400'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="border border-neutral-300 bg-white p-3">
                  <MapPin className="w-6 h-6 text-[#B84A14]" />
                </div>
                {selectedMode === 'presentiel' && (
                  <span className="border border-[#B84A14] bg-[#B84A14] text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Sélectionné
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                En présentiel au Studio de Lomé (Togo)
              </h3>
              
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                Vous venez physiquement au studio de House of Challenge à Lomé avec vos échantillons, vos tenues ou vos créations culinaires.
              </p>

              <ul className="space-y-2 text-xs text-neutral-700 border-t border-neutral-200 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Plateau broadcast éclairé avec le logo lumineux officiel OCD Live</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Cadreur et régie audio-vidéo dédiés pendant toute la session</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Idéal pour les commerçants, créateurs de mode et restaurateurs du Grand Lomé</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-200">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                Localisation : Lomé, Togo
              </span>
            </div>
          </div>

          {/* Option 2: À distance */}
          <div
            onClick={() => handleSelect('distance')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect('distance'); }}
            className={`border-2 p-6 cursor-pointer transition-all flex flex-col justify-between ${
              selectedMode === 'distance'
                ? 'border-[#B84A14] bg-[#FDF3EC] ring-1 ring-[#B84A14]'
                : 'border-neutral-300 bg-white hover:border-neutral-400'
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="border border-neutral-300 bg-white p-3">
                  <Globe className="w-6 h-6 text-[#B84A14]" />
                </div>
                {selectedMode === 'distance' && (
                  <span className="border border-[#B84A14] bg-[#B84A14] text-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Sélectionné
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                À distance en duplex (Afrique & Diaspora Monde)
              </h3>
              
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                Vous restez dans votre boutique, atelier ou à domicile. Une assistante plateau au studio de Lomé relaie et présente vos offres en direct.
              </p>

              <ul className="space-y-2 text-xs text-neutral-700 border-t border-neutral-200 pt-4">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Assistante régie incluse à Lomé pour animer et présenter vos produits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Liaison duplex haute définition via votre smartphone (4G / Fibre / Wifi)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Parfait pour la diaspora et la sous-région (Côte d'Ivoire, Bénin, France, etc.)</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-200">
              <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                Portée : International / Diaspora
              </span>
            </div>
          </div>
        </div>

        {/* Action Button - Automatically targeted on selection */}
        <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-end">
          <button
            ref={continueBtnRef}
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 border border-neutral-900 bg-neutral-900 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-neutral-800 active:bg-black focus:ring-2 focus:ring-[#B84A14] transition-all cursor-pointer shadow-sm"
          >
            <span>Continuer vers le choix du Pack</span>
            <ArrowRight className="w-4 h-4 text-[#D96528]" />
          </button>
        </div>
      </div>
    </div>
  );
};
