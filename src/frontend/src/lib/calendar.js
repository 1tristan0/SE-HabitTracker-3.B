import { dateOnly } from "./convert";
/**
 * Generiert eine Matrix für die Anzeige eines Monatskalenders.
 * Jede Woche ist eine Zeile, jeder Tag eine Spalte.
 * Tage außerhalb des Monats sind ebenfalls enthalten, um volle Wochen darzustellen.
 * @param {number} year - Das Jahr (z.B. 2024)
 * @param {number} month - Der Monat (0-11, wobei 0 = Januar, 11 = Dezember)
 * @returns {Array<Array<{date: Date, day: number, inMonth: boolean}>>} Eine Matrix von Wochen und Tagen
 */
export function getMonthMatrix(year, month) {
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const matrix = [];
  // starte am Montag der ersten Woche
  let dayCounter = 1 - firstWeekday;
  for (let week = 0; week < 6; week++) {
    const weekRow = [];
    for (let d = 0; d < 7; d++, dayCounter++) {
      let inMonth = dayCounter >= 1 && dayCounter <= daysInMonth;
      let dayNumber = dayCounter;
      let dateObj;
      if (!inMonth) {
        if (dayCounter < 1) {
          // vorheriger Monat
          dayNumber = prevMonthDays + dayCounter;
          dateObj = new Date(year, month - 1, dayNumber);
        } else {
          // nächster Monat
          dayNumber = dayCounter - daysInMonth;
          dateObj = new Date(year, month + 1, dayNumber);
        }
      } else {
        dateObj = new Date(year, month, dayNumber);
      }

      weekRow.push({
        date: dateObj,
        day: dayNumber,
        inMonth,
      });
    }
    matrix.push(weekRow);
  }

  return matrix;
}
/**
 * Überprüft, ob alle Gewohnheiten an einem bestimmten Tag erledigt wurden.
 * Gibt true zurück, wenn alle erledigt sind, sonst den Prozentsatz der erledigten Gewohnheiten.
 * @param {Array} habits - Liste der Gewohnheiten
 * @param {string} day - Das Datum im Format 'YYYY-MM-DD'
 * @returns {boolean|number} true, wenn alle erledigt sind, sonst Prozentsatz (0-100)
 */
export function isEveryHabitChecked(habits, day) {

  if (!Array.isArray(habits) || habits.length === 0) return 0; // keine Gewohnheiten
  if (!day) return 0; // kein Datum angegeben
// Ein Habit soll nur ab seinem Startdatum zählen.
// Falls kein Startdatum gesetzt ist, behandeln wir es als "immer aktiv".
// Dadurch werden Habits nicht rückwirkend für frühere Tage als "nicht erledigt" gewertet.
  const isHabitActiveOn = (habit, d) => {
    const start = dateOnly(habit?.start_date);
    if (!start) return true;
    return start <= d;
  };

  const isHabitCheckedOn = (habit, d) => {
    if (dateOnly(habit.last_checked) === d) return true;

    const prev = habit.prev_last_checked;
    if (!prev) return false;

    if (Array.isArray(prev)) {
      return prev.some((ts) => dateOnly(ts) === d);
    }

    if (typeof prev === "string") {
      try {
        const parsed = JSON.parse(prev);
        if (Array.isArray(parsed)) return parsed.some((ts) => dateOnly(ts) === d);
      } catch (e) {
        console.error("Fehler beim Parsen des vorherigen Status:", e);
        // ignore parse error and fall back to comma split
      }
      const parts = prev.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) return parts.some((ts) => dateOnly(ts) === d);
    }

    if (typeof prev === "object") {
      try {
        return Object.values(prev).some((ts) => dateOnly(ts) === d);
      } catch (e) {
        console.error("Fehler beim Überprüfen des vorherigen Status:", e);
        return false;
      }
    }

    return false;
  };

  const activeHabits = habits.filter((habit) => isHabitActiveOn(habit, day));
  if (activeHabits.length === 0) return 0;

  const completedCount = activeHabits.reduce((acc, habit) => acc + (isHabitCheckedOn(habit, day) ? 1 : 0), 0);

  if (completedCount === activeHabits.length) return true;

  // return percentage rounded to nearest integer
  return Math.round((completedCount / activeHabits.length) * 100);
}
/**
 * Gibt die Liste der an einem bestimmten Tag erledigten Gewohnheiten zurück.
 * @param {Array} habits - Liste der Gewohnheiten
 * @param {string} day - Das Datum im Format 'YYYY-MM-DD'
 * @returns {Array} Liste der erledigten Gewohnheiten
 */
