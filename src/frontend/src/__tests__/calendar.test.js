import { isEveryHabitChecked, getCheckedHabiitsFromDay, getUncheckedHabitsFromDay } from '../lib/calendar';
import { dateOnlyBerlin } from '../lib/convert';
//Diese Tests prüfen die Kalenderfunktionen für Habit-Tracking aus der calendar.js Datei.
describe('Calendar Utilities', () => {
  const today = dateOnlyBerlin(new Date());
  const yesterday = dateOnlyBerlin(new Date(Date.now() - 86400000));

  const mockHabits = [
    {
      id: 1,
      habit_name: 'Habit 1',
      start_date: '2025-01-01',
      last_checked: today,
      prev_last_checked: [],
    },
    {
      id: 2,
      habit_name: 'Habit 2',
      start_date: '2025-01-01',
      last_checked: yesterday,
      prev_last_checked: [],
    },
    {
      id: 3,
      habit_name: 'Habit 3',
      start_date: today, // added today
      last_checked: null,
      prev_last_checked: [],
    },
  ];

  describe('isEveryHabitChecked', () => {
    it('returns 0 for empty habits array', () => {
      expect(isEveryHabitChecked([], today)).toBe(0);
    });

    it('returns 0 if no day provided', () => {
      expect(isEveryHabitChecked(mockHabits, null)).toBe(0);
    });

    it('returns true when all applicable habits are checked', () => {
      const habits = [
        {
          id: 1,
          habit_name: 'Habit 1',
          start_date: '2025-01-01',
          last_checked: today,
          prev_last_checked: [],
        },
      ];
      expect(isEveryHabitChecked(habits, today)).toBe(true);
    });

    it('returns percentage when some habits are checked', () => {
      // 1 out of 3 applicable habits checked = 33%
      const result = isEveryHabitChecked(mockHabits, today);
      expect(result).toBe(33);
    });

    it('only counts habits that existed on the queried day', () => {
      // For today: only habits 1 and 3 existed (habit 3 was added today)
      // Habit 1 is checked, habit 3 is not = 33%
      const result = isEveryHabitChecked(mockHabits, today);
      expect(result).toBe(33);
    });

    it('returns 0 when no habits are checked', () => {
      const habits = [
        {
          id: 1,
          habit_name: 'Habit 1',
          start_date: '2025-01-01',
          last_checked: null,
          prev_last_checked: [],
        },
      ];
      expect(isEveryHabitChecked(habits, today)).toBe(0);
    });
  });

  describe('getCheckedHabiitsFromDay', () => {
    it('returns only checked habits for a given day', () => {
      const result = getCheckedHabiitsFromDay(mockHabits, today);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('returns empty array when no habits are checked', () => {
      const result = getCheckedHabiitsFromDay(mockHabits, '2025-12-25');
      expect(result).toEqual([]);
    });

    it('only includes habits that existed on that day', () => {
      const result = getCheckedHabiitsFromDay(mockHabits, today);
      // Only habits 1 and 3 should be considered (3 was added today)
      // Only habit 1 is checked
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });
  });

  describe('getUncheckedHabitsFromDay', () => {
    it('returns only unchecked habits for a given day', () => {
      const result = getUncheckedHabitsFromDay(mockHabits, today);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(2);
    });

    it('returns empty array when all habits are checked', () => {
      const allChecked = mockHabits.map((h) => ({
        ...h,
        last_checked: today,
      }));
      const result = getUncheckedHabitsFromDay(allChecked, today);
      expect(result).toEqual([]);
    });
  });

  describe('prev_last_checked support', () => {
    it('recognizes checked status from prev_last_checked array', () => {
      const habit = {
        id: 1,
        habit_name: 'Habit',
        start_date: '2025-01-01',
        last_checked: null,
        prev_last_checked: [yesterday, today],
      };
      expect(isEveryHabitChecked([habit], today)).toBe(true);
    });

    it('recognizes checked status from JSON-encoded prev_last_checked', () => {
      const habit = {
        id: 1,
        habit_name: 'Habit',
        start_date: '2025-01-01',
        last_checked: null,
        prev_last_checked: JSON.stringify([yesterday, today]),
      };
      expect(isEveryHabitChecked([habit], today)).toBe(true);
    });

    it('recognizes checked status from comma-separated prev_last_checked', () => {
      const habit = {
        id: 1,
        habit_name: 'Habit',
        start_date: '2025-01-01',
        last_checked: null,
        prev_last_checked: `${yesterday}, ${today}`,
      };
      const result = isEveryHabitChecked([habit], today);
      expect(result).toBe(true);
    });
  });
});
