/**
 * Quản lý Cookie an toàn cho Gemini API Key trên trình duyệt của người dùng.
 * Key chỉ được lưu trữ cục bộ tại máy khách, không lưu vào cơ sở dữ liệu server
 * và chỉ được sử dụng khi gọi API trực tiếp đến Google AI.
 */

const GEMINI_COOKIE_NAME = 'hanzideck_gemini_api_key';
const COOKIE_MAX_AGE_DAYS = 365;

export function getGeminiApiKeyFromCookie(): string {
  if (typeof document === 'undefined') return '';
  const nameEQ = `${GEMINI_COOKIE_NAME}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      try {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      } catch {
        return c.substring(nameEQ.length, c.length);
      }
    }
  }
  return '';
}

export function saveGeminiApiKeyToCookie(apiKey: string): void {
  if (typeof document === 'undefined') return;
  const trimmed = apiKey.trim();
  const d = new Date();
  d.setTime(d.getTime() + COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  // Lưu cookie với SameSite=Strict và Path=/
  document.cookie = `${GEMINI_COOKIE_NAME}=${encodeURIComponent(trimmed)};${expires};path=/;SameSite=Strict`;
}

export function removeGeminiApiKeyFromCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${GEMINI_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
}

export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return '';
  const first = apiKey.slice(0, 4);
  const last = apiKey.slice(-4);
  return `${first}${'*'.repeat(apiKey.length - 8)}${last}`;
}
