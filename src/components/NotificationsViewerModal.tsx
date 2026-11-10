import React from 'react';
import { Bell, MessageSquare, Mail } from 'lucide-react';
import { NotificationLog, UserAccount } from '../types';

interface NotificationsViewerModalProps {
  notifications: NotificationLog[];
  currentUser?: UserAccount | null;
  onClose: () => void;
}

export const NotificationsViewerModal: React.FC<NotificationsViewerModalProps> = ({ notifications, currentUser, onClose }) => {
  // Filter notifications specifically for the current user if not regie admin
  const isRegieAdmin = currentUser?.role === 'regie_admin';

  const userNotifications =
    currentUser && !isRegieAdmin
      ? notifications.filter((n) => {
          const cleanRecip = n.recipient.toLowerCase();
          const userEmail = (currentUser.email || '').toLowerCase();
          const userPhone = currentUser.phone || '';
          return (userEmail && cleanRecip.includes(userEmail)) || (userPhone && cleanRecip.includes(userPhone)) || n.subject.includes(currentUser.businessName);
        })
      : notifications;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/75 p-3 sm:p-4 pt-14 sm:pt-20 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div onClick={(e) => e.stopPropagation()} className="bg-white border-2 border-neutral-800 w-full max-w-3xl mb-12 p-4 sm:p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-300 mb-6 gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="border border-[#B84A14] bg-[#FDF3EC] p-2 text-[#B84A14] shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-neutral-900">Messages envoyés ({userNotifications.length})</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="border-2 border-neutral-800 bg-white hover:bg-neutral-100 px-3.5 py-1.5 text-xs font-bold text-neutral-900 cursor-pointer transition-colors shrink-0"
          >
            Fermer
          </button>
        </div>

        {userNotifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-600">Aucun message pour le moment. Vos messages apparaîtront ici après une réservation.</div>
        ) : (
          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
            {userNotifications.map((n) => (
              <div key={n.id} className="border border-neutral-300 bg-white p-4 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    {n.channel === 'whatsapp' ? (
                      <span className="flex items-center gap-1 border border-[#B84A14] bg-[#FDF3EC] text-[#9E3E0F] px-2 py-0.5 font-bold text-[10px]">
                        <MessageSquare className="w-3 h-3 text-[#B84A14]" /> WhatsApp
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 border border-neutral-400 bg-white text-neutral-800 px-2 py-0.5 font-bold text-[10px]">
                        <Mail className="w-3 h-3 text-neutral-600" /> E-mail
                      </span>
                    )}
                    <span className="tabular-nums text-neutral-800 font-bold break-all">{n.recipient}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-neutral-500 text-[11px] tabular-nums">
                    <span>Réservation {n.bookingRef}</span>
                    <span>{new Date(n.timestamp).toLocaleTimeString('fr-FR')}</span>
                  </div>
                </div>

                <div>
                  <strong className="text-neutral-900 block mb-1">{n.subject}</strong>
                  <pre className="border border-neutral-200 bg-white p-3 tabular-nums text-[11px] text-neutral-800 whitespace-pre-wrap break-words leading-relaxed max-h-48 overflow-y-auto">
                    {n.content}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom footer close action */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600">
          <span>OCD Live, Lomé</span>
          <button
            type="button"
            onClick={onClose}
            className="border border-neutral-800 bg-white hover:bg-neutral-100 text-neutral-900 px-4 py-1.5 font-bold text-xs cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
