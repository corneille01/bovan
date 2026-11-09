import React from 'react';
import { Bell, MessageSquare, Mail } from 'lucide-react';
import { NotificationLog, UserAccount } from '../types';

interface NotificationsViewerModalProps {
  notifications: NotificationLog[];
  currentUser?: UserAccount | null;
  onClose: () => void;
}

export const NotificationsViewerModal: React.FC<NotificationsViewerModalProps> = ({
  notifications,
  currentUser,
  onClose
}) => {
  // Filter notifications specifically for the current user if not regie admin
  const isRegieAdmin = currentUser?.role === 'regie_admin';

  const userNotifications = currentUser && !isRegieAdmin
    ? notifications.filter(n => {
        const cleanRecip = n.recipient.toLowerCase();
        const userEmail = (currentUser.email || '').toLowerCase();
        const userPhone = currentUser.phone || '';
        return (
          (userEmail && cleanRecip.includes(userEmail)) ||
          (userPhone && cleanRecip.includes(userPhone)) ||
          n.subject.includes(currentUser.businessName)
        );
      })
    : notifications;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-3 sm:p-4 pt-14 sm:pt-20 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-2 border-neutral-800 w-full max-w-3xl mb-12 p-4 sm:p-6 shadow-2xl relative"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-300 mb-6 gap-2">
          <div className="flex items-center gap-3">
            <div className="border border-[#B84A14] bg-[#FDF3EC] p-2 text-[#B84A14] shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-[#B84A14] uppercase tracking-wider block">
                Journal de transmission
              </span>
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                Vos Notifications WhatsApp et E-mails ({userNotifications.length})
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="border-2 border-neutral-800 bg-white hover:bg-neutral-100 px-3.5 py-1.5 text-xs font-bold uppercase text-neutral-900 cursor-pointer transition-colors"
          >
            ✕ Fermer
          </button>
        </div>

        {userNotifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-600">
            Aucune notification personnelle enregistrée. Effectuez une réservation pour déclencher les alertes instantanées.
          </div>
        ) : (
          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
            {userNotifications.map((n) => (
              <div
                key={n.id}
                className="border border-neutral-300 bg-white p-4 space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                  <div className="flex items-center gap-2">
                    {n.channel === 'whatsapp' ? (
                      <span className="flex items-center gap-1 border border-emerald-500 bg-emerald-50 text-emerald-900 px-2 py-0.5 font-bold uppercase text-[10px]">
                        <MessageSquare className="w-3 h-3 text-emerald-700" /> WhatsApp
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 border border-sky-500 bg-sky-50 text-sky-900 px-2 py-0.5 font-bold uppercase text-[10px]">
                        <Mail className="w-3 h-3 text-sky-700" /> E-mail
                      </span>
                    )}
                    <span className="font-mono text-neutral-800 font-bold break-all">{n.recipient}</span>
                  </div>

                  <div className="flex items-center gap-2 text-neutral-500 text-[11px] font-mono">
                    <span>Dossier: {n.bookingRef}</span>
                    <span>-</span>
                    <span>{new Date(n.timestamp).toLocaleTimeString('fr-FR')}</span>
                  </div>
                </div>

                <div>
                  <strong className="text-neutral-900 block mb-1">{n.subject}</strong>
                  <pre className="border border-neutral-200 bg-neutral-50 p-3 font-mono text-[11px] text-neutral-800 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                    {n.content}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom footer close action */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-600">
          <span>Plateforme OCD Live Lomé</span>
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
