// client/src/api/habitsApi.js
// API-Schicht: alle Habit-Aufrufe laufen über das Backend
import { apiFetch } from './httpClient';

export async function fetchHabits(token) {
  return apiFetch('/api/habits', { token });
}

export async function addHabit(token, { name, desc }) {
  return apiFetch('/api/habits', {
    method: 'POST',
    token,
    body: { name, desc },
  });
}

export async function deleteHabit(token, id) {
  return apiFetch(`/api/habits/${id}`, {
    method: 'DELETE',
    token,
  });
}

export async function toggleHabitToday(token, habitId) {
  return apiFetch(`/api/habits/${habitId}/toggle`, {
    method: 'POST',
    token,
  });
}
