// client/src/api/authApi.js
// ------------------------------------------------------------
// Authentifizierungsfunktionen – Supabase-Logik zentral gekapselt
// ------------------------------------------------------------

import { supabase } from '../supabaseClient';

// Aktuelle Session holen
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// Realtime-Listener auf Session-Änderungen
export function onAuthStateChange(callback) {
  const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return subscription;
}

// Login
export async function login(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

// Registrierung
export async function register(email, password) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
}

// Logout
export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}