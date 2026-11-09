import React, { useState } from 'react';
import { Shield, Scale, FileText, Cookie, Eye, Map, X } from 'lucide-react';

interface LegalModalProps {
  initialTab: 'mentions' | 'cgv' | 'privacy' | 'cookies' | 'accessibility' | 'sitemap';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  initialTab,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-3 sm:p-4 pt-14 sm:pt-20 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-2 border-neutral-800 w-full max-w-4xl mb-12 p-4 sm:p-6 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-300 mb-6 gap-2">
          <div className="flex items-center gap-3">
            <div className="border border-[#B84A14] bg-[#FDF3EC] p-2 text-[#B84A14] shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#B84A14] uppercase tracking-wider block">
                Cadre Juridique & Conformité
              </span>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                Informations Légales & Réglementaires
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="border-2 border-neutral-800 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-1.5 text-xs font-bold uppercase text-neutral-900 cursor-pointer transition-colors"
            title="Fermer cette fenêtre (ou cliquez dans le vide)"
          >
            ✕ Fermer
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap border-b border-neutral-300 mb-6 text-xs font-bold uppercase gap-1">
          <button
            onClick={() => setActiveTab('mentions')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'mentions'
                ? 'border-[#B84A14] text-[#B84A14] bg-[#FDF3EC]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Mentions Légales
          </button>
          <button
            onClick={() => setActiveTab('cgv')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'cgv'
                ? 'border-[#B84A14] text-[#B84A14] bg-[#FDF3EC]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            CGV (Vente)
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-[#B84A14] text-[#B84A14] bg-[#FDF3EC]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Confidentialité & RGPD
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'cookies'
                ? 'border-[#B84A14] text-[#B84A14] bg-[#FDF3EC]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Cookies (CNIL)
          </button>
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'accessibility'
                ? 'border-[#B84A14] text-[#B84A14] bg-[#FDF3EC]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Accessibilité AA
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'sitemap'
                ? 'border-[#B84A14] text-[#B84A14] bg-[#FDF3EC]'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Plan du site
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-[500px] overflow-y-auto pr-2 text-xs text-neutral-700 space-y-4 leading-relaxed">
          {activeTab === 'mentions' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase">1. Éditeur de la Plateforme & Studio</h3>
              <p>
                La plateforme de prise de rendez-vous en ligne <strong>OCD Live</strong> est exploitée par la structure <strong>House of Challenge</strong>, studio de production audiovisuelle et de streaming situé à Lomé, République Togolaise, sous la direction de M. BOVAN.
              </p>

              <h3 className="text-sm font-bold text-neutral-900 uppercase">2. Prestataire Technique & Facturation</h3>
              <p>
                La conception logicielle, l'infrastructure technique et la gestion des flux de facturation sont assurées par <strong>PELIFY SAS</strong>, société enregistrée en France sous le numéro <strong>SIREN 13066258800016</strong> (site officiel : <a href="https://www.pelify.app" target="_blank" rel="noreferrer" className="text-[#B84A14] underline">www.pelify.app</a>).
              </p>
              <p>
                TVA non applicable – article 293 B du Code général des impôts français. Les contrats et factures formelles sont régis par le droit français avec cession complète des droits d'exploitation au client.
              </p>
            </div>
          )}

          {activeTab === 'cgv' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase">Conditions Générales de Vente (CGV) - Studio OCD Live</h3>
              <p><strong>Article 1 - Objet :</strong> Les présentes CGV régissent la vente de prestations de diffusion en streaming vidéo en direct par House of Challenge / OCD Live sur les comptes TikTok et Facebook au profit des commerçants et producteurs OCD.</p>
              <p><strong>Article 2 - Tarifs et parité :</strong> Les prix sont affichés en Francs CFA (XOF) et en Euros (€) sur la base de la parité fixe 1 € = 655,957 FCFA. La réservation est confirmée dès validation du paiement.</p>
              <p><strong>Article 3 - Règle du créneau unique :</strong> Un créneau réservé bloque le studio pendant toute sa durée. Aucun autre commerçant ne peut réserver la même plage horaire.</p>
              <p><strong>Article 4 - Politique d'annulation et de report :</strong> L'annulation ou le report d'un créneau est totalement gratuit jusqu'à <strong>72 heures avant le début programmé du live</strong>. En cas d'annulation dans ce délai, un remboursement intégral ou un avoir valable 6 mois est émis sans frais de pénalité.</p>
              <p><strong>Article 5 - Droit à l'image :</strong> Le commerçant autorise la captation, la diffusion en direct et la rediffusion promotionnelle de ses produits et interventions par House of Challenge.</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase">Politique de Confidentialité & Protection des Données Personnelles</h3>
              <p>
                La présente politique est conforme aux exigences du <strong>Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679)</strong> et à la <strong>Loi n° 2019-014 relative à la protection des données à caractère personnel de la République Togolaise</strong>.
              </p>
              <p><strong>Base légale :</strong> Exécution du contrat de réservation et consentement exprès pour la diffusion du contact commercial en direct sur les réseaux sociaux.</p>
              <p><strong>Minimisation des données :</strong> Seules les informations strictement requises pour le titrage régie (Nom, WhatsApp, Marque, Catalogue) sont collectées.</p>
              <p><strong>Durée de conservation :</strong> Les données de compte commerçant sont conservées pendant toute la durée de la relation commerciale et supprimables sur simple demande à dpo@pelify.app.</p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase">Politique de Gestion des Cookies (Recommandations CNIL)</h3>
              <p>
                La plateforme OCD Live n'utilise <strong>aucun traceur publicitaire ni cookie tiers de profilage intrusif</strong>.
              </p>
              <p>
                Seuls des cookies techniques strictement nécessaires au fonctionnement du service (maintien de la session de réservation, stockage local de vos coordonnées pré-remplies et choix de consentement) sont déposés sur votre terminal.
              </p>
              <p>
                Vous pouvez à tout moment accepter ou refuser les cookies non obligatoires via le bandeau accessible en bas de page.
              </p>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 uppercase">Déclaration de Conformité d'Accessibilité Numérique (WCAG 2.1 AA)</h3>
              <p>
                Inspirée des standards de qualité du Service Public en ligne et du Référentiel Général d'Amélioration de l'Accessibilité (RGAA), la plateforme garantit :
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Un ratio de contraste texte/arrière-plan supérieur à 4,5:1 sur l'ensemble des boutons et formulaires.</li>
                <li>Une navigation intégrale au clavier sans piège de focus.</li>
                <li>Des jours fermés ou complets identifiés textuellement et pas seulement par la couleur.</li>
                <li>Des cibles tactiles supérieures à 44 px pour une utilisation aisée sur smartphone.</li>
                <li>Des intitulés de champs explicites et des annonces d'erreurs formulaires compréhensibles.</li>
              </ul>
            </div>
          )}

