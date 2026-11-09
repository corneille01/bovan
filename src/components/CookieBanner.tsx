import React from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';

interface CookieBannerProps {
  onAccept: () => void;
  onDecline: () => void;
  onCustomize: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  onAccept,
  onDecline,
  onCustomize
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t-2 border-neutral-800 bg-[#161616] text-white p-4 shadow-2xl">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Cookie className="w-4 h-4 text-[#D96528]" />
            <span className="font-bold uppercase tracking-wider text-neutral-200">
              Gestion de votre vie privée & Cookies
            </span>
          </div>
          <p className="text-neutral-300 max-w-2xl leading-relaxed">
            Ce site utilise uniquement des traceurs techniques indispensables au traitement de votre réservation et à la mémorisation de votre session commerçant (conforme CNIL & Loi togolaise n° 2019-014). Aucun cookie publicitaire tiers n'est utilisé.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onDecline}
            className="border border-neutral-600 bg-transparent px-4 py-2 font-bold uppercase text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
          >
            Tout refuser
          </button>

          <button
            type="button"
            onClick={onCustomize}
            className="border border-neutral-600 bg-neutral-800 px-4 py-2 font-bold uppercase text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            Personnaliser
          </button>

          <button
            type="button"
            onClick={onAccept}
            className="border border-[#B84A14] bg-[#B84A14] px-5 py-2 font-bold uppercase text-white hover:bg-[#9E3E0F] transition-colors"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
};
