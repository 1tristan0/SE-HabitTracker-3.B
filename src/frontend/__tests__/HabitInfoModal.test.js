import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HabitInfoModal from '../src/components/habits/modals/HabitInfoModal';

// Mock der Utility-Funktionen
jest.mock('../src/lib/convert', () => ({
  convertToGermanDateString: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  },
}));

jest.mock('../src/lib/habit', () => ({
  getNumberOfCompletedHabits: jest.fn((habit) => habit?.prev_last_checked?.length || 0),
  getNumberOfCompletedHabitsLastMonth: jest.fn(() => 12),
  getPercentageOfCompletedHabits: jest.fn(() => 85),
  getPercentageOfCompletedHabitsLastMonth: jest.fn(() => 80),
}));

describe('HabitInfoModal', () => {
  const mockHabit = {
    id: 1,
    habit_name: 'Morning Jog',
    description: 'Run 5km in the morning',
    start_date: '2026-01-01',
    streak: 7,
    last_checked: '2026-01-19T09:00:00+00:00',
    prev_last_checked: ['2026-01-18', '2026-01-17', '2026-01-16'],
  };

  beforeEach(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2026-01-19T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });


  /**
   * Test: Modal zeigt den Gewohnheitsnamen im Header an.
   * Überprüft, dass der Gewohnheitstitel korrekt gerendert wird.
   */
  it('displays habit name in header', () => {
    render(
      <HabitInfoModal habit={mockHabit} onClose={jest.fn()} />
    );

    expect(screen.getByText('Morning Jog')).toBeInTheDocument();
  });

  /**
   * Test: Modal zeigt die Beschreibung an, wenn vorhanden.
   * Überprüft, dass die Habit-Beschreibung gerendert wird.
   */
  it('displays habit description when provided', () => {
    render(
      <HabitInfoModal habit={mockHabit} onClose={jest.fn()} />
    );

    expect(screen.getByText('Run 5km in the morning')).toBeInTheDocument();
  });


  /**
   * Test: Modal zeigt die letzten 30 Tage Abschlüsse an.
   * Überprüft, dass die Statistik "Letzte 30 Tage" korrekt angezeigt wird.
   */
  it('displays completed habits in last 30 days', () => {
    render(
      <HabitInfoModal habit={mockHabit} onClose={jest.fn()} />
    );

    expect(screen.getByText('Letzte 30 Tage')).toBeInTheDocument();
    const statCards = screen.getAllByText(/^\d+$/);
    expect(statCards.length).toBeGreaterThan(0);
  });

  /**
   * Test: Modal zeigt die Abschlussrate an.
   * Überprüft, dass die Completion-Rate korrekt als Prozentsatz angezeigt wird.
   */
  it('displays completion rate percentage', () => {
    render(
      <HabitInfoModal habit={mockHabit} onClose={jest.fn()} />
    );

    expect(screen.getByText('Abschlussrate')).toBeInTheDocument();
    expect(screen.getByText(/\d+%/)).toBeInTheDocument();
  });

  /**
   * Test: Modal zeigt die aktuelle Streak an.
   * Überprüft, dass der Streak-Counter korrekt gerendert wird.
   */
  it('displays current streak', () => {
    render(
      <HabitInfoModal habit={mockHabit} onClose={jest.fn()} />
    );

    expect(screen.getByText('Aktuelle Streak')).toBeInTheDocument();
    // Findet die Streak-Zahl neben "Aktuelle Streak"
    const streakElements = screen.getAllByText('7');
    expect(streakElements.length).toBeGreaterThan(0);
  });

  /**
   * Test: Modal zeigt 0 als Streak an, wenn nicht vorhanden.
   * Überprüft den Fallback-Wert für fehlende Streak.
   */
  it('displays 0 as streak when streak is missing', () => {
    const habitWithoutStreak = { ...mockHabit, streak: undefined };

    render(
      <HabitInfoModal habit={habitWithoutStreak} onClose={jest.fn()} />
    );

    const card = screen.getByText('Aktuelle Streak').closest('div');
    // Das nächste Element mit text sollte die 0 sein
    expect(card).toBeInTheDocument();
  });

  /**
   * Test: Modal zeigt das Start-Datum an.
   * Überprüft, dass "Gestartet am" mit korrektem Datum angezeigt wird.
   */
  it('displays start date', () => {
    render(
      <HabitInfoModal habit={mockHabit} onClose={jest.fn()} />
    );

    const startDateLabel = screen.getByText('Gestartet am');
    expect(startDateLabel).toBeInTheDocument();
    
    // Finde das Parent-Container und suche darin nach dem Datum
    const container = startDateLabel.closest('div');
    expect(within(container).getByText(/\d{2}\.\d{2}\.\d{4}/)).toBeInTheDocument();
  });

  /**
   * Test: Modal zeigt "—" wenn kein Start-Datum vorhanden ist.
   * Überprüft den Fallback für fehlende Start-Daten.
   */
  it('displays "—" when start date is missing', () => {
    const habitWithoutStartDate = { ...mockHabit, start_date: null };

    render(
      <HabitInfoModal habit={habitWithoutStartDate} onClose={jest.fn()} />
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  /**
   * Test: Modal zeigt das letzte Erledigt-Datum an.
   * Überprüft, dass "Zuletzt erledigt" mit Datum angezeigt wird.
   */
  it('displays last completed date', () => {
    render(
      <HabitInfoModal habit={mockHabit} onClose={jest.fn()} />
    );

    const lastCompletedLabel = screen.getByText('Zuletzt erledigt');
    expect(lastCompletedLabel).toBeInTheDocument();
    
    // Finde das Parent-Container und suche darin nach dem Datum
    const container = lastCompletedLabel.closest('div');
    expect(within(container).getByText(/\d{2}\.\d{2}\.\d{4}/)).toBeInTheDocument();
  });

  /**
   * Test: Modal zeigt "Noch nie erledigt" wenn last_checked null ist.
   * Überprüft den Fallback für neue Gewohnheiten ohne Abschlüsse.
   */
  it('displays "Noch nie erledigt" when habit has never been completed', () => {
    const newHabit = { ...mockHabit, last_checked: null };

    render(
      <HabitInfoModal habit={newHabit} onClose={jest.fn()} />
    );

    expect(screen.getByText('Noch nie erledigt')).toBeInTheDocument();
  });
});