          {activeTab === 'sitemap' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-900 uppercase">Plan du Site (Architecture de l'Application)</h3>
              <ul className="space-y-1.5 list-disc pl-5">
                <li><strong className="text-neutral-900">Accueil & Prise de Rendez-vous :</strong> Étape 1 (Mode) - Étape 2 (Packs) - Étape 3 (Date) - Étape 4 (Créneau) - Étape 5 (Activité) - Étape 6 (Paiement) - Étape 7 (Confirmation & Reçu).</li>
                <li><strong className="text-neutral-900">Espace Commerçant OCD :</strong> Connexion double facteur (2FA OTP téléphone) - Historique de réservations - Reprise rapide de créneau - Fiche de passage régie.</li>
                <li><strong className="text-neutral-900">Régie & CRM BOVAN :</strong> Tableau de bord des diffusions - Suivi CA & Taux d'occupation - Export CSV - Synchronisation Google Agenda.</li>
                <li><strong className="text-neutral-900">Informations Légales :</strong> Mentions Légales - CGV - RGPD & Loi Togo - Cookies - Accessibilité.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Bottom footer close action */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <span>Cliquez en dehors ou sur le bouton pour quitter</span>
          <button
            type="button"
            onClick={onClose}
            className="border-2 border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-1.5 font-bold uppercase text-xs cursor-pointer transition-colors"
          >
            ✕ Fermer la fenêtre
          </button>
        </div>
      </div>
    </div>
  );
};
