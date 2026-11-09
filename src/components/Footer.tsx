import React from 'react';

interface FooterProps {
  onOpenLegal: (tab: 'mentions' | 'cgv' | 'privacy' | 'cookies' | 'accessibility' | 'sitemap') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="mt-16 border-t-2 border-[#1E242B] bg-[#141414] text-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-neutral-800 text-xs text-center md:text-left">
          {/* Col 1: Studio House of Challenge */}
          <div className="flex flex-col items-center md:items-start">
            <div className="border border-[#D96528] bg-black inline-block px-2.5 py-1 mb-3">
              <span className="font-black text-[#D96528]">OCD</span>
              <span className="ml-1 text-[11px] font-bold text-white uppercase">Live</span>
            </div>
            <p className="font-bold text-white mb-1">House of Challenge - Lomé</p>
            <p className="text-neutral-400 leading-relaxed mb-2 max-w-md">
              Studio professionnel de diffusion en direct pour les commerçants, restaurateurs et créateurs.
            </p>
            <p className="text-neutral-400">
              Boulevard du 13 Janvier, Lomé (Togo) - Heure studio GMT
            </p>
          </div>

          {/* Col 2: Garanties & Engagements */}
          <div className="flex flex-col items-center md:items-start">
            <p className="font-bold text-white uppercase tracking-wider mb-3">Garanties & Engagements</p>
            <ul className="space-y-1.5 text-neutral-400 text-center md:text-left">
              <li className="flex items-center justify-center md:justify-start gap-1.5">
                <span className="text-[#D96528]">■</span>
                <span>Zéro double réservation (créneau unique garanti)</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-1.5">
                <span className="text-[#D96528]">■</span>
                <span>Assistante dédiée et suivi technique inclus</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-1.5">
                <span className="text-[#D96528]">■</span>
                <span>Report ou annulation sans frais jusqu'à 72 h</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-1.5">
                <span className="text-[#D96528]">■</span>
                <span>Diffusion multi-plateforme TikTok & Facebook</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links & Copyright - Centered on Mobile & Tablet */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-xs text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-neutral-400">
            <button 
              onClick={() => onOpenLegal('mentions')}
              className="hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Mentions Légales
            </button>
            <span>-</span>
            <button 
              onClick={() => onOpenLegal('cgv')}
              className="hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              CGV
            </button>
            <span>-</span>
            <button 
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Confidentialité
            </button>
            <span>-</span>
            <button 
              onClick={() => onOpenLegal('cookies')}
              className="hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Cookies
            </button>
            <span>-</span>
            <button 
              onClick={() => onOpenLegal('accessibility')}
              className="hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Accessibilité
            </button>
            <span>-</span>
            <button 
              onClick={() => onOpenLegal('sitemap')}
              className="hover:text-white transition-colors underline-offset-4 hover:underline cursor-pointer"
            >
              Plan du site
            </button>
          </div>

          <p className="text-neutral-500 font-mono text-[11px] text-center">
            © 2026 House of Challenge - OCD Live Lomé. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
