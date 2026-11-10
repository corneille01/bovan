import React, { useEffect, useState } from 'react';
import { Menu, X, Video, User, LayoutDashboard, Bell, LogOut } from 'lucide-react';
import { UserAccount } from '../types';

type Tab = 'booking' | 'regie' | 'account' | 'legal';

interface HeaderProps {
  currentTab: Tab;
  onNavigate: (tab: Tab) => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, currentUser, onOpenAuth, onLogout, onOpenNotifications, notificationCount }) => {
  const [open, setOpen] = useState(false);
  const isAdmin = currentUser?.role === 'regie_admin';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const go = (fn: () => void) => () => {
    setOpen(false);
    fn();
  };

  const item = (active: boolean) =>
    `flex items-center gap-2 px-3 py-3 md:py-2 text-sm font-semibold min-h-[44px] w-full md:w-auto text-left border-b-2 ${
      active ? 'border-[#B84A14] text-[#B84A14]' : 'border-transparent text-neutral-900 hover:text-[#B84A14]'
    }`;

  return (
    <header className="bg-white border-b border-neutral-300 relative">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-3">
        <button type="button" onClick={go(() => onNavigate('booking'))} className="flex items-center gap-2 min-w-0" aria-label="Accueil, réserver un live">
          <span className="border-2 border-[#B84A14] px-2 py-0.5 text-base font-bold text-[#B84A14] leading-none">OCD</span>
          <span className="text-sm font-bold text-neutral-900 truncate">Live Lomé</span>
        </button>

        <nav className="hidden md:flex items-center gap-1" aria-label="Menu principal">
          <button type="button" className={item(currentTab === 'booking')} onClick={go(() => onNavigate('booking'))}>
            <Video className="w-4 h-4" /> Réserver
          </button>
          <button
            type="button"
            className={item(currentTab === 'account' || (currentTab === 'regie' && !isAdmin))}
            onClick={go(() => (currentUser ? onNavigate(isAdmin ? 'regie' : 'account') : onOpenAuth()))}
          >
            <User className="w-4 h-4" /> {currentUser ? currentUser.fullName.split(' ')[0] : 'Se connecter'}
          </button>
          {isAdmin && (
            <button type="button" className={item(currentTab === 'regie')} onClick={go(() => onNavigate('regie'))}>
              <LayoutDashboard className="w-4 h-4" /> Réservations du studio
            </button>
          )}
          {currentUser && (
            <button type="button" className={`${item(false)} relative`} onClick={go(onOpenNotifications)}>
              <Bell className="w-4 h-4" /> Messages
              {notificationCount > 0 && <span className="ml-1 bg-[#B84A14] text-white text-[11px] px-1.5 tabular-nums">{notificationCount}</span>}
            </button>
          )}
          {currentUser && (
            <button type="button" className={item(false)} onClick={go(onLogout)}>
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="md:hidden absolute left-0 right-0 top-full bg-white border-b border-neutral-300 shadow-lg px-4 pb-3 max-h-[calc(100vh-56px)] overflow-y-auto"
          aria-label="Menu principal"
        >
          <button type="button" className={item(currentTab === 'booking')} onClick={go(() => onNavigate('booking'))}>
            <Video className="w-4 h-4" /> Réserver un live
          </button>
          <button
            type="button"
            className={item(currentTab === 'account')}
            onClick={go(() => (currentUser ? onNavigate(isAdmin ? 'regie' : 'account') : onOpenAuth()))}
          >
            <User className="w-4 h-4" /> {currentUser ? 'Mon espace' : 'Se connecter'}
          </button>
          {isAdmin && (
            <button type="button" className={item(currentTab === 'regie')} onClick={go(() => onNavigate('regie'))}>
              <LayoutDashboard className="w-4 h-4" /> Réservations du studio
            </button>
          )}
          {currentUser && (
            <button type="button" className={item(false)} onClick={go(onOpenNotifications)}>
              <Bell className="w-4 h-4" /> Messages envoyés{notificationCount > 0 ? ` (${notificationCount})` : ''}
            </button>
          )}
          {currentUser && (
            <button type="button" className={item(false)} onClick={go(onLogout)}>
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          )}
        </nav>
      )}
    </header>
  );
};
