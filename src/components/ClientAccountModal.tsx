import React, { useState } from 'react';
import { User, KeyRound, LogOut, Calendar, Plus, Printer, CheckCircle2, AlertCircle, Save, ShieldCheck, Lock, HelpCircle, UserPlus } from 'lucide-react';
import { UserAccount, Booking } from '../types';
import { formatDateFr, formatFcfa } from '../utils/formatters';
import { sendAuthCodeViaApi, verifyAuthCodeViaApi, updateUserProfileOnApi } from '../utils/api';

interface ClientAccountModalProps {
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  allAccounts: UserAccount[];
  allBookings: Booking[];
  onBookNewSlot: (userData: UserAccount) => void;
  onOpenPassageSheet: (booking: Booking) => void;
  onClose: () => void;
}

export const ClientAccountModal: React.FC<ClientAccountModalProps> = ({
  currentUser,
  onLogin,
  onLogout,
  allAccounts,
  allBookings,
  onBookNewSlot,
  onOpenPassageSheet,
  onClose
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recovery'>('login');
  const [step, setStep] = useState<'credentials' | 'verify_otp'>('credentials');
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  // Registration Form States
  const [regFullName, setRegFullName] = useState<string>('');
  const [regBusinessName, setRegBusinessName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');

  const [pendingUser, setPendingUser] = useState<UserAccount | null>(null);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState<boolean>(false);

  // Handle New Merchant Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regBusinessName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMsg('Veuillez remplir l’ensemble des champs obligatoires.');
      return;
    }

    setErrorMsg('');
    setIsSendingCode(true);

    const newUser: UserAccount = {
      phone: regPhone.trim(),
      countryCode: '+228',
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      businessName: regBusinessName.trim(),
      sector: 'mode_textile',
      onScreenPhone: regPhone.trim(),
      country: 'Togo',
      password: regPassword.trim(),
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      bookingIds: []
    };

    setPendingUser(newUser);
    setIdentifier(regEmail.trim());

    try {
      const res = await sendAuthCodeViaApi(regEmail.trim());
      if (res.simulatedCode) {
        setGeneratedOtp(res.simulatedCode);
      }
      setStep('verify_otp');
      setSuccessMsg('Compte créé ! Un code à 6 chiffres a été transmis par SMS/Email.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de l’envoi du code de création.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Step 1: Validate Identifiant + Password, then send 6-digit 2FA code
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    const cleanIdLower = cleanId.toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId || cleanId.length < 3) {
      setErrorMsg('Veuillez saisir votre e-mail ou votre numéro WhatsApp.');
      return;
    }

    if (!cleanPass) {
      setErrorMsg('Veuillez saisir votre mot de passe.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');

    // Search existing account
    const found = allAccounts.find(a => 
      (a.email && a.email.toLowerCase() === cleanIdLower) || 
      (a.phone && a.phone.includes(cleanId)) ||
      (a.countryCode && (a.countryCode + a.phone).includes(cleanId))
    );

    if (found) {
      const expectedPassword = found.password || found.businessName;
      if (expectedPassword && expectedPassword !== cleanPass) {
        setErrorMsg('Mot de passe incorrect. Vous pouvez réinitialiser ou récupérer votre accès ci-dessous.');
        return;
      }
      setPendingUser(found);
    } else {
      setPendingUser(null);
    }

    setIsSendingCode(true);

    try {
      const res = await sendAuthCodeViaApi(cleanId);
      if (res.simulatedCode) {
        setGeneratedOtp(res.simulatedCode);
      }
      setStep('verify_otp');
      setSuccessMsg('Un code à 6 chiffres a été généré et envoyé par e-mail / WhatsApp.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Impossible d’envoyer le code de vérification.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Step 2: Verify 6-digit 2FA code
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = enteredOtp.trim();
    if (!cleanCode || cleanCode.length < 6) {
      setErrorMsg('Veuillez saisir le code à 6 chiffres reçu.');
      return;
    }

    setIsVerifyingCode(true);
    setErrorMsg('');

    try {
      const res = await verifyAuthCodeViaApi(identifier, cleanCode);
      if (res.success) {
        const userToLogin = pendingUser || res.user;
        if (userToLogin) {
          onLogin(userToLogin);
          setErrorMsg('');
          onClose();
        } else {
          setErrorMsg('Compte introuvable après vérification du code.');
        }
      } else {
        setErrorMsg(res.error || 'Code erroné ou expiré. Veuillez réessayer.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la vérification du code.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Recovery flow: Request 2FA code directly
  const handleRecoveryRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = identifier.trim();
    if (!clean || clean.length < 3) {
      setErrorMsg('Veuillez saisir votre e-mail ou votre numéro de téléphone.');
      return;
    }

    setIsSendingCode(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await sendAuthCodeViaApi(clean);
      if (res.simulatedCode) {
        setGeneratedOtp(res.simulatedCode);
      }
      const found = allAccounts.find(a => 
        (a.email && a.email.toLowerCase() === clean.toLowerCase()) || 
        (a.phone && a.phone.includes(clean)) ||
        (a.countryCode && (a.countryCode + a.phone).includes(clean))
      );
      if (found) {
        setPendingUser(found);
      }
      setStep('verify_otp');
    } catch (err: any) {
      setErrorMsg(err.message || 'Impossible d’envoyer le code de récupération.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const userBookings = currentUser
    ? allBookings.filter(b => 
        currentUser.bookingIds?.includes(b.id) ||
        (b.email && b.email.toLowerCase() === currentUser.email.toLowerCase()) ||
        (b.phone === currentUser.phone && b.countryCode === currentUser.countryCode)
      )
    : [];

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-3 sm:p-4 pt-10 sm:pt-16 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-2 border-neutral-900 w-full max-w-xl mb-12 p-4 sm:p-6 shadow-2xl relative"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-300 mb-6 gap-2">
          <div className="flex items-center gap-3">
            <div className="border border-[#B84A14] bg-[#FDF3EC] p-2 text-[#B84A14] shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-neutral-900 uppercase tracking-tight">
                Espace Commerçant Studio OCD Live
              </h2>
              <p className="text-xs text-neutral-600">
                Connexion sécurisée en 2 étapes pour vos réservations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="border-2 border-neutral-800 bg-white hover:bg-neutral-100 px-3 py-1.5 text-xs font-bold uppercase text-neutral-900 cursor-pointer transition-colors"
          >
            ✕ Fermer
          </button>
        </div>

        {/* NOT LOGGED IN FORMS */}
        {!currentUser ? (
          <div className="space-y-4">
            {/* Header description */}
            <div className="border border-neutral-300 bg-[#FDF3EC] p-3 text-xs text-neutral-800 space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#B84A14]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Authentification obligatoire en 2 étapes</span>
              </div>
              <p className="text-neutral-700">
                Saisissez vos identifiants puis validez le code à 6 chiffres envoyé par SMS ou e-mail.
              </p>
            </div>

            {/* LOGIN MODE */}
            {authMode === 'login' && (
              <div>
                {step === 'credentials' ? (
                  <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1" htmlFor="loginIdentifier">
                        E-mail ou numéro WhatsApp :
                      </label>
                      <input
                        id="loginIdentifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Ex: contact@boutique.com ou +228 90 12 34 56"
                        className="w-full p-3 border border-neutral-300 text-sm font-medium text-neutral-900 focus:border-[#B84A14] focus:outline-none"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1" htmlFor="loginPassword">
                        Mot de passe :
                      </label>
                      <input
                        id="loginPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Votre mot de passe secret"
                        className="w-full p-3 border border-neutral-300 text-sm font-medium text-neutral-900 focus:border-[#B84A14] focus:outline-none"
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMsg}</span>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSendingCode}
                      className="w-full flex items-center justify-center gap-2 border border-[#B84A14] bg-[#B84A14] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9E3E0F] cursor-pointer transition-colors"
                    >
                      <KeyRound className="w-4 h-4 text-white" />
                      <span>{isSendingCode ? 'Vérification et envoi...' : 'Étape 1 : Valider les identifiants & recevoir le code 2FA'}</span>
                    </button>

                    <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('register');
                          setStep('credentials');
                          setErrorMsg('');
                        }}
                        className="font-bold text-neutral-900 hover:text-[#B84A14] hover:underline cursor-pointer flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#B84A14] shrink-0" />
                        <span>Pas encore de compte ? Créer un compte</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('recovery');
                          setStep('credentials');
                          setErrorMsg('');
                        }}
                        className="font-bold text-[#B84A14] hover:underline cursor-pointer flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>Identifiants / mot de passe oublié ?</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* STEP 2: 6-DIGIT CODE VERIFICATION */
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                    <div className="border border-neutral-300 bg-white p-3.5 text-xs text-neutral-800">
                      <p className="font-bold text-neutral-900 mb-1">
                        Étape 2 : Code 2FA transmis à {identifier}
                      </p>
                      <p className="text-neutral-600">
                        Veuillez saisir le code temporaire à 6 chiffres transmis par SMS / WhatsApp ou E-mail.
                      </p>
                    </div>

                    {/* Simulated Code Display */}
                    <div className="border border-[#D96528] bg-[#FDF3EC] p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-600 uppercase block font-semibold">Code de sécurité généré :</span>
                        <span className="font-mono font-black text-base text-[#B84A14] tracking-widest">{generatedOtp || '123456'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEnteredOtp(generatedOtp || '123456')}
                        className="border border-[#B84A14] bg-white px-3 py-1 text-[11px] font-bold text-[#B84A14] hover:bg-[#FDF3EC] uppercase cursor-pointer"
                      >
                        Insérer le code
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">
                        Code à 6 chiffres :
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Ex: 849201"
                        className="w-full p-3 border border-neutral-300 font-mono text-center text-lg tracking-widest focus:border-[#B84A14] focus:outline-none"
                        autoFocus
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMsg}</span>
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStep('credentials');
                          setErrorMsg('');
                        }}
                        className="border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold uppercase text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                      >
                        Modifier identifiants
                      </button>
                      <button
                        type="submit"
                        disabled={isVerifyingCode}
                        className="flex-1 border border-[#B84A14] bg-[#B84A14] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9E3E0F] cursor-pointer"
                      >
                        {isVerifyingCode ? 'Vérification...' : 'Valider et Accéder à mon compte'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* REGISTER MODE */}
            {authMode === 'register' && (
              <div className="space-y-4">
                {step === 'credentials' ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                    <div className="border border-neutral-300 bg-[#FDF3EC] p-3 text-xs text-neutral-800 space-y-1">
                      <div className="flex items-center gap-2 font-bold text-[#B84A14]">
                        <UserPlus className="w-4 h-4 shrink-0" />
                        <span>Création de compte Espace Commerçant</span>
                      </div>
                      <p className="text-neutral-700">
                        Renseignez vos informations pour créer immédiatement votre espace sécurisé.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1" htmlFor="regFullName">
                        Nom et prénom du responsable :
                      </label>
                      <input
                        id="regFullName"
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="Ex: Koffi Mensah"
                        className="w-full p-2.5 border border-neutral-300 text-sm font-medium text-neutral-900 focus:border-[#B84A14] focus:outline-none"
                        autoFocus
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1" htmlFor="regBusinessName">
                        Nom commercial de votre boutique / marque :
                      </label>
                      <input
                        id="regBusinessName"
                        type="text"
                        value={regBusinessName}
                        onChange={(e) => setRegBusinessName(e.target.value)}
                        placeholder="Ex: Lomé Wax Élégance"
                        className="w-full p-2.5 border border-neutral-300 text-sm font-medium text-neutral-900 focus:border-[#B84A14] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-900 mb-1" htmlFor="regEmail">
                          Adresse e-mail :
                        </label>
                        <input
                          id="regEmail"
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="contact@boutique.com"
                          className="w-full p-2.5 border border-neutral-300 text-sm font-medium text-neutral-900 focus:border-[#B84A14] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-900 mb-1" htmlFor="regPhone">
                          Numéro WhatsApp (+228) :
                        </label>
                        <input
                          id="regPhone"
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="Ex: 90 12 34 56"
                          className="w-full p-2.5 border border-neutral-300 text-sm font-medium text-neutral-900 focus:border-[#B84A14] focus:outline-none font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1" htmlFor="regPassword">
                        Créez votre mot de passe secret :
                      </label>
                      <input
                        id="regPassword"
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-2.5 border border-neutral-300 text-sm font-medium text-neutral-900 focus:border-[#B84A14] focus:outline-none"
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMsg}</span>
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login');
                          setStep('credentials');
                          setErrorMsg('');
                        }}
                        className="border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold uppercase text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                      >
                        Déjà un compte ? Connexion
                      </button>

                      <button
                        type="submit"
                        disabled={isSendingCode}
                        className="flex-1 border border-[#B84A14] bg-[#B84A14] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9E3E0F] cursor-pointer"
                      >
                        {isSendingCode ? 'Création en cours...' : 'Créer mon compte & Recevoir le code 2FA'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                    <div className="border border-neutral-300 bg-white p-3.5 text-xs text-neutral-800">
                      <p className="font-bold text-neutral-900 mb-1">
                        Code 2FA de création transmis à {regEmail || regPhone}
                      </p>
                      <p className="text-neutral-600">
                        Veuillez saisir le code temporaire à 6 chiffres transmis par e-mail ou WhatsApp.
                      </p>
                    </div>

                    {/* Simulated Code Display */}
                    <div className="border border-[#D96528] bg-[#FDF3EC] p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-600 uppercase block font-semibold">Code de sécurité généré :</span>
                        <span className="font-mono font-black text-base text-[#B84A14] tracking-widest">{generatedOtp || '123456'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEnteredOtp(generatedOtp || '123456')}
                        className="border border-[#B84A14] bg-white px-3 py-1 text-[11px] font-bold text-[#B84A14] hover:bg-[#FDF3EC] uppercase cursor-pointer"
                      >
                        Insérer le code
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">
                        Saisissez le code à 6 chiffres :
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Ex: 849201"
                        className="w-full p-3 border border-neutral-300 font-mono text-center text-lg tracking-widest focus:border-[#B84A14] focus:outline-none"
                        autoFocus
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMsg}</span>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isVerifyingCode}
                      className="w-full border border-[#B84A14] bg-[#B84A14] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9E3E0F] cursor-pointer"
                    >
                      {isVerifyingCode ? 'Validation...' : 'Valider et Accéder à mon nouveau compte'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* RECOVERY MODE */}
            {authMode === 'recovery' && (
              <div className="space-y-4">
                <div className="border border-neutral-300 bg-white p-3.5 text-xs text-neutral-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-neutral-900">
                    <HelpCircle className="w-4 h-4 text-[#B84A14]" />
                    <span>Récupération de compte & mot de passe</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">
                    Saisissez votre e-mail ou numéro WhatsApp enregistré. Un code de secours vous sera immédiatement adressé.
                  </p>
                </div>

                {step === 'credentials' ? (
                  <form onSubmit={handleRecoveryRequest} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1" htmlFor="recoveryId">
                        E-mail ou numéro WhatsApp :
                      </label>
                      <input
                        id="recoveryId"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="Ex: contact@boutique.com ou +228 90 12 34 56"
                        className="w-full p-3 border border-neutral-300 text-sm font-medium text-neutral-900 focus:border-[#B84A14] focus:outline-none"
                        autoFocus
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMsg}</span>
                      </p>
                    )}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login');
                          setStep('credentials');
                          setErrorMsg('');
                        }}
                        className="border border-neutral-300 bg-white px-4 py-2.5 text-xs font-bold uppercase text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                      >
                        Retour connexion
                      </button>
                      <button
                        type="submit"
                        disabled={isSendingCode}
                        className="flex-1 border border-[#B84A14] bg-[#B84A14] py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9E3E0F] cursor-pointer"
                      >
                        {isSendingCode ? 'Envoi...' : 'Envoyer le code de secours'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                    <div className="border border-[#D96528] bg-[#FDF3EC] p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-600 uppercase block font-semibold">Code de récupération généré :</span>
                        <span className="font-mono font-black text-base text-[#B84A14] tracking-widest">{generatedOtp || '123456'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEnteredOtp(generatedOtp || '123456')}
                        className="border border-[#B84A14] bg-white px-3 py-1 text-[11px] font-bold text-[#B84A14] hover:bg-[#FDF3EC] uppercase cursor-pointer"
                      >
                        Insérer le code
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-900 mb-1">
                        Saisissez le code de secours à 6 chiffres :
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="Ex: 849201"
                        className="w-full p-3 border border-neutral-300 font-mono text-center text-lg tracking-widest focus:border-[#B84A14] focus:outline-none"
                        autoFocus
                      />
                    </div>

                    {errorMsg && (
                      <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errorMsg}</span>
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isVerifyingCode}
                      className="w-full border border-[#B84A14] bg-[#B84A14] py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9E3E0F] cursor-pointer"
                    >
                      {isVerifyingCode ? 'Validation...' : 'Valider et Récupérer l\'accès'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        ) : (
          /* LOGGED IN VIEW */
          <div className="space-y-6">
            <div className="border border-neutral-300 bg-white p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] bg-[#B84A14] text-white font-mono font-bold uppercase px-2 py-0.5">
                    Commerçant Connecté
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-neutral-900 mt-1">
                    {currentUser.fullName} - {currentUser.businessName}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    WhatsApp: <span className="font-mono font-bold text-neutral-900">{currentUser.countryCode} {currentUser.phone}</span> - E-mail: <span className="font-mono font-bold text-neutral-900">{currentUser.email}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onBookNewSlot(currentUser);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 border border-[#B84A14] bg-[#B84A14] px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#9E3E0F] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nouveau live</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="flex items-center gap-1.5 border border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-900 px-3 py-2 text-xs font-bold uppercase cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bookings List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 pb-1 border-b border-neutral-300">
                Vos réservations de live ({userBookings.length})
              </h4>

              {userBookings.length === 0 ? (
                <div className="border border-neutral-300 bg-white p-6 text-center text-xs text-neutral-600">
                  <Calendar className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                  <p className="font-bold text-neutral-900 mb-1">Aucune réservation en cours</p>
                  <p className="mb-4">Réservez votre premier créneau pour présenter vos produits en direct.</p>
                  <button
                    type="button"
                    onClick={() => {
                      onBookNewSlot(currentUser);
                      onClose();
                    }}
                    className="border border-[#B84A14] bg-[#B84A14] px-4 py-2 text-xs font-bold uppercase text-white hover:bg-[#9E3E0F] cursor-pointer"
                  >
                    Réserver un créneau
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userBookings.map((b) => (
                    <div
                      key={b.id}
                      className="border border-neutral-300 bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-neutral-900">{b.reference}</span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 border border-emerald-600 bg-emerald-50 text-emerald-800">
                            Confirmé
                          </span>
                        </div>
                        <p className="font-bold text-neutral-900 capitalize">
                          {formatDateFr(b.date)} - {b.slotTime} à {b.slotEndTime} GMT
                        </p>
                        <p className="text-neutral-600">
                          {b.mode === 'presentiel' ? 'Studio Lomé' : 'À distance'} - {formatFcfa(b.totalFcfa)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onOpenPassageSheet(b);
                          onClose();
                        }}
                        className="flex items-center gap-1.5 border border-neutral-800 bg-neutral-900 text-white px-3 py-1.5 text-xs font-bold uppercase hover:bg-neutral-800 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#D96528]" />
                        <span>Fiche régie</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Bottom */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between gap-2 text-xs text-neutral-600">
          <span>Studio OCD Live Lomé</span>
          <button
            type="button"
            onClick={onClose}
            className="border border-neutral-800 bg-white hover:bg-neutral-100 text-neutral-900 px-4 py-1.5 font-bold uppercase text-xs cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
