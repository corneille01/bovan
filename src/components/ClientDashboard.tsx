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
  ShieldCheck, 
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
  KeyRound
} from 'lucide-react';
import { UserAccount, Booking, ActivitySector } from '../types';
import { SECTORS, COUNTRY_CODES } from '../data/sectors';
import { ALL_COUNTRIES } from '../data/countries';
import { formatFcfa, formatDateFr } from '../utils/formatters';
import { updateUserProfileOnApi } from '../utils/api';

interface ClientDashboardProps {
  currentUser: UserAccount;
  allBookings: Booking[];
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  onBookNewSlot: (userData: UserAccount) => void;
  onOpenPassageSheet: (booking: Booking) => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  currentUser,
  allBookings,
  onLogin,
  onLogout,
  onBookNewSlot,
  onOpenPassageSheet
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [profileForm, setProfileForm] = useState<UserAccount>(currentUser);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const userBookings = allBookings.filter(b => 
    currentUser.bookingIds?.includes(b.id) ||
    (b.email && b.email.toLowerCase() === currentUser.email.toLowerCase()) ||
    (b.phone === currentUser.phone && b.countryCode === currentUser.countryCode)
  );

  const totalBookings = userBookings.length;
  const totalSpentFcfa = userBookings.reduce((sum, b) => sum + (b.totalFcfa || 0), 0);
  
  const upcomingBookings = userBookings
    .filter(b => new Date(b.date).getTime() >= new Date().setHours(0,0,0,0))
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextBooking = upcomingBookings[0] || userBookings[0] || null;

  const sectorObj = SECTORS.find(s => s.id === currentUser.sector);
  const sectorLabel = sectorObj ? sectorObj.label : currentUser.sector;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    setSaveSuccessMsg('');

