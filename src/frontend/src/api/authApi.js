// client/src/api/authApi.js
// Neue API-Schicht: ruft nur noch das Backend auf, keine Supabase-Calls im Browser
import { apiFetch } from './httpClient';

const STORAGE_KEY = 'habittracker_session';

export async function login(email, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function register(email, password) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: { email, password },
  });
}

export async function fetchSession(accessToken) {
  return apiFetch('/api/auth/session', {
    method: 'POST',
    body: { accessToken },
  });
}

export async function logout(accessToken) {
  return apiFetch('/api/auth/logout', {
    method: 'POST',
    body: { accessToken },
  });
}

export function persistSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function loadSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}
