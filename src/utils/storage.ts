import { Booking, UserAccount, NotificationLog } from '../types';
import { INITIAL_BOOKINGS } from '../data/initialBookings';
import { saveBookingToApi, patchBookingOnApi, updateUserProfileOnApi, postNotificationLog } from './api';

const STORAGE_KEYS = {
  BOOKINGS: 'ocd_live_bookings_v1',
  ACCOUNTS: 'ocd_live_accounts_v1',
  CURRENT_USER: 'ocd_live_current_user_v1',
  NOTIFICATIONS: 'ocd_live_notifications_v1',
  COOKIES_ACCEPTED: 'ocd_live_cookies_v1'
};

export function getBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function saveBooking(booking: Booking): void {
  const existing = getBookings();
  const index = existing.findIndex(b => b.id === booking.id);
  let updated: Booking[];
  if (index >= 0) {
    updated = [...existing];
    updated[index] = booking;
  } else {
    updated = [booking, ...existing];
  }
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));

  // Sync with Neon Postgres API
  saveBookingToApi(booking).catch(console.warn);

  // Automatically register / update user account
  autoRegisterUserAccount(booking);
}

export function updateBookingStatus(id: string, status: Booking['status'], notes?: string): Booking[] {
  const existing = getBookings();
  const updated = existing.map(b => {
    if (b.id === id) {
      return {
        ...b,
        status,
        regieNotes: notes !== undefined ? notes : b.regieNotes
      };
    }
    return b;
  });
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));

  // Sync with Neon Postgres API
  patchBookingOnApi(id, status, notes).catch(console.warn);

  return updated;
}

export function getUserAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUserAccount(account: UserAccount): void {
  const accounts = getUserAccounts();
  const index = accounts.findIndex(a => (a.phone === account.phone && a.countryCode === account.countryCode) || (a.email && a.email === account.email));
  if (index >= 0) {
    accounts[index] = account;
  } else {
    accounts.push(account);
  }
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));

  // Sync to Neon Postgres
  updateUserProfileOnApi(account.email || account.phone, account).catch(console.warn);
}

export function autoRegisterUserAccount(booking: Booking): UserAccount {
  const accounts = getUserAccounts();
  const existingIndex = accounts.findIndex(
    a => a.phone === booking.phone && a.countryCode === booking.countryCode
  );

  let account: UserAccount;

  if (existingIndex >= 0) {
    account = accounts[existingIndex];
    if (!account.bookingIds.includes(booking.id)) {
      account.bookingIds.unshift(booking.id);
    }
    account.fullName = booking.fullName;
    account.email = booking.email;
    account.businessName = booking.businessName;
    account.sector = booking.sector;
    account.onScreenPhone = booking.onScreenPhone;
    account.country = booking.country;
    account.lastLoginAt = new Date().toISOString();
    accounts[existingIndex] = account;
  } else {
    account = {
      phone: booking.phone,
      countryCode: booking.countryCode,
      fullName: booking.fullName,
      email: booking.email,
      businessName: booking.businessName,
      sector: booking.sector,
      onScreenPhone: booking.onScreenPhone,
      country: booking.country,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      bookingIds: [booking.id]
    };
    accounts.push(account);
  }

  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  updateUserProfileOnApi(account.email || account.phone, account).catch(console.warn);
  return account;
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function getNotifications(): NotificationLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addNotification(log: NotificationLog): void {
  const list = getNotifications();
  const updated = [log, ...list];
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated.slice(0, 100)));
  postNotificationLog(log);
}

export function getCookieConsent(): boolean | null {
  const val = localStorage.getItem(STORAGE_KEYS.COOKIES_ACCEPTED);
  if (val === 'accepted') return true;
  if (val === 'declined') return false;
  return null;
}

export function setCookieConsent(accepted: boolean): void {
  localStorage.setItem(STORAGE_KEYS.COOKIES_ACCEPTED, accepted ? 'accepted' : 'declined');
}
