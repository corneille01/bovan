import React, { useState } from 'react';
import { Search, Download, MessageSquare, Printer, LogOut } from 'lucide-react';
import { Booking, BookingStatus } from '../types';
import { PACKS } from '../data/packs';
import { formatFcfa, formatEur, formatDateFr } from '../utils/formatters';

interface RegieDashboardProps {
  bookings: Booking[];
  onUpdateStatus: (id: string, status: BookingStatus, notes?: string) => void;
  onOpenPassageSheet: (booking: Booking) => void;
  onOpenNotifications: () => void;
  onLogout?: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'À confirmer',
  confirmed: 'Confirmée',
  completed: 'Réalisée',
  cancelled: 'Annulée',
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  tmoney: 'TMoney',
  flooz: 'Flooz',
  mtn_momo: 'MTN MoMo',
  card: 'Carte bancaire',
  wave_orange: 'Wave ou Orange Money',
  bank_transfer: 'Virement bancaire',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  completed: 'Payé',
  pending: 'Paiement en attente',
  failed: 'Paiement échoué',
};

export const RegieDashboard: React.FC<RegieDashboardProps> = ({ bookings, onUpdateStatus, onOpenPassageSheet, onOpenNotifications, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modeFilter, setModeFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(bookings[0]?.id ?? null);
  const [regieNoteInput, setRegieNoteInput] = useState<string>(bookings[0]?.regieNotes || '');

  // Always read the live booking so status buttons reflect the latest props
  const selectedBooking = bookings.find((b) => b.id === selectedId) ?? null;

  // Statistiques calculées à partir des réservations reçues
  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const paidBookings = activeBookings.filter((b) => b.paymentStatus === 'completed');
  const unpaidBookings = activeBookings.filter((b) => b.paymentStatus !== 'completed');

  const paidFcfa = paidBookings.reduce((sum, b) => sum + b.totalFcfa, 0);
  const paidEur = paidBookings.reduce((sum, b) => sum + b.totalEur, 0);
  const unpaidFcfa = unpaidBookings.reduce((sum, b) => sum + b.totalFcfa, 0);

  const presentielCount = activeBookings.filter((b) => b.mode === 'presentiel').length;
  const distanceCount = activeBookings.filter((b) => b.mode === 'distance').length;
  const toConfirmCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
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
      'Reference',
      'Date',
      'Heure',
      'Mode',
      'Pack',
      'Commercant',
      'Boutique',
      'Secteur',
      'Telephone_Client',
      'Telephone_Ecran',
      'Pays',
      'Montant_FCFA',
      'Statut',
      'Paiement',
      'Statut_Paiement',
      'Reference_Paiement',
    ];

    const rows = bookings.map((b) => [
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
      b.paymentMethod,
      b.paymentStatus,
      `"${b.paymentReference}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OCD_Live_Reservations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveNotes = () => {
    if (!selectedBooking) return;
    onUpdateStatus(selectedBooking.id, selectedBooking.status, regieNoteInput);
  };

  const statusButtonBase = 'py-2 px-3 text-xs font-bold border transition-colors';
  const statusButtonIdle = 'border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-100';

  return (
    <div className="space-y-6">
      {/* En-tête et statistiques */}
      <div className="border border-neutral-300 bg-white p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 ">Gestion des lives</h1>
            <p className="text-xs text-neutral-600 mt-1">Suivez les réservations, les paiements et les fiches de passage.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-neutral-800 hover:bg-neutral-100"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter en CSV</span>
            </button>

            <button
              type="button"
              onClick={onOpenNotifications}
              className="flex items-center gap-1.5 border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-bold text-white hover:bg-neutral-800"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#B84A14]" />
              <span>Journal des messages</span>
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 border border-red-300 bg-white hover:bg-red-50 text-red-700 px-3 py-2 text-xs font-bold transition-colors cursor-pointer"
                title="Quitter la session du studio"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Se déconnecter</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-neutral-300 bg-white p-4">
            <span className="text-xs text-neutral-600 font-bold block mb-1">Montant payé</span>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums">{formatFcfa(paidFcfa)}</div>
            <span className="text-xs text-neutral-600 tabular-nums">soit {formatEur(paidEur)}</span>
          </div>

          <div className="border border-neutral-300 bg-white p-4">
            <span className="text-xs text-neutral-600 font-bold block mb-1">Paiements à vérifier</span>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums">{unpaidBookings.length}</div>
            <span className="text-xs text-neutral-600 tabular-nums">{formatFcfa(unpaidFcfa)} en attente</span>
          </div>

          <div className="border border-neutral-300 bg-white p-4">
            <span className="text-xs text-neutral-600 font-bold block mb-1">Réservations actives</span>
            <div className="text-2xl font-bold text-neutral-900 tabular-nums">{activeBookings.length}</div>
            <span className="text-xs text-neutral-600">
              {presentielCount} en présentiel, {distanceCount} à distance
            </span>
          </div>

          <div className="border border-neutral-300 bg-white p-4">
            <span className="text-xs text-neutral-600 font-bold block mb-1">À confirmer</span>
            <div className="text-2xl font-bold text-[#B84A14] tabular-nums">{toConfirmCount}</div>
            <span className="text-xs text-neutral-600">{confirmedCount} déjà confirmées</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Liste des réservations */}
        <div className="lg:col-span-7 bg-white border border-neutral-300 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-4 pb-4 border-b border-neutral-200">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" aria-hidden="true" />
              <input
                type="text"
                aria-label="Rechercher une réservation"
                placeholder="Nom, boutique, référence ou téléphone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-neutral-300 text-xs focus:border-[#B84A14] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                aria-label="Filtrer par statut"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-neutral-300 bg-white px-2.5 py-2 text-xs font-bold text-neutral-700 focus:outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">À confirmer</option>
                <option value="confirmed">Confirmées</option>
                <option value="completed">Réalisées</option>
                <option value="cancelled">Annulées</option>
              </select>

              <select
                aria-label="Filtrer par mode"
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="border border-neutral-300 bg-white px-2.5 py-2 text-xs font-bold text-neutral-700 focus:outline-none"
              >
                <option value="all">Tous les modes</option>
                <option value="presentiel">Présentiel</option>
                <option value="distance">À distance</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredBookings.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-600">Aucune réservation ne correspond à votre recherche.</div>
            ) : (
              filteredBookings.map((b) => {
                const isSelected = selectedBooking?.id === b.id;
                const isPaid = b.paymentStatus === 'completed';

                return (
                  <div
                    key={b.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedId(b.id);
                      setRegieNoteInput(b.regieNotes || '');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId(b.id);
                        setRegieNoteInput(b.regieNotes || '');
                      }
                    }}
                    className={`border-2 p-3 cursor-pointer transition-all ${
                      isSelected ? 'border-[#B84A14] bg-[#FDF3EC]' : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <span className="font-bold text-xs text-neutral-900 block tabular-nums break-words">
                          {b.reference}, {b.businessName}
                        </span>
                        <span className="text-[11px] text-neutral-600">
                          {b.fullName} ({b.countryCode} {b.phone})
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 border ${
                          b.status === 'confirmed'
                            ? 'border-[#B84A14] bg-[#FDF3EC] text-[#9E3E0F]'
                            : b.status === 'pending'
                              ? 'border-neutral-400 bg-white text-neutral-800'
                              : b.status === 'completed'
                                ? 'border-neutral-500 bg-neutral-100 text-neutral-700'
                                : 'border-red-600 bg-white text-red-800'
                        }`}
                      >
                        {STATUS_LABELS[b.status] ?? b.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs pt-2 border-t border-neutral-100 text-neutral-600">
                      <span className="font-bold text-neutral-800 tabular-nums">
                        {formatDateFr(b.date)} à {b.slotTime} (GMT)
                      </span>
                      <span>{b.mode === 'presentiel' ? 'Studio de Lomé' : `À distance (${b.country})`}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs pt-1 text-neutral-600">
                      <span>
                        {PAYMENT_METHOD_LABELS[b.paymentMethod] ?? b.paymentMethod}
                        {' : '}
                        <span className={isPaid ? 'font-bold text-neutral-900' : 'font-bold text-[#9E3E0F]'}>
                          {PAYMENT_STATUS_LABELS[b.paymentStatus] ?? 'Paiement à vérifier'}
                        </span>
                      </span>
                      <span className="font-bold text-neutral-900 tabular-nums">{formatFcfa(b.totalFcfa)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Détail de la réservation */}
        <div className="lg:col-span-5 bg-white border border-neutral-300 p-4 sm:p-5">
          {selectedBooking ? (
            <div className="space-y-5 text-xs">
              <div className="border-b border-neutral-200 pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-sm text-neutral-900 tabular-nums break-all">Dossier {selectedBooking.reference}</span>
                  <span className="text-[10px] font-bold text-[#9E3E0F] bg-[#FDF3EC] border border-[#B84A14] px-1.5 py-0.5">
                    {selectedBooking.mode === 'presentiel' ? 'Présentiel à Lomé' : 'À distance'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-neutral-900">{selectedBooking.businessName}</h3>
                <p className="text-neutral-600">
                  Responsable : {selectedBooking.fullName}, {selectedBooking.countryCode} {selectedBooking.phone}
                </p>
              </div>

              <div className="border border-neutral-200 bg-white p-3 space-y-2">
                <div className="flex flex-wrap justify-between gap-x-3">
                  <span className="text-neutral-600">Date de passage</span>
                  <strong className="text-neutral-900">{formatDateFr(selectedBooking.date)}</strong>
                </div>
                <div className="flex flex-wrap justify-between gap-x-3">
                  <span className="text-neutral-600">Créneau</span>
                  <strong className="text-neutral-900 tabular-nums">
                    {selectedBooking.slotTime} à {selectedBooking.slotEndTime} (GMT)
                  </strong>
                </div>
                <div className="flex flex-wrap justify-between gap-x-3">
                  <span className="text-neutral-600">Pack</span>
                  <strong className="text-[#9E3E0F]">{PACKS.find((p) => p.id === selectedBooking.packId)?.name ?? selectedBooking.packId}</strong>
                </div>
                <div className="flex flex-wrap justify-between gap-x-3">
                  <span className="text-neutral-600">Numéro affiché à l'écran</span>
                  <strong className="text-neutral-900 tabular-nums">{selectedBooking.onScreenPhone}</strong>
                </div>
              </div>

              {/* Paiement à vérifier */}
              <div className="border border-neutral-200 bg-white p-3 space-y-2">
                <span className="text-neutral-900 font-bold block">Paiement</span>
                <div className="flex flex-wrap justify-between gap-x-3">
                  <span className="text-neutral-600">Mode de paiement</span>
                  <strong className="text-neutral-900">{PAYMENT_METHOD_LABELS[selectedBooking.paymentMethod] ?? selectedBooking.paymentMethod}</strong>
                </div>
                <div className="flex flex-wrap justify-between gap-x-3">
                  <span className="text-neutral-600">Référence</span>
                  <strong className="text-neutral-900 tabular-nums break-all">{selectedBooking.paymentReference || 'Non renseignée'}</strong>
                </div>
                <div className="flex flex-wrap justify-between gap-x-3">
                  <span className="text-neutral-600">Montant</span>
                  <strong className="text-neutral-900 tabular-nums">{formatFcfa(selectedBooking.totalFcfa)}</strong>
                </div>
                <div className="flex flex-wrap justify-between gap-x-3">
                  <span className="text-neutral-600">État</span>
                  <strong className={selectedBooking.paymentStatus === 'completed' ? 'text-neutral-900' : 'text-[#9E3E0F]'}>
                    {selectedBooking.paymentStatus === 'completed' ? 'Payé' : (PAYMENT_STATUS_LABELS[selectedBooking.paymentStatus] ?? 'À vérifier')}
                  </strong>
                </div>
                {selectedBooking.paymentStatus !== 'completed' && (
                  <p className="text-neutral-600">Vérifiez la référence sur le compte Mobile Money du studio avant de confirmer.</p>
                )}
              </div>

              <div>
                <span className="text-neutral-900 font-bold block mb-1">Produits présentés</span>
                <div className="border border-neutral-200 bg-white p-2.5 text-neutral-800 leading-relaxed">{selectedBooking.productsDescription}</div>
              </div>

              <div>
                <span className="text-neutral-900 font-bold block mb-2">Changer le statut</span>
                <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(selectedBooking.id, 'confirmed')}
                    className={`${statusButtonBase} ${selectedBooking.status === 'confirmed' ? 'border-[#B84A14] bg-[#B84A14] text-white' : statusButtonIdle}`}
                  >
                    Confirmer
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateStatus(selectedBooking.id, 'completed')}
                    className={`${statusButtonBase} ${
                      selectedBooking.status === 'completed' ? 'border-neutral-800 bg-neutral-800 text-white' : statusButtonIdle
                    }`}
                  >
                    Marquer comme réalisé
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateStatus(selectedBooking.id, 'pending')}
                    className={`${statusButtonBase} ${
                      selectedBooking.status === 'pending' ? 'border-neutral-800 bg-neutral-800 text-white' : statusButtonIdle
                    }`}
                  >
                    Remettre en attente
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateStatus(selectedBooking.id, 'cancelled')}
                    className={`${statusButtonBase} ${
                      selectedBooking.status === 'cancelled' ? 'border-red-600 bg-red-600 text-white' : 'border-red-300 bg-white text-red-700 hover:bg-red-50'
                    }`}
                  >
                    Annuler
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="studio-notes" className="text-neutral-900 font-bold block mb-1">
                  Notes internes du studio
                </label>
                <textarea
                  id="studio-notes"
                  rows={2}
                  value={regieNoteInput}
                  onChange={(e) => setRegieNoteInput(e.target.value)}
                  placeholder="Exemple : échantillons reçus, liaison WhatsApp testée."
                  className="w-full p-2 border border-neutral-300 text-xs focus:border-[#B84A14] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="mt-1 border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-neutral-800"
                >
                  Enregistrer les notes
                </button>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onOpenPassageSheet(selectedBooking)}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-neutral-300 bg-white py-2 font-bold text-neutral-800 hover:bg-neutral-100"
                >
                  <Printer className="w-3.5 h-3.5 text-[#B84A14]" />
                  <span>Fiche de passage</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-neutral-600">Choisissez une réservation dans la liste pour voir son détail.</div>
          )}
        </div>
      </div>
    </div>
  );
};
