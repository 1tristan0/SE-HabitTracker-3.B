// Neue API-Schicht: ruft nur noch das Backend auf, keine Supabase-Calls im Browser
import { apiFetch } from './httpClient';

const STORAGE_KEY = 'habittracker_session';

// Login-Funktion, die E-Mail und Passwort entgegennimmt und eine Anfrage an das Backend sendet
export async function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}
// Registrierungs-Funktion, die E-Mail und Passwort entgegennimmt und eine Anfrage an das Backend sendet
export async function register(email, password) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: { email, password },
  });
}
// Funktion zum Abrufen der aktuellen Sitzung basierend auf dem Zugriffstoken
export async function fetchSession(accessToken) {
  return apiFetch('/api/auth/session', {
    method: 'POST',
    body: { accessToken },
  });
}
// Logout-Funktion, die das Zugriffstoken entgegennimmt und eine Anfrage an das Backend sendet
export async function logout(accessToken) {
  return apiFetch('/api/auth/logout', {
    method: 'POST',
    body: { accessToken },
  });
}
// Funktion zum Speichern der Sitzung im lokalen Speicher
export function persistSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}
// Funktion zum Laden der Sitzung aus dem lokalen Speicher
export function loadSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Funktion zum Löschen der Sitzung aus dem lokalen Speicher
export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}
