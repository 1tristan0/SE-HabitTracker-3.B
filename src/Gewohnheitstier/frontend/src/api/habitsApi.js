// client/src/api/habitsApi.js
// ------------------------------------------------------------
// Zentrale API-Schicht für alle Supabase-Abfragen rund um Habits
// (Separation of Concerns – keine DB-Logik in React-Komponenten)
// ------------------------------------------------------------
import { supabase } from '../supabaseClient';

// Hilfsfunktionen (nur intern hier)
const toISODate = (d) => new Date(d).toISOString().slice(0, 10);
const todayISO = () => new Date().toISOString().slice(0, 10);

export async function fetchHabits(userId) {
  const { data, error } = await supabase
    .from('habits_table')
    .select('id, habit_name, description, start_date, streak, last_checked, prev_last_checked, user_id')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addHabit({ userId, name, desc }) {
  const { error } = await supabase
    .from('habits_table')
    .insert({
      habit_name: name,
      description: desc,
      start_date: new Date().toISOString().slice(0, 10),
      user_id: userId,
      streak: 0,
      last_checked: null,
      prev_last_checked: [],
    });

  if (error) throw error;
}

export async function deleteHabit({ userId, id }) {
  const { error } = await supabase
    .from('habits_table')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

/**
 * Toggle Check/Uncheck (heutiger Status) – OHNE RPC
 * Ablauf:
 * 1) Zeile lesen
 * 2) prüfen, ob last_checked == heute
 * 3) Payload bauen
 * 4) Update + aktualisierte Zeile zurückgeben
 */
export async function toggleHabitToday({ habitId, userId }) {
  // 1) aktuelle Werte holen
  const { data: row, error: selErr } = await supabase
    .from('habits_table')
    .select('id, last_checked, prev_last_checked, streak')
    .eq('id', habitId)
    .eq('user_id', userId)
    .single();

  if (selErr) throw selErr;

  const currentStreak = Number(row?.streak || 0);
  const prevArray = Array.isArray(row?.prev_last_checked)
    ? row.prev_last_checked
    : row?.prev_last_checked
      ? [row.prev_last_checked].flat()
      : [];

  const lastIsToday =
    row?.last_checked ? toISODate(row.last_checked) === todayISO() : false;

  let payload;

  if (lastIsToday) {
    // UNCHECK: last_checked war heute -> rückgängig machen
    const prevLen = prevArray.length;
    const restored = prevLen ? prevArray[prevLen - 1] : null; // letzter Eintrag (voller Timestamp-String)
    payload = {
      last_checked: restored,                         // ggf. null
      prev_last_checked: prevLen ? prevArray.slice(0, -1) : [],
      streak: Math.max(0, currentStreak - 1),
    };
  } else {
    // CHECK: heute noch nicht gesetzt
    payload = {
      prev_last_checked: row?.last_checked
        ? [...prevArray, row.last_checked]           // bisherigen Wert anhängen
        : prevArray,
      last_checked: new Date().toISOString(),        // jetzt (Timestamp)
      streak: currentStreak + 1,
    };
  }

  // 4) Update und aktualisierte Zeile zurückgeben
  const { data: updated, error: updErr } = await supabase
    .from('habits_table')
    .update(payload)
    .eq('id', habitId)
    .eq('user_id', userId)
    .select('id, habit_name, description, start_date, streak, last_checked, prev_last_checked, user_id')
    .single();

  if (updErr) throw updErr;
  return updated;
}