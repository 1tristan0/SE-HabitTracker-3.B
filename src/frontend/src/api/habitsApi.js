// API-Schicht: alle Habit-Aufrufe laufen über das Backend
import { apiFetch } from './httpClient';

// Funktion zum Abrufen aller Habits für den authentifizierten Benutzer
export async function fetchHabits(token) {
  return apiFetch('/api/habits', { token });
}

// Funktion zum Hinzufügen eines neuen Habits für den authentifizierten Benutzer
export async function addHabit(token, { name, desc }) {
  return apiFetch('/api/habits', {
    method: 'POST',
    token,
    body: { name, desc },
  });
}
// Funktion zum Löschen eines Habits basierend auf der ID des Habits für den authentifizierten Benutzer
export async function deleteHabit(token, id) {
  return apiFetch(`/api/habits/${id}`, {
    method: 'DELETE',
    token,
  });
}

// Funktion zum Umschalten des Habits für heute basierend auf der ID des Habits für den authentifizierten Benutzer
export async function toggleHabitToday(token, habitId) {
  return apiFetch(`/api/habits/${habitId}/toggle`, {
    method: 'POST',
    token,
  });
}

// Funktion zum Aktualisieren eines Habits basierend auf der ID des Habits für den authentifizierten Benutzer
export async function updateHabit(token, id, { name, desc, start_date } = {}) {
  return apiFetch(`/api/habits/${id}`, {
    method: 'PUT',
    token,
    body: { name, desc, start_date },
  });
}