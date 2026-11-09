import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StepProgressBar } from './components/StepProgressBar';
import { Step1Mode } from './components/Step1Mode';
import { Step2Pack } from './components/Step2Pack';
import { Step3Date } from './components/Step3Date';
import { Step4Slot } from './components/Step4Slot';
import { Step5Activity, ActivityFormData } from './components/Step5Activity';
import { Step6Payment } from './components/Step6Payment';
import { Step7Confirmation } from './components/Step7Confirmation';
import { ClientAccountModal } from './components/ClientAccountModal';
import { RegieDashboard } from './components/RegieDashboard';
import { LegalModal } from './components/LegalModal';
import { CookieBanner } from './components/CookieBanner';
import { NotificationsViewerModal } from './components/NotificationsViewerModal';
import { PassageSheetModal } from './components/PassageSheetModal';
import { ClientDashboard } from './components/ClientDashboard';

import { 
  Booking, 
  BookingMode, 
  PackId, 
  PaymentMethod, 
  UserAccount, 
  NotificationLog 
} from './types';
import { PACKS } from './data/packs';
import { 
  getBookings, 
  saveBooking, 
  updateBookingStatus, 
  getUserAccounts, 
  saveUserAccount, 
  getCurrentUser, 
  setCurrentUser, 
  getNotifications, 
  addNotification,
  getCookieConsent,
  setCookieConsent
} from './utils/storage';
import { fetchBookingsFromApi, fetchUsersFromApi, fetchNotificationsFromApi } from './utils/api';
import { generateBookingReference, formatDateFr, formatFcfa } from './utils/formatters';

