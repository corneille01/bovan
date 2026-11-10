import React, { useState } from 'react';
import { Shield, Scale, FileText, Cookie, Eye, Map, X } from 'lucide-react';

interface LegalModalProps {
  initialTab: 'mentions' | 'cgv' | 'privacy' | 'cookies' | 'accessibility' | 'sitemap';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ initialTab, onClose }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-3 sm:p-4 pt-14 sm:pt-20 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div onClick={(e) => e.stopPropagation()} className="bg-white border-2 border-neutral-800 w-full max-w-4xl mb-12 p-4 sm:p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-300 mb-6 gap-2">
          <div className="flex items-center gap-3">
            <div className="border border-[#B84A14] bg-[#FDF3EC] p-2 text-[#B84A14] shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">Informations légales</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="border-2 border-neutral-800 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-1.5 text-xs font-bold text-neutral-900 cursor-pointer transition-colors"
            title="Fermer cette fenêtre"
          >
            Fermer
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap border-b border-neutral-300 mb-6 text-xs font-bold gap-1">
          <button
            onClick={() => setActiveTab('mentions')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'mentions' ? 'border-[#B84A14] text-[#B84A14] bg-[#FDF3EC]' : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Mentions légales
          </button>
          <button
            onClick={() => setActiveTab('cgv')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'cgv' ? 'border-[#B84A14] text-[#B84A14] bg-[#FDF3EC]' : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            CGV
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'privacy' ? 'border-[#B84A14] text-[#B84A14] bg-[#FDF3EC]' : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Confidentialité
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'cookies' ? 'border-[#B84A14] text-[#B84A14] bg-[#FDF3EC]' : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Cookies
          </button>
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'accessibility' ? 'border-[#B84A14] text-[#B84A14] bg-[#FDF3EC]' : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Accessibilité
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'sitemap' ? 'border-[#B84A14] text-[#B84A14] bg-[#FDF3EC]' : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Plan du site
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-[500px] overflow-y-auto pr-2 text-xs text-neutral-700 space-y-4 leading-relaxed">
          {activeTab === 'mentions' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">Éditeur du site</h3>
              <p>
                Le site OCD Live est édité par <strong>House of Challenge</strong>, studio de diffusion en direct situé à Lomé, au Togo.
              </p>
              <p>Forme juridique et numéro d'immatriculation : À compléter.</p>
              <p>Adresse du siège : À compléter.</p>
              <p>Responsable de la publication : À compléter.</p>

              <h3 className="text-sm font-bold text-neutral-900">Conception technique</h3>
              <p>
                Le site est conçu et maintenu par PELIFY (
                <a href="https://www.pelify.app" target="_blank" rel="noreferrer" className="text-[#B84A14] underline">
                  www.pelify.app
                </a>
                ).
              </p>
              <p>Informations sur la société : À compléter.</p>
            </div>
          )}

          {activeTab === 'cgv' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">Conditions générales de vente</h3>
              <p>
                <strong>Article 1, objet.</strong> Ces conditions encadrent la vente de prestations de live en direct par House of Challenge (OCD Live) sur
                TikTok et Facebook, au profit des commerçants et des créateurs.
              </p>
              <p>
                <strong>Article 2, tarifs.</strong> Les prix sont affichés en francs CFA (XOF) et en euros. La parité utilisée est 1 € = 655,957 FCFA. La
                réservation est confirmée une fois le paiement vérifié par le studio.
              </p>
              <p>
                <strong>Article 3, créneau unique.</strong> Un créneau réservé bloque le studio pendant toute sa durée. Aucun autre client ne peut réserver la
                même plage horaire.
              </p>
              <p>
                <strong>Article 4, annulation et report.</strong> L'annulation ou le report est gratuit jusqu'à 72 heures avant le début du live. Dans ce délai,
                le studio rembourse la somme versée ou propose un avoir de 6 mois.
              </p>
              <p>
                <strong>Article 5, droit à l'image.</strong> Le client autorise la captation, la diffusion en direct et la rediffusion de ses produits et de ses
                interventions par House of Challenge.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">Politique de confidentialité</h3>
              <p>
                Nous traitons vos données selon la loi togolaise n° 2019-014 sur la protection des données à caractère personnel et, lorsqu'il s'applique, le
                RGPD (règlement UE 2016/679).
              </p>
              <p>
                <strong>Données collectées.</strong> Votre nom, votre numéro WhatsApp, le nom de votre activité, la description de vos produits et les
                informations de paiement.
              </p>
              <p>
                <strong>Finalités.</strong> Traiter votre réservation, préparer le live, vérifier le paiement et vous envoyer des messages sur votre
                réservation.
              </p>
              <p>
                <strong>Base légale.</strong> L'exécution de votre réservation et votre consentement pour la diffusion en direct.
              </p>
              <p>
                <strong>Destinataires.</strong> Le studio, ainsi que des prestataires d'hébergement et d'envoi de messages. Nous ne vendons pas vos données.
              </p>
              <p>
                <strong>Durée de conservation.</strong> Nous gardons vos données pendant la relation commerciale. Durée de conservation après la fin de la
                relation : À compléter.
              </p>
              <p>
                <strong>Vos droits.</strong> Vous pouvez demander l'accès, la correction ou la suppression de vos données. Contact pour exercer vos droits : À
                compléter.
              </p>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">Politique de cookies</h3>
              <p>Le site n'utilise pas de cookies publicitaires.</p>
              <p>
                Les cookies techniques sont nécessaires au fonctionnement du site. Ils gardent votre réservation en cours, vos coordonnées pré-remplies et votre
                choix sur les cookies.
              </p>
              <p>Vous pouvez accepter ou refuser les autres cookies avec le bandeau en bas de page.</p>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-900">Déclaration d'accessibilité</h3>
              <p>Le site vise le niveau AA des WCAG. L'évaluation est en cours.</p>
              <p>Nous travaillons sur les points suivants :</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Un contraste suffisant entre le texte et le fond.</li>
                <li>Une navigation complète au clavier.</li>
                <li>Des jours complets ou fermés indiqués par un texte, pas seulement par la couleur.</li>
                <li>Des boutons assez grands pour le téléphone.</li>
                <li>Des champs clairement nommés et des erreurs compréhensibles.</li>
              </ul>
              <p>Pour signaler un problème d'accessibilité, contact : À compléter.</p>
            </div>
          )}

          {activeTab === 'sitemap' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-neutral-900">Plan du site</h3>
              <ul className="space-y-1.5 list-disc pl-5">
                <li>
                  <strong className="text-neutral-900">Réserver un live.</strong> Choisissez le mode, le pack, la date et le créneau. Décrivez votre activité,
                  payez, puis recevez la confirmation.
                </li>
                <li>
                  <strong className="text-neutral-900">Espace client.</strong> Connectez-vous pour retrouver vos réservations et reprendre un créneau.
                </li>
                <li>
                  <strong className="text-neutral-900">Informations légales.</strong> Mentions légales, CGV, confidentialité, cookies et accessibilité.
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Bottom footer close action */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <span>Cliquez en dehors pour fermer</span>
          <button
            type="button"
            onClick={onClose}
            className="border-2 border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-1.5 font-bold text-xs cursor-pointer transition-colors"
          >
            Fermer la fenêtre
          </button>
        </div>
      </div>
    </div>
  );
};
