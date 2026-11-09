import { Pack } from '../types';

export const PACKS: Pack[] = [
  {
    id: 'express',
    name: '1. Pack Express',
    durationLabel: '1 h 30',
    durationMinutes: 90,
    priceFcfa: 15000,
    priceEur: 23,
    headline: '1 live en studio ou à distance',
    description: 'Le format idéal pour tester le live streaming OCD, présenter vos produits phares et afficher votre numéro.',
    sessionsCount: 1,
    features: [
      '1 live dédié de 1 h 30 en direct sur TikTok & Facebook',
      'Accompagnement complet de la régie House of Challenge',
      'Affichage permanent de votre numéro WhatsApp et adresse à l\'écran',
      'En présentiel au studio de Lomé OU à distance avec assistante dédiée',
      'Conseils préparatoires pour placer vos produits et argumentaires'
    ]
  },
  {
    id: 'duo',
    name: '2. Pack Duo',
    durationLabel: '3 h (2 lives de 1 h 30)',
    durationMinutes: 90,
    priceFcfa: 27000,
    priceEur: 41,
    headline: '2 lives de 1 h 30 - Économisez 3 000 FCFA',
    description: 'Deux créneaux pour relancer votre audience et approfondir la présentation de votre catalogue.',
    sessionsCount: 2,
    features: [
      '2 sessions distinctes de 1 h 30 (date du 1er créneau choisie ici)',
      'Deuxième créneau fixé directement avec la régie selon vos disponibilités',
      'Bandeau contact incrusté personnalisé',
      'Régie complète et modération des commentaires en direct',
      'Statistiques d\'audience après chaque session'
    ]
  },
  {
    id: 'marathon',
    name: '3. Pack Marathon',
    durationLabel: '4 h (bloc continu)',
    durationMinutes: 240,
    priceFcfa: 30000,
    priceEur: 46,
    headline: '1 bloc continu de 4 h - 7 500 FCFA / h',
    description: 'Grande session intensive de déstockage, promotions flash ou démonstration artisanale en grand format.',
    sessionsCount: 1,
    isContinuousBlock: true,
    features: [
      'Créneau XXL de 4 heures en continu (09h-13h ou 14h-18h)',
      'Tarif préférentiel : 7 500 FCFA / heure au lieu de 10 000 FCFA',
      'Animation continue avec transitions et mise en avant des stocks',
      'Incrustation de vos catalogues et fiches produits',
      'Assistance technique renforcée tout au long du marathon'
    ]
  },
  {
    id: 'visibilite',
    name: '4. Pack Visibilité',
    durationLabel: '1 h 30 + Annonce Vidéo',
    durationMinutes: 90,
    priceFcfa: 35000,
    priceEur: 53,
    headline: '1 live + annonce officielle par BOVAN',
    description: 'BOVAN annonce personnellement votre live sur les comptes TikTok & Facebook de House of Challenge avec votre vidéo.',
    recommended: true,
    sessionsCount: 1,
    features: [
      '1 live dédié de 1 h 30 dirigé par la régie OCD Live',
      'Vidéo d\'annonce publiée par BOVAN avant le live sur TikTok & Facebook',
      'Boost massif de la notoriété et afflux garanti dès le début du live',
      'Accompagnement éditorial personnalisé pour votre vidéo teaser',
      'Bannière sponsorisée sur le stream et épinglage du contact'
    ]
  },
  {
    id: 'mensuel',
    name: '5. Pack Mensuel',
    durationLabel: '6 h (4 lives)',
    durationMinutes: 90,
    priceFcfa: 55000,
    priceEur: 84,
    headline: '4 lives (1 / semaine) + 1 annonce officielle',
    description: 'Une présence continue chaque semaine pour fidéliser votre clientèle et multiplier vos contacts d\'affaires.',
    sessionsCount: 4,
    features: [
      '4 lives de 1 h 30 répartis sur le mois (1 live chaque semaine)',
      '1 annonce vidéo officielle publiée sur les réseaux BOVAN',
      'Planification prioritaire des créneaux hebdomadaires',
      'Fiche client dédiée dans le CRM et suivi régulier des ventes',
      'Tarif dégressif avantageux pour les commerçants réguliers'
    ]
  },
  {
    id: 'premium',
    name: '6. Pack Premium Mois',
    durationLabel: '10 h (4 lives + Marathon + 4 annonces)',
    durationMinutes: 90,
    priceFcfa: 120000,
    priceEur: 183,
    headline: 'La formule ultime d\'accélération commerciale',
    description: '4 lives + 4 annonces vidéo + vidéo de présentation dédiée par BOVAN + 1 bloc Marathon de 4 h complet.',
    sessionsCount: 5,
    features: [
      '4 lives de 1 h 30 + 1 bloc continu Marathon de 4 heures (10 h au total)',
      '4 annonces de diffusion programmées sur les comptes officiels',
      '1 vidéo de présentation dédiée enregistrée et publiée par BOVAN',
      'Mise en avant VIP sur les canaux House of Challenge & réseaux partenaires',
      'Suivi stratégique et rapport complet de conversion et prises de contact'
    ]
  }
];

export const TIME_SLOTS_1H30 = [
  { time: '09:00', endTime: '10:30', label: '09h00 – 10h30 GMT' },
  { time: '10:30', endTime: '12:00', label: '10h30 – 12h00 GMT' },
  { time: '14:00', endTime: '15:30', label: '14h00 – 15h30 GMT' },
  { time: '15:30', endTime: '17:00', label: '15h30 – 17h00 GMT' },
  { time: '17:00', endTime: '18:30', label: '17h00 – 18h30 GMT' }
];

export const TIME_SLOTS_4H = [
  { time: '09:00', endTime: '13:00', label: '09h00 – 13h00 GMT (Matinée Marathon)' },
  { time: '14:00', endTime: '18:00', label: '14h00 – 18h00 GMT (Après-midi Marathon)' }
];
