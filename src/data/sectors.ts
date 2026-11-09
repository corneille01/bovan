import { ActivitySector } from '../types';
import { ALL_COUNTRIES } from './countries';

export const SECTORS: { id: ActivitySector; label: string; icon: string }[] = [
  { id: 'restauration', label: 'Restauration & Traiteur (Fast food, maquis, épicerie)', icon: 'Utensils' },
  { id: 'mode_textile', label: 'Mode, Vêtements, Chaussures & Maroquinerie', icon: 'Shirt' },
  { id: 'cosmetique_beaute', label: 'Cosmétique, Beauté & Soins capillaires', icon: 'Sparkles' },
  { id: 'artisanat_deco', label: 'Artisanat d\'art, Meubles, Décoration & Bijoux', icon: 'Palette' },
  { id: 'agrobusiness', label: 'Agroalimentaire & Produits du terroir africain', icon: 'Wheat' },
  { id: 'tech_telecom', label: 'High-Tech, Téléphonie & Accessoires connectés', icon: 'Smartphone' },
  { id: 'services', label: 'Prestations de services, Formations & Événementiel', icon: 'Briefcase' },
  { id: 'autre', label: 'Autre secteur d\'activité', icon: 'Store' }
];

export const COUNTRY_CODES = ALL_COUNTRIES.map(c => ({
  id: `${c.iso}-${c.code}`,
  code: c.code,
  country: c.name,
  flag: c.flag
}));
