import React, { useState } from 'react';
import { 
  LayoutDashboard, Search, Filter, Download, Calendar, CheckCircle2, Clock, 
  XCircle, User, Phone, MapPin, ExternalLink, RefreshCw, MessageSquare, 
  Printer, ArrowUpRight, TrendingUp, Radio, ShieldCheck, LogOut
} from 'lucide-react';
import { Booking, BookingStatus, UserAccount } from '../types';
import { PACKS } from '../data/packs';
import { formatFcfa, formatEur, formatDateFr } from '../utils/formatters';

interface RegieDashboardProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: BookingStatus, notes?: string) => void;
  onOpenPassageSheet: (booking: Booking) => void;
  onOpenNotifications: () => void;
  onLogout?: () => void;
}

export const RegieDashboard: React.FC<RegieDashboardProps> = ({
  bookings,
  onUpdateStatus,
  onOpenPassageSheet,
  onOpenNotifications,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(bookings[0] || null);
  const [regieNoteInput, setRegieNoteInput] = useState<string>('');
  const [syncedGoogle, setSyncedGoogle] = useState<Record<string, boolean>>({});

  // KPIs
  const totalRevenueFcfa = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalFcfa, 0);
  const totalRevenueEur = bookings
    .filter(b => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalEur, 0);

  const totalSlotsCount = bookings.filter(b => b.status !== 'cancelled').length;
  const presentielCount = bookings.filter(b => b.mode === 'presentiel' && b.status !== 'cancelled').length;
  const distanceCount = bookings.filter(b => b.mode === 'distance' && b.status !== 'cancelled').length;
  const occupancyRate = Math.min(100, Math.round((totalSlotsCount / 24) * 100)); // Studio month capacity estimate

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesMode = modeFilter === 'all' || b.mode === modeFilter;

    return matchesSearch && matchesStatus && matchesMode;
  });

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Reference', 'Date', 'Heure', 'Mode', 'Pack', 'Commercant', 
      'Boutique', 'Secteur', 'Telephone_Regie', 'Telephone_Ecran', 
      'Pays', 'Montant_FCFA', 'Statut', 'Paiement'
    ];

    const rows = bookings.map(b => [
      b.reference,
      b.date,
      b.slotTime,
      b.mode,
      b.packId,
      `"${b.fullName}"`,
      `"${b.businessName}"`,
      b.sector,
      `"${b.countryCode} ${b.phone}"`,
      `"${b.onScreenPhone}"`,
      `"${b.country}"`,
      b.totalFcfa,
      b.status,
      b.paymentMethod
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OCD_Live_Reservations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSyncGoogleCalendar = (id: string) => {
    setSyncedGoogle(prev => ({ ...prev, [id]: true }));
  };

  const handleSaveNotes = () => {
    if (!selectedBooking) return;
    onUpdateStatus(selectedBooking.id, selectedBooking.status, regieNoteInput);
    setSelectedBooking({ ...selectedBooking, regieNotes: regieNoteInput });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner CRM */}
      <div className="border border-neutral-300 bg-white p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
              Tableau de Bord Régie & Pilotage des Diffusions OCD Live Lomé
            </h1>
            <p className="text-xs text-neutral-600 mt-1">
              Supervision de la programmation en direct, fiches techniques des commerçants et suivi des recettes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 border border-neutral-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:bg-neutral-100"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter CSV</span>
            </button>

            <button
              onClick={onOpenNotifications}
              className="flex items-center gap-1.5 border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-neutral-800"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D96528]" />
              <span>Journal Notifications</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                title="Quitter la session régie"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion Régie</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Stat Boxes (No pills, rigorous data alignment) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-neutral-300 bg-neutral-50 p-4">
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block mb-1">
              Chiffre d'Affaires Encaissé
            </span>
            <div className="text-2xl font-black text-neutral-900 font-mono-numbers">
              {formatFcfa(totalRevenueFcfa)}
            </div>
            <span className="text-xs text-neutral-500 font-mono-numbers">
              soit {formatEur(totalRevenueEur)} (parité fixe)
            </span>
          </div>

          <div className="border border-neutral-300 bg-neutral-50 p-4">
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block mb-1">
              Créneaux Réservés Actifs
            </span>
            <div className="text-2xl font-black text-neutral-900 font-mono-numbers">
              {totalSlotsCount} créneaux
            </div>
            <span className="text-xs text-neutral-500">
              {presentielCount} présentiel - {distanceCount} à distance
            </span>
          </div>

          <div className="border border-neutral-300 bg-neutral-50 p-4">
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block mb-1">
              Taux d'Occupation Studio
            </span>
            <div className="text-2xl font-black text-[#B84A14] font-mono-numbers">
              {occupancyRate} %
            </div>
            <span className="text-xs text-neutral-500">
              Capacité maximale : 1 live par créneau
            </span>
          </div>

          <div className="border border-neutral-300 bg-neutral-50 p-4">
            <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider block mb-1">
              Assistante Studio Lomé
            </span>
            <div className="text-base font-extrabold text-neutral-900 mt-1">
              Ablavi & Folly
            </div>
            <span className="text-xs text-emerald-700 font-medium">
              ● En service - Prise en charge duplex
            </span>
          </div>
        </div>
      </div>

      {/* Main CRM Grid: Left = Bookings table, Right = Active Merchant Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Bookings list */}
        <div className="lg:col-span-7 bg-white border border-neutral-300 p-5 shadow-xs">
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4 pb-4 border-b border-neutral-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, boutique, réf..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-neutral-300 text-xs focus:border-[#B84A14] focus:outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-neutral-300 bg-white px-2.5 py-2 text-xs font-bold text-neutral-700 focus:outline-none"
              >
                <option value="all">Tous statuts</option>
                <option value="pending">À confirmer</option>
                <option value="confirmed">Confirmées</option>
                <option value="completed">Réalisées</option>
                <option value="cancelled">Annulées</option>
              </select>

              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="border border-neutral-300 bg-white px-2.5 py-2 text-xs font-bold text-neutral-700 focus:outline-none"
              >
                <option value="all">Tous modes</option>
                <option value="presentiel">Présentiel</option>
                <option value="distance">À distance</option>
              </select>
            </div>
          </div>

          {/* Bookings rows */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredBookings.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                Aucune réservation ne correspond à vos critères de recherche.
              </div>
            ) : (
              filteredBookings.map((b) => {
                const isSelected = selectedBooking?.id === b.id;
                const pack = PACKS.find(p => p.id === b.packId);

                return (
                  <div
                    key={b.id}
                    onClick={() => {
                      setSelectedBooking(b);
                      setRegieNoteInput(b.regieNotes || '');
                    }}
                    className={`border-2 p-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#B84A14] bg-[#FDF3EC]'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <span className="font-mono font-bold text-xs text-neutral-900 block">
                          {b.reference} - <strong className="text-neutral-900">{b.businessName}</strong>
                        </span>
                        <span className="text-[11px] text-neutral-500">
                          {b.fullName} ({b.countryCode} {b.phone})
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-bold uppercase px-2 py-0.5 border ${
                          b.status === 'confirmed'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                            : b.status === 'pending'
                            ? 'border-amber-600 bg-amber-50 text-amber-800'
                            : b.status === 'completed'
                            ? 'border-neutral-500 bg-neutral-100 text-neutral-700'
                            : 'border-red-600 bg-red-50 text-red-800'
                        }`}
                      >
                        {b.status === 'confirmed' ? 'Confirmée' : b.status === 'pending' ? 'À confirmer' : b.status === 'completed' ? 'Réalisée' : 'Annulée'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-neutral-100 text-neutral-600">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-800 capitalize">
                          {b.date} - {b.slotTime} GMT
                        </span>
                        <span>-</span>
                        <span className="font-mono">{b.mode === 'presentiel' ? 'Studio Lomé' : `Distance (${b.country})`}</span>
                      </div>
                      <span className="font-mono font-bold text-neutral-900">
                        {formatFcfa(b.totalFcfa)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Merchant & Slot Inspector */}
        <div className="lg:col-span-5 bg-white border border-neutral-300 p-5 shadow-xs">
          {selectedBooking ? (
            <div className="space-y-5 text-xs">
              {/* Header Inspector */}
              <div className="border-b border-neutral-200 pb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-sm text-neutral-900">
                    Dossier {selectedBooking.reference}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#B84A14] bg-[#FDF3EC] border border-[#B84A14] px-1.5 py-0.5">
                    {selectedBooking.mode === 'presentiel' ? 'Présentiel Lomé' : 'À distance'}
                  </span>
                </div>
                <h3 className="text-lg font-black text-neutral-900">
                  {selectedBooking.businessName}
                </h3>
                <p className="text-neutral-500">
                  Responsable : {selectedBooking.fullName} - {selectedBooking.countryCode} {selectedBooking.phone}
                </p>
              </div>

              {/* Slot & Live Setup */}
              <div className="border border-neutral-200 bg-neutral-50 p-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Date de passage :</span>
                  <strong className="text-neutral-900 capitalize">{formatDateFr(selectedBooking.date)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Créneau horaire :</span>
                  <strong className="font-mono text-neutral-900">{selectedBooking.slotTime} - {selectedBooking.slotEndTime} GMT</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Formule pack :</span>
                  <strong className="text-[#B84A14] uppercase">{PACKS.find(p => p.id === selectedBooking.packId)?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Numéro à afficher en direct :</span>
                  <strong className="font-mono text-emerald-800">{selectedBooking.onScreenPhone}</strong>
                </div>
              </div>

              {/* Products description */}
              <div>
                <span className="text-neutral-500 font-bold uppercase text-[10px] block mb-1">
                  Catalogue & Produits présentés :
                </span>
                <div className="border border-neutral-200 bg-white p-2.5 text-neutral-800 leading-relaxed">
                  {selectedBooking.productsDescription}
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <span className="text-neutral-500 font-bold uppercase text-[10px] block mb-2">
                  Changer le statut régie :
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(selectedBooking.id, 'confirmed')}
                    className={`py-2 px-3 text-xs font-bold uppercase border transition-colors ${
                      selectedBooking.status === 'confirmed'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    ✓ Confirmer
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateStatus(selectedBooking.id, 'completed')}
                    className={`py-2 px-3 text-xs font-bold uppercase border transition-colors ${
                      selectedBooking.status === 'completed'
                        ? 'border-neutral-800 bg-neutral-800 text-white'
                        : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    ● Réalisée (Diffusée)
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateStatus(selectedBooking.id, 'pending')}
                    className={`py-2 px-3 text-xs font-bold uppercase border transition-colors ${
                      selectedBooking.status === 'pending'
                        ? 'border-amber-600 bg-amber-600 text-white'
                        : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    ⏳ Mettre en attente
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateStatus(selectedBooking.id, 'cancelled')}
                    className={`py-2 px-3 text-xs font-bold uppercase border transition-colors ${
                      selectedBooking.status === 'cancelled'
                        ? 'border-red-600 bg-red-600 text-white'
                        : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    ✕ Annuler
                  </button>
                </div>
              </div>

              {/* Notes Régie */}
              <div>
                <span className="text-neutral-500 font-bold uppercase text-[10px] block mb-1">
                  Consignes & Notes internes régie (BOVAN / Assistante) :
                </span>
                <textarea
                  rows={2}
                  value={regieNoteInput}
                  onChange={(e) => setRegieNoteInput(e.target.value)}
                  placeholder="Ex : Échantillons reçus, liaison WhatsApp testée..."
                  className="w-full p-2 border border-neutral-300 text-xs focus:border-[#B84A14] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="mt-1 border border-neutral-800 bg-neutral-900 px-3 py-1 text-[11px] font-bold text-white uppercase"
                >
                  Enregistrer les notes
                </button>
              </div>

              {/* Integrations & Output */}
              <div className="pt-3 border-t border-neutral-200 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenPassageSheet(selectedBooking)}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-neutral-300 bg-neutral-100 py-2 font-bold uppercase text-neutral-800 hover:bg-neutral-200"
                >
                  <Printer className="w-3.5 h-3.5 text-[#B84A14]" />
                  <span>Fiche régie</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSyncGoogleCalendar(selectedBooking.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 border py-2 font-bold uppercase ${
                    syncedGoogle[selectedBooking.id] || selectedBooking.googleCalendarSynced
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {syncedGoogle[selectedBooking.id] || selectedBooking.googleCalendarSynced
                      ? 'Google Agenda ✓'
                      : 'Sync Google Agenda'}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-500">
              Sélectionnez une réservation dans la colonne de gauche pour afficher ses détails techniques.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
