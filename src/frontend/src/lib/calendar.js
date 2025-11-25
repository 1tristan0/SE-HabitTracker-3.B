import { dateOnlyBerlin as dateOnly } from "./convert";

// helper: whether a habit existed on a given day (based on start_date)
const habitExistedOnDay = (habit, day) => {
  // if no start_date provided, assume it existed
  if (!habit?.start_date) return true;
  try {
    const start = dateOnly(habit.start_date);
    return start <= day;
  } catch (e) {
    return true;
  }
};

export function getMonthMatrix(year, month) {
  // month: 0-11
  const firstOfMonth = new Date(year, month, 1);
  // getDay: 0 (Sun) .. 6 (Sat). Convert so Monday=0
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
export function isEveryHabitChecked(habits, day) {

  if (!Array.isArray(habits) || habits.length === 0) return 0; // keine Gewohnheiten
  if (!day) return 0; // kein Datum angegeben

  // only consider habits that existed on that day
  const applicable = habits.filter((h) => habitExistedOnDay(h, day));
  if (applicable.length === 0) return 0;

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
        // ignore parse error and fall back to comma split
      }
      const parts = prev.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) return parts.some((ts) => dateOnly(ts) === d);
    }

    if (typeof prev === "object") {
      try {
        return Object.values(prev).some((ts) => dateOnly(ts) === d);
      } catch (e) {
        return false;
      }
    }

    return false;
  };

  const completedCount = applicable.reduce((acc, habit) => acc + (isHabitCheckedOn(habit, day) ? 1 : 0), 0);

  if (completedCount === applicable.length) return true;

  // return percentage rounded to nearest integer
  return Math.round((completedCount / applicable.length) * 100);
}

export function getCheckedHabiitsFromDay(habits, day) {
  if (!Array.isArray(habits) || habits.length === 0) return [];
  if (!day) return [];
  // only consider habits that existed on that day
  const applicable = habits.filter((h) => habitExistedOnDay(h, day));
  if (applicable.length === 0) return [];
  return applicable.filter((habit) => {
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
export function getUncheckedHabitsFromDay(habits, day) {
  if (!Array.isArray(habits) || habits.length === 0) return [];
  if (!day) return [];
  const applicable = habits.filter((h) => habitExistedOnDay(h, day));
  if (applicable.length === 0) return [];
  return applicable.filter((habit) => {
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
 * Calculates the number of days between two dates.
 * Both date1 and date2 can be Date objects or date strings in 'YYYY-MM-DD' format.
 * @param {*} date1 
 * @param {*} date2 
 * @returns 
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