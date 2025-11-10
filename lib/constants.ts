const PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://students-api-oi6o.onrender.com";

export const REMOTE_API_BASE_URL =
  process.env.STUDENTS_API_BASE_URL ?? PUBLIC_API_BASE_URL;

export const INTERNAL_API_PATH = "/api/gateway";

export function getApiBaseUrl() {
  if (typeof window === "undefined") {
    return REMOTE_API_BASE_URL;
  }
  return INTERNAL_API_PATH;
}

export const AUTH_COOKIE_NAME =
  process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ?? "studentfy.token";

export const USER_STORAGE_KEY = "studentfy:user";

export const DEFAULT_ERROR_MESSAGE =
  "Hubo un problema inesperado. Inténtalo nuevamente en unos segundos.";
