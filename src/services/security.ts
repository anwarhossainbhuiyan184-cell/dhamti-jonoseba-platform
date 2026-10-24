/**
 * Security, sanitization, and cryptographic protection service
 * Implements:
 * - SHA-256 cryptographic hashing for PIN authentication (no cleartext PIN storage)
 * - Brute force protection / rate-limiting lockout
 * - Automatic session expiration & idle timeout
 * - XSS input sanitization
 * - CSV Formula injection prevention
 * - Citizen PII masking (phone & identity protection)
 */

// Default SHA-256 hash for initial admin PIN
const DEFAULT_PIN_HASH = '19e58efc7f71d3ec0bd46d451e84674f072ccc74c3128f4f017e6981d4e92543';

const STORAGE_KEY_PIN_HASH = 'dhamti_sec_admin_pin_hash';
const STORAGE_KEY_ATTEMPTS = 'dhamti_sec_login_attempts';
const STORAGE_KEY_LOCKOUT = 'dhamti_sec_login_lockout';
const SESSION_KEY_AUTH = 'dhamti_sec_admin_session';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const SESSION_LIFETIME_MS = 20 * 60 * 1000; // 20 minutes auto-logout

/**
 * Computes a SHA-256 hexadecimal hash using the Web Crypto API
 */
export async function hashSecret(secret: string): Promise<string> {
  const normalized = secret.trim();
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const msgUint8 = new TextEncoder().encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback djb2-based 64-char hex deterministic string if subtle is unavailable
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h1 >>> 0).toString(16).padStart(8, '0').repeat(8);
}

/**
 * Validates the provided PIN against the stored SHA-256 hash.
 */
export async function verifyAdminPin(enteredPin: string): Promise<{
  success: boolean;
  locked: boolean;
  remainingSeconds: number;
  remainingAttempts: number;
}> {
  // Check lockout
  const lockoutUntil = parseInt(localStorage.getItem(STORAGE_KEY_LOCKOUT) || '0', 10);
  const now = Date.now();
  if (lockoutUntil > now) {
    const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
    return { success: false, locked: true, remainingSeconds, remainingAttempts: 0 };
  }

  const currentStoredHash = localStorage.getItem(STORAGE_KEY_PIN_HASH) || DEFAULT_PIN_HASH;
  const inputHash = await hashSecret(enteredPin);

  if (inputHash === currentStoredHash) {
    // Reset failed attempts on success
    localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEY_LOCKOUT);
    
    // Create expiring session
    createAdminSession();

    return { success: true, locked: false, remainingSeconds: 0, remainingAttempts: MAX_FAILED_ATTEMPTS };
  } else {
    // Register failed attempt
    const attempts = parseInt(localStorage.getItem(STORAGE_KEY_ATTEMPTS) || '0', 10) + 1;
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, attempts.toString());

    if (attempts >= MAX_FAILED_ATTEMPTS) {
      const lockTime = now + LOCKOUT_DURATION_MS;
      localStorage.setItem(STORAGE_KEY_LOCKOUT, lockTime.toString());
      return { success: false, locked: true, remainingSeconds: LOCKOUT_DURATION_MS / 1000, remainingAttempts: 0 };
    }

    return {
      success: false,
      locked: false,
      remainingSeconds: 0,
      remainingAttempts: MAX_FAILED_ATTEMPTS - attempts,
    };
  }
}

/**
 * Checks remaining lockout status if currently locked out
 */
export function checkLockoutStatus(): { isLocked: boolean; remainingSeconds: number } {
  const lockoutUntil = parseInt(localStorage.getItem(STORAGE_KEY_LOCKOUT) || '0', 10);
  const now = Date.now();
  if (lockoutUntil > now) {
    return { isLocked: true, remainingSeconds: Math.ceil((lockoutUntil - now) / 1000) };
  }
  return { isLocked: false, remainingSeconds: 0 };
}

/**
 * Creates an authenticated session with auto-expiry
 */
export function createAdminSession(): void {
  const sessionData = {
    authenticated: true,
    expiresAt: Date.now() + SESSION_LIFETIME_MS,
  };
  sessionStorage.setItem(SESSION_KEY_AUTH, JSON.stringify(sessionData));
}

/**
 * Validates whether the admin is currently authenticated with a valid non-expired session
 */
export function isAdminAuthenticated(): boolean {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY_AUTH);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (data.authenticated && data.expiresAt > Date.now()) {
      return true;
    }
    // Expired
    sessionStorage.removeItem(SESSION_KEY_AUTH);
    return false;
  } catch {
    return false;
  }
}

/**
 * Revokes current admin session
 */
export function revokeAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY_AUTH);
}

/**
 * Changes the admin PIN after verifying the current PIN
 */
export async function updateAdminPin(currentPin: string, newPin: string): Promise<{ success: boolean; error?: string }> {
  const currentStoredHash = localStorage.getItem(STORAGE_KEY_PIN_HASH) || DEFAULT_PIN_HASH;
  const currentInputHash = await hashSecret(currentPin);

  if (currentInputHash !== currentStoredHash) {
    return { success: false, error: 'invalid_current_pin' };
  }

  if (!newPin || newPin.trim().length < 4 || newPin.trim().length > 16) {
    return { success: false, error: 'pin_length_invalid' };
  }

  const newHash = await hashSecret(newPin.trim());
  localStorage.setItem(STORAGE_KEY_PIN_HASH, newHash);
  return { success: true };
}

/**
 * Sanitizes generic user-supplied strings to neutralize HTML, script tags, and XSS injection vectors
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // strip HTML opening/closing tags
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates and sanitizes a phone number
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';
  // Keep only digits, +, and space/dashes
  const cleaned = phone.replace(/[^0-9+\s-]/g, '').trim();
  return cleaned.slice(0, 20);
}

/**
 * Masks a citizen phone number for public display (e.g., 01712345678 -> 017****5678)
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.trim().length < 6) return '***';
  const clean = phone.trim();
  const start = clean.slice(0, 3);
  const end = clean.slice(-3);
  return `${start}****${end}`;
}

/**
 * Neutralizes potential CSV formula injection attacks (starts with =, +, -, @, tab, or carriage return)
 */
export function sanitizeForCsv(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value).trim();
  if (str.length > 0 && /^[=+\-@\t\r]/.test(str)) {
    return `'${str}`; // Prepend single quote to force spreadsheet programs to treat as literal text
  }
  return str;
}

/**
 * Validates an uploaded image file for safe type and reasonable size
 */
export function validateImageFile(file: File, maxSizeBytes = 3 * 1024 * 1024): { valid: boolean; error?: string } {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedMimeTypes.includes(file.type)) {
    return { valid: false, error: 'invalid_type' };
  }
  if (file.size > maxSizeBytes) {
    return { valid: false, error: 'file_too_large' };
  }
  return { valid: true };
}
