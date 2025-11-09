import { dateOnly } from "./convert";

export function getMonthMatrix(year, month) {
  // month: 0-11
  const firstOfMonth = new Date(year, month, 1);
  // getDay: 0 (Sun) .. 6 (Sat). Convert so Monday=0
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const matrix = [];
  // start from Monday of the first week
  let dayCounter = 1 - firstWeekday;
  for (let week = 0; week < 6; week++) {
    const weekRow = [];
    for (let d = 0; d < 7; d++, dayCounter++) {
      let inMonth = dayCounter >= 1 && dayCounter <= daysInMonth;
      let dayNumber = dayCounter;
      let dateObj;
      if (!inMonth) {
        if (dayCounter < 1) {
          // previous month
          dayNumber = prevMonthDays + dayCounter;
          dateObj = new Date(year, month - 1, dayNumber);
        } else {
          // next month
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
  if (!Array.isArray(habits) || habits.length === 0) return false;
  if (!day) return false;

  return habits.every((habit) => {
    // Match last_checked
    if (dateOnly(habit.last_checked) === day) return true;

    const prev = habit.prev_last_checked;
    if (!prev) return false;

    // If array
    if (Array.isArray(prev)) {
      return prev.some((ts) => dateOnly(ts) === day);
    }

    // If string - try JSON parse (array), then comma-split
    if (typeof prev === "string") {
      try {
        const parsed = JSON.parse(prev);
        if (Array.isArray(parsed)) return parsed.some((ts) => dateOnly(ts) === day);
      } catch (e) {
        // ignore
      }
      const parts = prev.split(",").map((s) => s.trim()).filter(Boolean);
      if (parts.length) return parts.some((ts) => dateOnly(ts) === day);
    }

    // If object-like, check values
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