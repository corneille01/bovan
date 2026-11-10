import React, { useState } from 'react';
import {
  User,
  Building,
  Mail,
  Phone,
  Tv,
  Tag,
  Globe,
  Calendar,
  CheckCircle2,
  Plus,
  Printer,
  Edit3,
  Save,
  LogOut,
  Clock,
  CreditCard,
  AlertCircle,
  Video,
  Lock,
  KeyRound,
} from 'lucide-react';
import { UserAccount, Booking, ActivitySector } from '../types';
import { SECTORS, COUNTRY_CODES } from '../data/sectors';
import { ALL_COUNTRIES } from '../data/countries';
import { formatFcfa, formatDateFr } from '../utils/formatters';
import { api, ApiError } from '../utils/api';

interface ClientDashboardProps {
  currentUser: UserAccount;
  allBookings: Booking[];
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  onBookNewSlot: (userData: UserAccount) => void;
  onOpenPassageSheet: (booking: Booking) => void;
  onCancelBooking: (id: string) => Promise<string | null>;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  currentUser,
  allBookings,
  onLogin,
  onLogout,
  onBookNewSlot,
  onOpenPassageSheet,
  onCancelBooking,
}) => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [cancellingId, setCancellingId] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [profileForm, setProfileForm] = useState<UserAccount>(currentUser);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const userBookings = allBookings;

  const totalBookings = userBookings.length;
  const totalSpentFcfa = userBookings.filter((b) => b.status !== 'cancelled').reduce((sum, b) => sum + (b.totalFcfa || 0), 0);

  const upcomingBookings = userBookings
    .filter((b) => new Date(b.date).getTime() >= new Date().setHours(0, 0, 0, 0))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextBooking = upcomingBookings[0] || userBookings[0] || null;

  const bookingStatusLabel = (b: Booking): string =>
    b.status === 'cancelled'
      ? 'Annulée'
      : b.status === 'completed'
        ? 'Live réalisé'
        : b.status === 'confirmed' && b.paymentStatus === 'completed'
          ? 'Confirmée'
          : b.paymentStatus === 'failed'
            ? 'Paiement refusé'
            : 'En attente de validation';

  const sectorObj = SECTORS.find((s) => s.id === currentUser.sector);
  const sectorLabel = sectorObj ? sectorObj.label : currentUser.sector;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSaveSuccessMsg('');
    try {
      const { user } = await api.updateMe({
        fullName: profileForm.fullName,
        businessName: profileForm.businessName,
        onScreenPhone: profileForm.onScreenPhone,
        country: profileForm.country,
        sector: profileForm.sector,
      });
      onLogin(user);
      setProfileForm(user);
      setSaveSuccessMsg('Vos informations sont enregistrées.');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
      setIsEditing(false);
    } catch (err) {
      setErrorMsg(err instanceof ApiError ? err.message : 'Enregistrement impossible. Réessayez.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSaveSuccessMsg('');
    try {
      await api.changePassword(currentPassword, newPassword);
      setSaveSuccessMsg('Votre mot de passe est modifié.');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setErrorMsg(err instanceof ApiError ? err.message : 'Modification impossible. Réessayez.');
    } finally {
      setIsSaving(false);
    }
  };

  const canCancel = (b: Booking) =>
    (b.status === 'pending' || b.status === 'confirmed') && new Date(`${b.date}T${b.slotTime}:00Z`).getTime() - Date.now() > 72 * 3600 * 1000;

  const handleCancel = async (b: Booking) => {
    if (!window.confirm(`Annuler la réservation ${b.reference} ?`)) return;
    setCancellingId(b.id);
    setErrorMsg('');
    const message = await onCancelBooking(b.id);
    setCancellingId('');
    if (message) setErrorMsg(message);
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0">
      {/* HEADER BANNER */}
      <div className="bg-white border-2 border-neutral-900 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-neutral-300 gap-4">
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="border border-[#B84A14] bg-[#FDF3EC] p-3 text-[#B84A14] shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 break-words">{currentUser.fullName}</h1>
              <p className="text-xs font-bold text-[#B84A14] mt-0.5 break-words">Boutique : {currentUser.businessName}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:shrink-0">
            <button
              type="button"
              onClick={() => onBookNewSlot(currentUser)}
              className="flex items-center gap-2 border border-[#B84A14] bg-[#B84A14] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#9E3E0F] cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Réserver un live</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 border border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-900 px-4 py-2.5 text-xs font-bold cursor-pointer transition-colors"
              title="Quitter mon espace"
            >
              <LogOut className="w-4 h-4 text-neutral-800" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* SUMMARY METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="border border-neutral-300 bg-white p-4">
            <div className="flex items-center justify-between text-neutral-600 mb-1">
              <span className="text-[11px] font-bold ">Lives réservés</span>
              <Video className="w-4 h-4 text-[#B84A14]" />
            </div>
            <p className="text-2xl tabular-nums font-bold text-neutral-900">{totalBookings}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Au total</p>
          </div>

          <div className="border border-neutral-300 bg-white p-4">
            <div className="flex items-center justify-between text-neutral-600 mb-1">
              <span className="text-[11px] font-bold ">Total payé</span>
              <CreditCard className="w-4 h-4 text-[#B84A14]" />
            </div>
            <p className="text-2xl tabular-nums font-bold text-[#B84A14]">{formatFcfa(totalSpentFcfa)}</p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Montant de vos réservations</p>
          </div>

          <div className="border border-neutral-300 bg-white p-4 sm:col-span-2">
            <div className="flex items-center justify-between text-neutral-600 mb-1">
              <span className="text-[11px] font-bold ">Prochain live</span>
              <Clock className="w-4 h-4 text-[#B84A14]" />
            </div>
            {nextBooking ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-neutral-900 capitalize">
                    {formatDateFr(nextBooking.date)} à {nextBooking.slotTime} GMT
                  </p>
                  <p className="text-xs text-neutral-600">
                    Référence <span className="tabular-nums font-bold text-neutral-900 break-all">{nextBooking.reference}</span>,{' '}
                    {nextBooking.mode === 'presentiel' ? 'au studio de Lomé' : 'à distance'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenPassageSheet(nextBooking)}
                  className="inline-flex items-center gap-1 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 text-xs font-bold cursor-pointer shrink-0 self-start"
                >
                  <Printer className="w-3.5 h-3.5 text-white" />
                  <span>Fiche de passage</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-neutral-500">Aucun live prévu.</p>
            )}
          </div>
        </div>
      </div>

      {/* INFORMATIONS PERSONNELLES ET SÉCURITÉ */}
      <div className="bg-white border-2 border-neutral-800 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-300 gap-2">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#B84A14]" />
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 ">Vos informations</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsChangingPassword(!isChangingPassword);
              }}
              className="inline-flex items-center gap-1.5 border border-neutral-800 bg-white hover:bg-neutral-100 text-neutral-900 px-3 py-2 text-xs font-bold cursor-pointer transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-[#B84A14]" />
              <span>{isChangingPassword ? 'Fermer' : 'Mot de passe'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEditing(!isEditing);
                setProfileForm(currentUser);
                setSaveSuccessMsg('');
                setErrorMsg('');
              }}
              className="inline-flex items-center gap-1.5 border border-neutral-800 bg-white hover:bg-neutral-100 text-neutral-900 px-3.5 py-2 text-xs font-bold cursor-pointer transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#B84A14]" />
              <span>{isEditing ? 'Fermer' : 'Modifier mes informations'}</span>
            </button>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="p-3 bg-[#FDF3EC] border border-[#B84A14] text-[#9E3E0F] text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#B84A14] shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* PASSWORD DEFINITION BOX */}
        {isChangingPassword && (
          <form onSubmit={handleChangePassword} className="border-2 border-[#B84A14] bg-white p-4 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-neutral-900 border-b border-neutral-200 pb-2">
              <KeyRound className="w-4 h-4 text-[#B84A14]" />
              <span>Votre mot de passe</span>
            </div>
            <p className="text-neutral-600">
              Saisissez l'actuel, puis le nouveau (8 caractères minimum). Chaque connexion demande aussi un code reçu par e-mail, SMS ou WhatsApp.
            </p>
            <div>
              <label className="block font-bold text-neutral-800 mb-1" htmlFor="curPassInput">
                Mot de passe actuel
              </label>
              <input
                id="curPassInput"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full max-w-full sm:w-80 p-2.5 border border-neutral-300 font-medium text-neutral-900 focus:border-[#B84A14] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-800 mb-1" htmlFor="newPassInput">
                Nouveau mot de passe
              </label>
              <input
                id="newPassInput"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                className="w-full max-w-full sm:w-80 p-2.5 border border-neutral-300 font-medium text-neutral-900 focus:border-[#B84A14] focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="border border-[#B84A14] bg-[#B84A14] text-white px-4 py-1.5 text-xs font-bold hover:bg-[#9E3E0F]"
              >
                Changer le mot de passe
              </button>
            </div>
          </form>
        )}

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="border border-neutral-300 bg-white p-4 space-y-1">
              <span className="text-[10px] text-neutral-600 font-bold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#B84A14]" /> Responsable
              </span>
              <p className="font-bold text-neutral-900 text-sm">{currentUser.fullName}</p>
            </div>

            <div className="border border-neutral-300 bg-white p-4 space-y-1">
              <span className="text-[10px] text-neutral-600 font-bold flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#B84A14]" /> Boutique ou marque
              </span>
              <p className="font-bold text-neutral-900 text-sm">{currentUser.businessName}</p>
            </div>

            <div className="border border-neutral-300 bg-white p-4 space-y-1">
              <span className="text-[10px] text-neutral-600 font-bold flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#B84A14]" /> Adresse e-mail
              </span>
              <p className="tabular-nums font-bold text-neutral-900 text-xs break-all">{currentUser.email}</p>
            </div>

            <div className="border border-neutral-300 bg-white p-4 space-y-1">
              <span className="text-[10px] text-neutral-600 font-bold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#B84A14]" /> Numéro WhatsApp
              </span>
              <p className="tabular-nums font-bold text-neutral-900 text-sm">
                {currentUser.countryCode} {currentUser.phone}
              </p>
            </div>

            <div className="border border-[#B84A14] bg-[#FDF3EC] p-4 space-y-1">
              <span className="text-[10px] text-[#B84A14] font-bold flex items-center gap-1">
                <Tv className="w-3.5 h-3.5 text-[#B84A14]" /> Numéro affiché à l'écran
              </span>
              <p className="tabular-nums font-bold text-[#B84A14] text-base break-all">
                {currentUser.onScreenPhone || `${currentUser.countryCode} ${currentUser.phone}`}
              </p>
            </div>

            <div className="border border-neutral-300 bg-white p-4 space-y-1">
              <span className="text-[10px] text-neutral-600 font-bold flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#B84A14]" /> Secteur et pays
              </span>
              <p className="font-bold text-neutral-900 text-xs">{sectorLabel}</p>
              <p className="text-neutral-600 text-[11px] flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-neutral-500" /> Pays : {currentUser.country || 'Togo'}
              </p>
            </div>
          </div>
        ) : (
          /* FORMULAIRE D'ÉDITION DIRECTE */
          <form onSubmit={handleSaveProfile} className="border-2 border-[#B84A14] bg-white p-4 sm:p-5 space-y-4">
            <div className="border-b border-neutral-300 pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <Save className="w-4 h-4 text-[#B84A14]" />
                <span>Modifier vos informations</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="dashEditFullName">
                  Nom et prénom
                </label>
                <input
                  id="dashEditFullName"
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 bg-white font-medium text-neutral-900 focus:outline-none focus:border-[#B84A14]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="dashEditBusiness">
                  Boutique ou marque
                </label>
                <input
                  id="dashEditBusiness"
                  type="text"
                  value={profileForm.businessName}
                  onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 bg-white font-medium text-neutral-900 focus:outline-none focus:border-[#B84A14]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="dashEditEmail">
                  Adresse e-mail
                </label>
                <input
                  id="dashEditEmail"
                  type="email"
                  value={profileForm.email}
                  readOnly
                  className="w-full p-2.5 border border-neutral-200 bg-neutral-100 tabular-nums text-neutral-600"
                  title="Pour changer d'adresse e-mail, écrivez au studio."
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="dashEditPhone">
                  Téléphone WhatsApp
                </label>
                <div className="flex gap-1.5 min-w-0">
                  <select value={profileForm.countryCode} disabled className="p-2 border border-neutral-200 bg-neutral-100 tabular-nums text-xs font-bold">
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.id || `${c.country}-${c.code}`} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    id="dashEditPhone"
                    type="tel"
                    value={profileForm.phone}
                    readOnly
                    className="flex-1 min-w-0 p-2.5 border border-neutral-200 bg-neutral-100 tabular-nums text-neutral-600"
                    title="Pour changer de numéro, écrivez au studio."
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="dashEditScreenPhone">
                  Numéro affiché à l'écran
                </label>
                <input
                  id="dashEditScreenPhone"
                  type="text"
                  value={profileForm.onScreenPhone}
                  onChange={(e) => setProfileForm({ ...profileForm, onScreenPhone: e.target.value })}
                  placeholder="Ex: +228 90 12 34 56"
                  className="w-full p-2.5 border border-neutral-300 bg-white tabular-nums font-bold text-neutral-900 focus:outline-none focus:border-[#B84A14]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="dashEditSector">
                  Secteur d'activité
                </label>
                <select
                  id="dashEditSector"
                  value={profileForm.sector}
                  onChange={(e) => setProfileForm({ ...profileForm, sector: e.target.value as ActivitySector })}
                  className="w-full p-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-[#B84A14]"
                >
                  {SECTORS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="dashEditCountry">
                  Pays
                </label>
                <select
                  id="dashEditCountry"
                  value={profileForm.country}
                  onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 bg-white text-neutral-900 focus:outline-none focus:border-[#B84A14]"
                >
                  {ALL_COUNTRIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-neutral-300">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 border border-[#B84A14] bg-[#B84A14] hover:bg-[#9E3E0F] text-white px-5 py-2 text-xs font-bold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* HISTORIQUE DE TOUTES LES RÉSERVATIONS */}
      <div className="bg-white border-2 border-neutral-800 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-300 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#B84A14]" />
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 ">Vos réservations ({userBookings.length})</h2>
          </div>
          <button
            type="button"
            onClick={() => onBookNewSlot(currentUser)}
            className="border border-[#B84A14] bg-[#FDF3EC] hover:bg-[#B84A14] text-[#B84A14] hover:text-white px-3 py-1.5 text-xs font-bold transition-colors shrink-0"
          >
            Réserver un live
          </button>
        </div>

        {userBookings.length === 0 ? (
          <div className="border border-neutral-300 bg-white p-8 text-center text-xs text-neutral-600 space-y-3">
            <Calendar className="w-10 h-10 text-neutral-400 mx-auto" />
            <p className="font-bold text-neutral-900 text-sm">Vous n'avez pas encore de réservation.</p>
            <p className="max-w-md mx-auto text-neutral-500">Réservez un créneau au studio pour présenter vos produits en direct sur TikTok et Facebook.</p>
            <button
              type="button"
              onClick={() => onBookNewSlot(currentUser)}
              className="inline-flex items-center gap-2 border border-neutral-900 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 text-xs font-bold cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Réserver mon premier créneau</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {userBookings.map((b) => (
              <div
                key={b.id}
                className="border border-neutral-300 bg-white p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="tabular-nums font-bold text-neutral-900 text-sm bg-white border border-neutral-300 px-2 py-0.5 break-all">
                      {b.reference}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 border border-neutral-400 bg-white text-neutral-800">{bookingStatusLabel(b)}</span>
                    <span className="text-[10px] bg-white border border-neutral-300 text-neutral-800 px-2 py-0.5 font-bold">
                      {b.mode === 'presentiel' ? 'Au studio' : 'À distance'}
                    </span>
                  </div>

                  <p className="font-bold text-neutral-900 text-sm capitalize">
                    {formatDateFr(b.date)}, de {b.slotTime} à {b.slotEndTime} GMT (Lomé)
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-neutral-600 text-[11px]">
                    <span>
                      Montant : <strong className="text-neutral-900 tabular-nums">{formatFcfa(b.totalFcfa)}</strong>
                    </span>
                    <span>
                      Numéro à l'écran : <strong className="text-[#B84A14] tabular-nums font-bold break-all">{b.onScreenPhone}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenPassageSheet(b)}
                    className="flex items-center gap-1.5 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 text-xs font-bold cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-white" />
                    <span>Fiche de passage</span>
                  </button>
                  {canCancel(b) && (
                    <button
                      type="button"
                      disabled={cancellingId === b.id}
                      onClick={() => handleCancel(b)}
                      className="border border-neutral-400 bg-white hover:bg-neutral-100 text-neutral-900 px-3.5 py-2 text-xs font-bold cursor-pointer"
                    >
                      {cancellingId === b.id ? 'Annulation' : 'Annuler'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
