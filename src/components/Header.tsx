import React from 'react';
import { Video, User, LayoutDashboard, Bell, LogOut } from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  currentTab: 'booking' | 'regie' | 'account' | 'legal';
  onNavigate: (tab: 'booking' | 'regie' | 'account' | 'legal') => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenNotifications,
  notificationCount
}) => {
  const isRegieAdmin = currentUser?.role === 'regie_admin';

  return (
    <header className="border-b-2 border-neutral-800 bg-[#141414] text-white sticky top-0 z-40 shadow-sm w-full">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand Zone */}
          <div 
            onClick={() => onNavigate('booking')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
            role="button"
            tabIndex={0}
            aria-label="Accueil Réservation OCD Live Lomé"
          >
            <div className="border-2 border-[#D96528] bg-black px-2 py-1 text-center shrink-0">
              <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-[#D96528]">OCD</span>
              <span className="ml-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white">Live</span>
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-100 flex items-center gap-1.5 leading-tight">
                <span>Studio Live</span>
                <span className="text-[9px] bg-[#9E3E0F] text-white px-1.5 py-0.2 font-mono shrink-0">Lomé</span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-tight mt-0.5 hidden xs:block">
                House of Challenge - TikTok & Facebook
              </p>
            </div>
          </div>

          {/* Navigation Action Buttons - fully wrapped for mobile responsiveness */}
          <nav className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 grow sm:grow-0">
            {/* Bouton Réserver */}
            <button
              type="button"
              onClick={() => onNavigate('booking')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                currentTab === 'booking'
                  ? 'bg-[#B84A14] text-white border border-[#B84A14]'
                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-[#D96528] shrink-0" />
              <span>RÉSERVER</span>
            </button>

            {/* Bouton Mon Compte / Connexion */}
            <button
              type="button"
              onClick={() => {
                if (currentUser) {
                  if (currentUser.role === 'regie_admin') {
                    onNavigate('regie');
                  } else {
                    onNavigate('account');
                  }
                } else {
                  onOpenAuth();
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                currentTab === 'account' || (currentTab === 'regie' && isRegieAdmin)
                  ? 'bg-[#B84A14] text-white border border-[#B84A14]'
                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700'
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0 text-[#D96528]" />
              <span className="truncate max-w-[85px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-[200px] block font-semibold">
                {currentUser 
                  ? (currentUser.fullName || currentUser.businessName || (isRegieAdmin ? 'Régie' : 'Compte'))
                  : 'SE CONNECTER'
                }
              </span>
            </button>

            {/* Bouton Régie CRM */}
            {isRegieAdmin && (
              <button
                type="button"
                onClick={() => onNavigate('regie')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  currentTab === 'regie'
                    ? 'bg-[#B84A14] text-white border border-[#B84A14]'
                    : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                <span>Régie</span>
              </button>
            )}

            {/* Notifications */}
            <button
              type="button"
              onClick={onOpenNotifications}
              title="Journal des notifications"
              className="relative p-2 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border border-neutral-700 transition-colors cursor-pointer shrink-0"
              aria-label="Journal des notifications"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D96528] text-white text-[9px] font-bold px-1 py-0.2 font-mono">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Déconnexion */}
            {currentUser && (
              <button
                type="button"
                onClick={onLogout}
                title="Se déconnecter"
                className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase text-neutral-200 hover:text-white bg-neutral-900 hover:bg-red-800 border border-neutral-700 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                <span className="hidden xs:inline">Sortir</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
