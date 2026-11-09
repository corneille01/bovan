import { Booking, UserAccount, NotificationLog } from '../types';
import { 
  directFetchBookings, 
  directSaveBooking, 
  directPatchBooking, 
  directFetchUsers, 
  directUpdateUserProfile, 
  directPostNotification, 
  directFetchNotifications, 
  directSendAuthCode, 
  directVerifyAuthCode 
} from './neonDirect';

export interface ApiStatus {
  status: string;
  neonConnected: boolean;
  database: string;
  message: string;
}

export async function fetchApiStatus(): Promise<ApiStatus> {
  try {
    const res = await fetch('/api/status');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Static host without backend');
  } catch {
    return {
      status: 'ok',
      neonConnected: true,
      database: 'Neon PostgreSQL (Direct Client Driver)',
      message: 'Connecté directement à Neon DB via driver HTTP Serverless'
    };
  }
}

export async function fetchBookingsFromApi(): Promise<Booking[]> {
  try {
    const res = await fetch('/api/bookings');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Static host fallback');
  } catch (e) {
    console.warn('[API] Connecting directly to Neon DB for bookings...');
    return await directFetchBookings();
  }
}

export async function saveBookingToApi(booking: Booking): Promise<boolean> {
  try {
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      return Boolean(data.success);
    }
    throw new Error('Static host fallback');
  } catch (e) {
    console.warn('[API] Saving booking directly to Neon DB...');
    return await directSaveBooking(booking);
  }
}

export async function patchBookingOnApi(id: string, status?: string, regieNotes?: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, regieNotes })
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return res.ok;
    }
    throw new Error('Static host fallback');
  } catch (e) {
    console.warn('[API] Patching booking directly in Neon DB...');
    return await directPatchBooking(id, status, regieNotes);
  }
}

export async function fetchUsersFromApi(): Promise<UserAccount[]> {
  try {
    const res = await fetch('/api/users');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Static host fallback');
  } catch (e) {
    console.warn('[API] Connecting directly to Neon DB for users...');
    return await directFetchUsers();
  }
}

export async function updateUserProfileOnApi(identifier: string, userData: Partial<UserAccount>): Promise<{ success: boolean; user?: UserAccount; message?: string }> {
  try {
    const res = await fetch(`/api/users/${encodeURIComponent(identifier)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Static host fallback');
  } catch (e) {
    console.warn('[API] Updating user profile directly in Neon DB...');
    return await directUpdateUserProfile(identifier, userData);
  }
}

export async function sendAuthCodeViaApi(identifier: string): Promise<{ success: boolean; message: string; simulatedCode?: string }> {
  try {
    const res = await fetch('/api/auth/send-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier })
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Static host fallback');
  } catch (e: any) {
    console.warn('[API] Sending auth code directly via Neon DB...');
    return await directSendAuthCode(identifier);
  }
}

export async function verifyAuthCodeViaApi(identifier: string, code: string): Promise<{ success: boolean; user?: UserAccount; error?: string }> {
  try {
    const res = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, code })
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Static host fallback');
  } catch (e: any) {
    console.warn('[API] Verifying auth code directly via Neon DB...');
    return await directVerifyAuthCode(identifier, code);
  }
}

export async function postNotificationLog(notif: NotificationLog): Promise<void> {
  try {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notif)
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return;
    }
    throw new Error('Static host fallback');
  } catch {
    console.warn('[API] Posting notification log directly to Neon DB...');
    await directPostNotification(notif);
  }
}

export async function fetchNotificationsFromApi(): Promise<NotificationLog[]> {
  try {
    const res = await fetch('/api/notifications');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      return await res.json();
    }
    throw new Error('Static host fallback');
  } catch (e) {
    console.warn('[API] Fetching notifications directly from Neon DB...');
    return await directFetchNotifications();
  }
}