export function getCheckedHabiitsFromDay(habits, day) {
  if (!Array.isArray(habits) || habits.length === 0) return 0; // keine Gewohnheiten
  if (!day) return 0; // kein Datum angegeben
  return habits.filter((habit) => {
    const start = dateOnly(habit?.start_date);
    if (start && start > day) return false;
    if (dateOnly(habit.last_checked) === day) return true;
    const prev = habit.prev_last_checked;
    if (!prev) return false;
    if (Array.isArray(prev)) {
      return prev.some((ts) => dateOnly(ts) === day);
    }
    if (typeof prev === "string") {
      try {
        const parsed = JSON.parse(prev);
        if (Array.isArray(parsed)) return parsed.some((ts) => dateOnly(ts) === day);
      } catch (e) {
        // ignore parse error and fall back to comma split
      }
      const parts = prev.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) return parts.some((ts) => dateOnly(ts) === day);
    }
    if (typeof prev === "object") {
      try {
        return Object.values(prev).some((ts) => dateOnly(ts) === day);
      } catch (e) {
        return false;
      }
    }
    return false;
});
}
/**
 * Gibt die Liste der an einem bestimmten Tag nicht erledigten Gewohnheiten zurück.
 * @param {Array} habits - Liste der Gewohnheiten
 * @param {string} day - Das Datum im Format 'YYYY-MM-DD'
 * @returns {Array} Liste der nicht erledigten Gewohnheiten
 */
export function getUncheckedHabitsFromDay(habits, day) {
  if (!Array.isArray(habits) || habits.length === 0) return 0; // keine Gewohnheiten
  if (!day) return 0; // kein Datum angegeben
  return habits.filter((habit) => {
    const start = dateOnly(habit?.start_date);
    if (start && start > day) return false;
    if (dateOnly(habit.last_checked) === day) return false;
    const prev = habit.prev_last_checked;
    if (!prev) return true;
    if (Array.isArray(prev)) {
      return !prev.some((ts) => dateOnly(ts) === day);
    }
    if (typeof prev === "string") {
      try {
        const parsed = JSON.parse(prev);
        if (Array.isArray(parsed)) return !parsed.some((ts) => dateOnly(ts) === day);
      } catch (e) {
        // ignore parse error and fall back to comma split
      }
      const parts = prev.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) return !parts.some((ts) => dateOnly(ts) === day);
    }
    if (typeof prev === "object") {
      try {
        return !Object.values(prev).some((ts) => dateOnly(ts) === day);
      } catch (e) {
        return true;
      }
    }
    return true;
  });
}
/**
 * Berechnet die Anzahl der Tage zwischen zwei Daten.
 * @param {string|Date} date1 - Das erste Datum (Format 'YYYY-MM-DD' oder Date-Objekt)
 * @param {string|Date} date2 - Das zweite Datum (Format 'YYYY-MM-DD' oder Date-Objekt)
 * @returns {number|null} Anzahl der Tage zwischen den beiden Daten, oder null bei ungültigem Datum
 */
export function daysBetween(date1, date2) {
    try {
        const d1 = new Date(date1);
        const d2 = new Date(date2);

        if (isNaN(d1) || isNaN(d2)) {
            throw new Error("Invalid date format. Use 'YYYY-MM-DD' or a valid Date object.");
        }

        const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
        const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

        const msPerDay = 1000 * 60 * 60 * 24;
        return Math.floor((utc2 - utc1) / msPerDay);
    } catch (err) {
        console.error(err.message);
        return null;
    }
}
