import React from 'react';

interface FooterProps {
  onOpenLegal: (tab: 'mentions' | 'cgv' | 'privacy' | 'cookies' | 'accessibility' | 'sitemap') => void;
}

const LINKS: { tab: 'mentions' | 'cgv' | 'privacy' | 'cookies' | 'accessibility' | 'sitemap'; label: string }[] = [
  { tab: 'mentions', label: 'Mentions légales' },
  { tab: 'cgv', label: 'CGV' },
  { tab: 'privacy', label: 'Confidentialité' },
  { tab: 'cookies', label: 'Cookies' },
  { tab: 'accessibility', label: 'Accessibilité' },
  { tab: 'sitemap', label: 'Plan du site' },
];

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="mt-16 border-t border-neutral-300 bg-white text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="pb-8 border-b border-neutral-300 text-xs text-center md:text-left">
          <div className="border border-[#B84A14] bg-white inline-block px-2.5 py-1 mb-3">
            <span className="font-bold text-[#B84A14]">OCD</span>
            <span className="ml-1 text-[11px] font-bold text-neutral-900">Live</span>
          </div>
          <p className="text-neutral-700 leading-relaxed max-w-xl mx-auto md:mx-0">
            OCD Live, le studio de House of Challenge à Lomé. Horaires en heure de Lomé (GMT).
          </p>
        </div>

        <nav
          aria-label="Informations légales"
          className="pt-6 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-xs text-center md:text-left"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-neutral-700">
            {LINKS.map(({ tab, label }) => (
              <li key={tab}>
                <button
                  type="button"
                  onClick={() => onOpenLegal(tab)}
                  className="hover:text-[#B84A14] transition-colors underline underline-offset-4 cursor-pointer"
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>

          <p className="text-neutral-600 text-[11px] text-center">© 2026 House of Challenge. Tous droits réservés.</p>
        </nav>
      </div>
    </footer>
  );
};