    try {
      const updated: UserAccount = {
        ...currentUser,
        ...profileForm,
        password: newPassword.trim() ? newPassword.trim() : currentUser.password,
        lastLoginAt: new Date().toISOString()
      };

      await updateUserProfileOnApi(currentUser.email || currentUser.phone, updated);
      onLogin(updated);
      setSaveSuccessMsg('Vos coordonnées et vos paramètres de sécurité ont été sauvegardés.');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
      setIsEditing(false);
      setIsChangingPassword(false);
      setNewPassword('');
    } catch (err: any) {
      setErrorMsg('Erreur lors de la sauvegarde : ' + (err.message || 'Problème réseau'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* HEADER BANNER */}
      <div className="bg-white border-2 border-neutral-900 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 border-b border-neutral-300 gap-4">
          <div className="flex items-start gap-3.5">
            <div className="border border-[#B84A14] bg-[#FDF3EC] p-3 text-[#B84A14] shrink-0">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-[#B84A14] text-white">
                  Commerçant Vérifié
                </span>
                <span className="text-xs text-neutral-800 font-bold flex items-center gap-1 border border-neutral-300 bg-white px-2 py-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B84A14]" /> Données Sécurisées
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                {currentUser.fullName}
              </h1>
              <p className="text-xs font-bold text-[#B84A14] uppercase tracking-wider mt-0.5">
                Boutique : {currentUser.businessName}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onBookNewSlot(currentUser)}
              className="flex items-center gap-2 border border-[#B84A14] bg-[#B84A14] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9E3E0F] cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Nouveau créneau live</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 border border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors"
              title="Se déconnecter et retourner à l'accueil"
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
              <span className="text-[11px] font-bold uppercase tracking-wider">Lives réservés</span>
              <Video className="w-4 h-4 text-[#B84A14]" />
            </div>
            <p className="text-2xl font-mono font-black text-neutral-900">
              {totalBookings}
            </p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Diffusions au total</p>
          </div>

          <div className="border border-neutral-300 bg-white p-4">
            <div className="flex items-center justify-between text-neutral-600 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total investi</span>
              <CreditCard className="w-4 h-4 text-[#B84A14]" />
            </div>
            <p className="text-2xl font-mono font-black text-[#B84A14]">
              {formatFcfa(totalSpentFcfa)}
            </p>
            <p className="text-[10px] text-neutral-500 mt-0.5">Budget engagé</p>
          </div>

          <div className="border border-neutral-300 bg-white p-4 sm:col-span-2">
            <div className="flex items-center justify-between text-neutral-600 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Prochain direct</span>
              <Clock className="w-4 h-4 text-[#B84A14]" />
            </div>
            {nextBooking ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-black text-neutral-900 capitalize">
                    {formatDateFr(nextBooking.date)} à {nextBooking.slotTime} GMT
                  </p>
                  <p className="text-xs text-neutral-600">
                    Ref: <span className="font-mono font-bold text-neutral-900 break-all">{nextBooking.reference}</span> - {nextBooking.mode === 'presentiel' ? 'Studio Lomé' : 'À Distance'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenPassageSheet(nextBooking)}
                  className="inline-flex items-center gap-1 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 text-xs font-bold uppercase cursor-pointer shrink-0"
                >
                  <Printer className="w-3.5 h-3.5 text-[#D96528]" />
                  <span>Fiche Régie</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-neutral-500">Aucun live à venir.</p>
            )}
          </div>
        </div>
      </div>

      {/* INFORMATIONS PERSONNELLES ET SÉCURITÉ */}
      <div className="bg-white border-2 border-neutral-800 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-300 gap-2">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#B84A14]" />
            <h2 className="text-base sm:text-lg font-black text-neutral-900 uppercase tracking-tight">
              Vos informations de compte
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsChangingPassword(!isChangingPassword);
              }}
              className="inline-flex items-center gap-1.5 border border-neutral-800 bg-white hover:bg-neutral-100 text-neutral-900 px-3 py-2 text-xs font-bold uppercase cursor-pointer transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-[#B84A14]" />
              <span>{isChangingPassword ? 'Fermer mot de passe' : 'Mot de passe'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsEditing(!isEditing);
                setProfileForm(currentUser);
                setSaveSuccessMsg('');
                setErrorMsg('');
              }}
              className="inline-flex items-center gap-1.5 border border-neutral-800 bg-white hover:bg-neutral-100 text-neutral-900 px-3.5 py-2 text-xs font-bold uppercase cursor-pointer transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#B84A14]" />
              <span>{isEditing ? 'Fermer profil' : 'Modifier mes informations'}</span>
            </button>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
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
          <form onSubmit={handleSaveProfile} className="border-2 border-[#B84A14] bg-white p-4 space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-neutral-900 border-b border-neutral-200 pb-2">
              <KeyRound className="w-4 h-4 text-[#B84A14]" />
              <span>Définir ou modifier votre mot de passe confidentiel</span>
            </div>
            <p className="text-neutral-600">
              Protection supplémentaire de vos données sensibles. Vous pourrez vous connecter indifféremment par mot de passe ou par code à 6 chiffres.
            </p>
            <div>
              <label className="block font-bold text-neutral-800 mb-1" htmlFor="newPassInput">
                Nouveau mot de passe secret :
              </label>
              <input
                id="newPassInput"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Entrez votre nouveau mot de passe"
                className="w-full sm:w-80 p-2.5 border border-neutral-300 font-medium text-neutral-900 focus:border-[#B84A14] focus:outline-none"
                required
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="border border-neutral-300 bg-white px-3 py-1.5 text-xs font-bold uppercase text-neutral-700 hover:bg-neutral-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="border border-[#B84A14] bg-[#B84A14] text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-[#9E3E0F]"
              >
                Sauvegarder le mot de passe
              </button>
            </div>
          </form>
        )}

        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="border border-neutral-300 bg-white p-4 space-y-1">
              <span className="text-[10px] text-neutral-600 uppercase font-bold flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#B84A14]" /> Responsable
              </span>
              <p className="font-extrabold text-neutral-900 text-sm">
                {currentUser.fullName}
              </p>
            </div>

            <div className="border border-neutral-300 bg-white p-4 space-y-1">
              <span className="text-[10px] text-neutral-600 uppercase font-bold flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#B84A14]" /> Boutique / Marque
              </span>
              <p className="font-extrabold text-neutral-900 text-sm">
                {currentUser.businessName}
              </p>
            </div>

            <div className="border border-neutral-300 bg-white p-4 space-y-1">
              <span className="text-[10px] text-neutral-600 uppercase font-bold flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#B84A14]" /> Adresse E-mail
              </span>
              <p className="font-mono font-bold text-neutral-900 text-xs break-all">
                {currentUser.email}
              </p>
            </div>

            <div className="border border-neutral-300 bg-white p-4 space-y-1">
              <span className="text-[10px] text-neutral-600 uppercase font-bold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#B84A14]" /> Numéro WhatsApp
              </span>
              <p className="font-mono font-bold text-neutral-900 text-sm">
                {currentUser.countryCode} {currentUser.phone}
              </p>
            </div>

            <div className="border border-[#B84A14] bg-[#FDF3EC] p-4 space-y-1">
              <span className="text-[10px] text-[#B84A14] uppercase font-bold flex items-center gap-1">
                <Tv className="w-3.5 h-3.5 text-[#B84A14]" /> Numéro incrusté à l'écran
              </span>
              <p className="font-mono font-black text-[#B84A14] text-base break-all">
                {currentUser.onScreenPhone || `${currentUser.countryCode} ${currentUser.phone}`}
              </p>
            </div>

            <div className="border border-neutral-300 bg-white p-4 space-y-1">
              <span className="text-[10px] text-neutral-600 uppercase font-bold flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#B84A14]" /> Secteur & Pays
              </span>
              <p className="font-extrabold text-neutral-900 text-xs">
                {sectorLabel}
              </p>
              <p className="text-neutral-600 text-[11px] flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-neutral-500" /> Pays : {currentUser.country || 'Togo'}
              </p>
            </div>
          </div>
        ) : (
          /* FORMULAIRE D'ÉDITION DIRECTE */
          <form onSubmit={handleSaveProfile} className="border-2 border-[#B84A14] bg-white p-4 sm:p-5 space-y-4">
            <div className="border-b border-neutral-300 pb-2 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                <Save className="w-4 h-4 text-[#B84A14]" />
                <span>Modification de vos coordonnées</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="dashEditFullName">
                  Nom & Prénom du Responsable :
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
                  Nom de la Boutique / Marque :
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
                  Adresse E-mail :
                </label>
                <input
                  id="dashEditEmail"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 bg-white font-mono text-neutral-900 focus:outline-none focus:border-[#B84A14]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="dashEditPhone">
                  Téléphone WhatsApp :
                </label>
                <div className="flex gap-1.5">
                  <select
                    value={profileForm.countryCode}
                    onChange={(e) => setProfileForm({ ...profileForm, countryCode: e.target.value })}
                    className="p-2 border border-neutral-300 bg-white font-mono text-xs font-bold"
                  >
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
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="flex-1 p-2.5 border border-neutral-300 bg-white font-mono text-neutral-900 focus:outline-none focus:border-[#B84A14]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="dashEditScreenPhone">
                  Numéro incrusté à l'écran :
                </label>
                <input
                  id="dashEditScreenPhone"
                  type="text"
                  value={profileForm.onScreenPhone}
                  onChange={(e) => setProfileForm({ ...profileForm, onScreenPhone: e.target.value })}
                  placeholder="Ex: +228 90 12 34 56"
                  className="w-full p-2.5 border border-neutral-300 bg-white font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#B84A14]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1" htmlFor="dashEditSector">
                  Secteur d'activité :
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
                  Pays :
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

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-300">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="border border-neutral-300 bg-white px-4 py-2 text-xs font-bold uppercase text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 border border-[#B84A14] bg-[#B84A14] hover:bg-[#9E3E0F] text-white px-5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
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
        <div className="flex items-center justify-between pb-3 border-b border-neutral-300 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#B84A14]" />
            <h2 className="text-base sm:text-lg font-black text-neutral-900 uppercase tracking-tight">
              Vos Réservations Studio ({userBookings.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onBookNewSlot(currentUser)}
            className="border border-[#B84A14] bg-[#FDF3EC] hover:bg-[#B84A14] text-[#B84A14] hover:text-white px-3 py-1.5 text-xs font-bold uppercase transition-colors shrink-0"
          >
            + Réserver un live
          </button>
        </div>

        {userBookings.length === 0 ? (
          <div className="border border-neutral-300 bg-white p-8 text-center text-xs text-neutral-600 space-y-3">
            <Calendar className="w-10 h-10 text-neutral-400 mx-auto" />
            <p className="font-bold text-neutral-900 text-sm">
              Aucune réservation de live enregistrée.
            </p>
            <p className="max-w-md mx-auto text-neutral-500">
              Réservez votre créneau au Studio OCD Live pour présenter vos produits en direct sur TikTok et Facebook.
            </p>
            <button
              type="button"
              onClick={() => onBookNewSlot(currentUser)}
              className="inline-flex items-center gap-2 border border-neutral-900 bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4 text-[#D96528]" />
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
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-neutral-900 text-sm bg-white border border-neutral-300 px-2 py-0.5 break-all">
                      {b.reference}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 border border-emerald-600 bg-emerald-50 text-emerald-800">
                      Confirmé
                    </span>
                    <span className="text-[10px] bg-neutral-100 border border-neutral-300 text-neutral-800 px-2 py-0.5 font-bold uppercase">
                      {b.mode === 'presentiel' ? 'Studio Lomé' : 'À Distance'}
                    </span>
                  </div>

                  <p className="font-extrabold text-neutral-900 text-sm capitalize">
                    {formatDateFr(b.date)} - De {b.slotTime} à {b.slotEndTime} GMT (Lomé)
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-neutral-600 text-[11px]">
                    <span>Montant : <strong className="text-neutral-900 font-mono">{formatFcfa(b.totalFcfa)}</strong></span>
                    <span>- Numéro Écran : <strong className="text-[#B84A14] font-mono font-bold break-all">{b.onScreenPhone}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenPassageSheet(b)}
                    className="flex items-center gap-1.5 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-2 text-xs font-bold uppercase cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#D96528]" />
                    <span>Fiche régie</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