export default function App() {
  // Navigation tabs
  const [currentTab, setCurrentTab] = useState<'booking' | 'regie' | 'account' | 'legal'>('booking');
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Core Booking State
  const [selectedMode, setSelectedMode] = useState<BookingMode>('presentiel');
  const [selectedPackId, setSelectedPackId] = useState<PackId>('visibilite');
  const [selectedDate, setSelectedDate] = useState<string>('2026-12-08');
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('10:30');
  const [selectedSlotEndTime, setSelectedSlotEndTime] = useState<string>('12:00');
  
  // Activity form state
  const [activityData, setActivityData] = useState<ActivityFormData>({
    fullName: '',
    phone: '',
    countryCode: '+228',
    email: '',
    businessName: '',
    sector: 'mode_textile',
    productsDescription: '',
    country: 'Togo',
    onScreenPhone: '',
    liveGoal: 'Placer mon produit et mes coordonnées WhatsApp devant des milliers de spectateurs.'
  });

  // Completed booking after payment
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Storage & Neon DB synced states
  const [bookings, setBookings] = useState<Booking[]>(() => getBookings());
  const [accounts, setAccounts] = useState<UserAccount[]>(() => getUserAccounts());
  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(() => getCurrentUser());
  const [notifications, setNotifications] = useState<NotificationLog[]>(() => getNotifications());
  const [cookieConsent, setCookieConsentState] = useState<boolean | null>(() => getCookieConsent());

  // Initial Sync from Neon DB API
  useEffect(() => {
    async function syncDatabase() {
      try {
        const [apiBookings, apiUsers, apiNotifs] = await Promise.all([
          fetchBookingsFromApi(),
          fetchUsersFromApi(),
          fetchNotificationsFromApi()
        ]);
        if (apiBookings && apiBookings.length > 0) {
          setBookings(apiBookings);
        }
        if (apiUsers && apiUsers.length > 0) {
          setAccounts(apiUsers);
        }
        if (apiNotifs && apiNotifs.length > 0) {
          setNotifications(apiNotifs);
        }
      } catch (err) {
        console.warn('Neon DB sync error on startup:', err);
      }
    }
    syncDatabase();
  }, []);

  // Modal controls
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [showPassageSheetModal, setShowPassageSheetModal] = useState<boolean>(false);
  const [activePassageBooking, setActivePassageBooking] = useState<Booking | null>(null);
  const [showLegalModal, setShowLegalModal] = useState<boolean>(false);
  const [legalTab, setLegalTab] = useState<'mentions' | 'cgv' | 'privacy' | 'cookies' | 'accessibility' | 'sitemap'>('mentions');

  // Pre-fill activity data if user logs in
  useEffect(() => {
    if (currentUser) {
      setActivityData(prev => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName,
        phone: currentUser.phone || prev.phone,
        countryCode: currentUser.countryCode || prev.countryCode,
        email: currentUser.email || prev.email,
        businessName: currentUser.businessName || prev.businessName,
        sector: currentUser.sector || prev.sector,
        onScreenPhone: currentUser.onScreenPhone || prev.onScreenPhone,
        country: currentUser.country || prev.country
      }));
    }
  }, [currentUser]);

  // Scroll to top on step or tab changes as requested
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, currentTab]);

  // Floating return-to-top button state
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Can navigate to step helper
  const canNavigateTo = (step: number) => {
    if (step === 1) return true;
    if (step === 2) return true;
    if (step === 3) return Boolean(selectedPackId);
    if (step === 4) return Boolean(selectedDate);
    if (step === 5) return Boolean(selectedSlotTime);
    if (step === 6) return Boolean(activityData.fullName && activityData.phone);
    if (step === 7) return Boolean(confirmedBooking);
    return false;
  };

  // Step 5 Submit
  const handleActivitySubmit = (data: ActivityFormData) => {
    setActivityData(data);
    setCurrentStep(6);
  };

  // Step 6 Payment Confirmation & Notifications Dispatch
  const handleConfirmPayment = (paymentMethod: PaymentMethod, paymentRef: string) => {
    const currentPack = PACKS.find(p => p.id === selectedPackId) || PACKS[0];
    const newRef = generateBookingReference();

    const newBooking: Booking = {
      id: newRef,
      reference: newRef,
      createdAt: new Date().toISOString(),
      mode: selectedMode,
      packId: selectedPackId,
      date: selectedDate,
      slotTime: selectedSlotTime,
      slotEndTime: selectedSlotEndTime,
      fullName: activityData.fullName,
      phone: activityData.phone,
      countryCode: activityData.countryCode,
      email: activityData.email,
      businessName: activityData.businessName,
      sector: activityData.sector,
      productsDescription: activityData.productsDescription,
      country: selectedMode === 'presentiel' ? 'Togo' : activityData.country,
      onScreenPhone: activityData.onScreenPhone,
      liveGoal: activityData.liveGoal,
      paymentMethod,
      paymentStatus: 'completed',
      paymentReference: paymentRef,
      totalFcfa: currentPack.priceFcfa,
      totalEur: currentPack.priceEur,
      status: 'confirmed',
      regieNotes: `Réservation en ligne réglée via ${paymentMethod.toUpperCase()}.`,
      assistantAssigned: selectedMode === 'presentiel' ? 'Ablavi (Studio Lomé)' : 'Folly (Ingénieur streaming)',
      googleCalendarSynced: true,
      whatsappNotificationSentClient: true,
      emailNotificationSentClient: true,
      whatsappNotificationSentRegie: true,
      emailNotificationSentRegie: true
    };

    // Save in storage & Neon DB
    saveBooking(newBooking);
    setConfirmedBooking(newBooking);

    // Refresh state from Neon DB directly
    fetchBookingsFromApi().then(bks => { if (bks && bks.length) setBookings(bks); });
    fetchUsersFromApi().then(usr => { if (usr && usr.length) setAccounts(usr); });

    // Auto log WhatsApp & Email notifications (as demanded: "notification apr numero whatsaap et mail au client et à la régie")
    const clientWhatsAppLog: NotificationLog = {
      id: `NOTIF-WA-CLI-${Date.now()}`,
      timestamp: new Date().toISOString(),
      channel: 'whatsapp',
      recipientType: 'client',
      recipient: `${activityData.countryCode} ${activityData.phone}`,
      subject: `Confirmation de votre créneau Live Streaming OCD (${newRef})`,
      content: `Bonjour ${activityData.fullName},\nVotre créneau de diffusion en direct au Studio OCD Live Lomé est confirmé !\n📅 Date : ${formatDateFr(selectedDate)}\n⏰ Heure : ${selectedSlotTime} - ${selectedSlotEndTime} (GMT Lomé)\n📦 Formule : ${currentPack.name}\n📞 Numéro incrusté à l'écran : ${activityData.onScreenPhone}\nUn compte commerçant sécurisé a été généré pour vos prochaines diffusions.`,
      bookingRef: newRef
    };

    const clientEmailLog: NotificationLog = {
      id: `NOTIF-MAIL-CLI-${Date.now()}`,
      timestamp: new Date().toISOString(),
      channel: 'email',
      recipientType: 'client',
      recipient: activityData.email,
      subject: `Accusé de réception officiel & Facture provisoire - Dossier ${newRef}`,
      content: `Madame, Monsieur ${activityData.fullName},\nHouse of Challenge Lomé confirme l'enregistrement de votre créneau.\nMontant réglé : ${formatFcfa(currentPack.priceFcfa)}.\nConnectez-vous à votre Espace Commerçant via votre e-mail ou WhatsApp et votre code 2FA à 6 chiffres.`,
      bookingRef: newRef
    };

    const regieWhatsAppLog: NotificationLog = {
      id: `NOTIF-WA-REG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      channel: 'whatsapp',
      recipientType: 'regie',
      recipient: '+228 90 00 11 22 (Régie BOVAN & Assistante Lomé)',
      subject: `NOUVEAU LIVE PROGRAMMÉ : ${activityData.businessName} (${newRef})`,
      content: `🔴 ALERTE RÉGIE STUDIO OCD LIVE LOMÉ :\nNouveau passage confirmé !\nCommerçant : ${activityData.fullName} (${activityData.businessName})\nDate : ${formatDateFr(selectedDate)} à ${selectedSlotTime} GMT\nMode : ${selectedMode === 'presentiel' ? 'PRÉSENTIEL (Studio Lomé)' : `À DISTANCE (${activityData.country})`}\nNuméro direct à afficher en live : ${activityData.onScreenPhone}\nPack : ${currentPack.name} (${formatFcfa(currentPack.priceFcfa)})\nRèglement : Validé (${paymentMethod.toUpperCase()})`,
      bookingRef: newRef
    };

    const regieEmailLog: NotificationLog = {
      id: `NOTIF-MAIL-REG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      channel: 'email',
      recipientType: 'regie',
      recipient: 'blogoos1@gmail.com',
      subject: `[RÉGIE BOVAN] Nouvelle réservation confirmée - Dossier ${newRef}`,
      content: `Alerte Régie OCD Live Lomé :\nUne nouvelle réservation a été enregistrée.\nClient : ${activityData.fullName} (${activityData.email})\nCommerce : ${activityData.businessName}\nDate : ${formatDateFr(selectedDate)} à ${selectedSlotTime} GMT\nNuméro affiché en direct : ${activityData.onScreenPhone}\nMontant réglé : ${formatFcfa(currentPack.priceFcfa)} (${paymentMethod.toUpperCase()})`,
      bookingRef: newRef
    };

    addNotification(clientWhatsAppLog);
    addNotification(clientEmailLog);
    addNotification(regieWhatsAppLog);
    addNotification(regieEmailLog);
    setNotifications(getNotifications());

    // Advance to Step 7
    setCurrentStep(7);
  };

  // Reset for a fresh booking
  const handleNewBooking = () => {
    setConfirmedBooking(null);
    setCurrentStep(1);
    setSelectedSlotTime('');
  };

  // Quick rebook from Client Account
  const handleBookFromAccount = (user: UserAccount) => {
    setActivityData({
      fullName: user.fullName,
      phone: user.phone,
      countryCode: user.countryCode,
      email: user.email,
      businessName: user.businessName,
      sector: user.sector,
      productsDescription: '',
      country: user.country,
      onScreenPhone: user.onScreenPhone,
      liveGoal: 'Nouvelle diffusion commerciale OCD Live'
    });
    setConfirmedBooking(null);
    setCurrentTab('booking');
    setCurrentStep(2); // Jump straight to pack selection
  };

  // Auth actions
  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentUserState(user);
    saveUserAccount(user);
    setAccounts(getUserAccounts());
    if (user.role === 'regie_admin') {
      setCurrentTab('regie');
    } else {
      setCurrentTab('account');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    setCurrentTab('booking');
    setCurrentStep(1);
  };

  // Open passage sheet
  const handleOpenPassage = (booking: Booking) => {
    setActivePassageBooking(booking);
    setShowPassageSheetModal(true);
  };

  // Status update from Regie
  const handleUpdateStatus = (id: string, status: Booking['status'], notes?: string) => {
    const updated = updateBookingStatus(id, status, notes);
    setBookings(updated);
  };

  // Legal Modal opener
  const handleOpenLegal = (tab: 'mentions' | 'cgv' | 'privacy' | 'cookies' | 'accessibility' | 'sitemap') => {
    setLegalTab(tab);
    setShowLegalModal(true);
  };

  const currentPack = PACKS.find(p => p.id === selectedPackId) || PACKS[0];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1E242B]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onNavigate={(tab) => {
          if (tab === 'account' && !currentUser) {
            setShowAuthModal(true);
          } else {
            setCurrentTab(tab);
          }
        }}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        notificationCount={notifications.length}
      />

      {/* Main Container */}
      <main className="flex-1">
        {currentTab === 'booking' && (
          <div>
            {/* Sticky Step Progress & Navigation Container for Mobile & Desktop */}
            <div className="sticky top-[48px] sm:top-[56px] z-30 shadow-md w-full bg-white">
              <StepProgressBar
                currentStep={currentStep}
                onGoToStep={(step) => {
                  if (canNavigateTo(step)) {
                    setCurrentStep(step);
                  }
                }}
                canNavigateTo={canNavigateTo}
              />

              {currentStep > 1 && currentStep < 7 && (
                <div className="bg-white border-b-2 border-neutral-300">
                  <div className="mx-auto max-w-6xl px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                      className="inline-flex items-center gap-1.5 border border-neutral-400 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-neutral-800 transition-colors cursor-pointer shrink-0"
                      title="Revenir à l'étape précédente pour modifier votre choix"
                    >
                      <ArrowLeft className="w-4 h-4 text-[#B84A14]" />
                      <span>Étape précédente ({currentStep - 1})</span>
                    </button>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-neutral-600">
                      <span className="font-mono font-bold text-[#B84A14]">Étape {currentStep} sur 7</span>
                      <span className="hidden sm:inline text-neutral-400">-</span>
                      <span className="font-semibold text-neutral-700">
                        {currentStep === 2 && 'Sélection de la Formule'}
                        {currentStep === 3 && 'Sélection de la Date'}
                        {currentStep === 4 && 'Sélection du Créneau'}
                        {currentStep === 5 && 'Votre Activité & Coordonnées'}
                        {currentStep === 6 && 'Paiement Sécurisé'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mx-auto max-w-6xl px-4 py-8">
              {currentStep === 1 && (
                <Step1Mode
                  selectedMode={selectedMode}
                  onSelectMode={(mode) => setSelectedMode(mode)}
                  onNext={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 2 && (
                <Step2Pack
                  mode={selectedMode}
                  selectedPackId={selectedPackId}
                  onSelectPack={(id) => setSelectedPackId(id)}
                  onNext={() => setCurrentStep(3)}
                  onPrev={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <Step3Date
                  selectedDate={selectedDate}
                  onSelectDate={(d) => setSelectedDate(d)}
                  onNext={() => setCurrentStep(4)}
                  onPrev={() => setCurrentStep(2)}
                  existingBookings={bookings}
                />
              )}

              {currentStep === 4 && (
                <Step4Slot
                  packId={selectedPackId}
                  date={selectedDate}
                  selectedSlotTime={selectedSlotTime}
                  onSelectSlot={(time, endTime) => {
                    setSelectedSlotTime(time);
                    setSelectedSlotEndTime(endTime);
                  }}
                  onNext={() => setCurrentStep(5)}
                  onPrev={() => setCurrentStep(3)}
                  existingBookings={bookings}
                />
              )}

              {currentStep === 5 && (
                <Step5Activity
                  mode={selectedMode}
                  initialData={activityData}
                  onSubmitData={handleActivitySubmit}
                  onPrev={() => setCurrentStep(4)}
                  currentUser={currentUser}
                />
              )}

              {currentStep === 6 && (
                <Step6Payment
                  pack={currentPack}
                  mode={selectedMode}
                  date={selectedDate}
                  slotTime={selectedSlotTime}
                  slotEndTime={selectedSlotEndTime}
                  activityData={activityData}
                  onConfirmPayment={handleConfirmPayment}
                  onPrev={() => setCurrentStep(5)}
                />
              )}

              {currentStep === 7 && confirmedBooking && (
                <Step7Confirmation
                  booking={confirmedBooking}
                  onOpenPassageSheet={handleOpenPassage}
                  onGoToAccount={(user) => {
                    handleLogin(user);
                    setCurrentTab('account');
                  }}
                  onGoToRegie={() => setCurrentTab('regie')}
                  onNewBooking={handleNewBooking}
                  currentUser={currentUser}
                />
              )}
            </div>
          </div>
        )}

        {currentTab === 'regie' && (
          <div className="mx-auto max-w-6xl px-4 py-8">
            <RegieDashboard
              bookings={bookings}
              onUpdateStatus={handleUpdateStatus}
              onOpenPassageSheet={handleOpenPassage}
              onOpenNotifications={() => setShowNotificationsModal(true)}
              onLogout={handleLogout}
            />
          </div>
        )}

        {currentTab === 'account' && currentUser && (
          <div className="mx-auto max-w-6xl px-4 py-8">
            <ClientDashboard
              currentUser={currentUser}
              allBookings={bookings}
              onLogin={(user) => handleLogin(user)}
              onLogout={handleLogout}
              onBookNewSlot={handleBookFromAccount}
              onOpenPassageSheet={handleOpenPassage}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenLegal={handleOpenLegal} />

      {/* Auth / Client Account Modal */}
      {showAuthModal && (
        <ClientAccountModal
          currentUser={currentUser}
          onLogin={(user) => {
            handleLogin(user);
          }}
          onLogout={handleLogout}
          allAccounts={accounts}
          allBookings={bookings}
          onBookNewSlot={handleBookFromAccount}
          onOpenPassageSheet={handleOpenPassage}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Notifications Audit Viewer Modal */}
      {showNotificationsModal && (
        <NotificationsViewerModal
          notifications={notifications}
          currentUser={currentUser}
          onClose={() => setShowNotificationsModal(false)}
        />
      )}

      {/* Passage Sheet Modal */}
      {showPassageSheetModal && (
        <PassageSheetModal
          booking={activePassageBooking}
          onClose={() => setShowPassageSheetModal(false)}
        />
      )}

      {/* Legal & Compliance Modal */}
      {showLegalModal && (
        <LegalModal
          initialTab={legalTab}
          onClose={() => setShowLegalModal(false)}
        />
      )}

      {/* CNIL Compliant Cookie Banner */}
      {cookieConsent === null && (
        <CookieBanner
          onAccept={() => {
            setCookieConsent(true);
            setCookieConsentState(true);
          }}
          onDecline={() => {
            setCookieConsent(false);
            setCookieConsentState(false);
          }}
          onCustomize={() => handleOpenLegal('cookies')}
        />
      )}

      {/* Floating Return to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-10 right-4 sm:right-8 z-50 border-2 border-neutral-900 bg-[#B84A14] hover:bg-[#9E3E0F] active:bg-black text-white p-3 shadow-2xl flex items-center justify-center cursor-pointer transition-all"
          title="Remonter en haut de la page"
          aria-label="Remonter en haut de la page"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>
      )}
    </div>
  );
}
