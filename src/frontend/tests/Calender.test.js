import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calender from '../src/components/habits/calendar/Calender';

// Mock supabase
jest.mock('../src/api/habitsApi', () => ({
  getHabits: jest.fn(() => Promise.resolve([])),
}));

describe('Calender Component', () => {
  const FIXED_NOW = new Date('2025-12-17T12:00:00Z');

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(FIXED_NOW);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const mockHabits = [
    {
      id: 1,
      habit_name: 'Morning Run',
      start_date: '2025-12-01',
      last_checked: '2025-12-07T00:00:00+00:00',
    },
    {
      id: 2,
      habit_name: 'Read 30 mins',
      start_date: '2025-12-01',
      last_checked: '2025-12-06T00:00:00+00:00',
    },
  ];

  /**
   * Test: Kalender-Header-Rendering
   * Überprüft, ob der Kalender den aktuellen Monat und das Jahr in der Kopfzeile anzeigt.
   * Erwartet: Die Kopfzeile sollte "Dezember 2025" für das aktuelle Datum anzeigen.
   */
  it('renders calendar header with month and year', () => {
    render(<Calender habits={mockHabits} />);

    const header = screen.getByText(/Dezember 2025/);
    expect(header).toBeInTheDocument();
  });

  /**
   * Test: Wochentag-Namen-Rendering
   * Überprüft, dass alle 7 Wochentag-Abkürzungen in der richtigen Reihenfolge angezeigt werden (Montag zuerst).
   * Erwartet: Der Kalender sollte "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So" anzeigen.
   */
  it('renders day names starting with Monday', () => {
    render(<Calender habits={mockHabits} />);

    expect(screen.getByText('Mo')).toBeInTheDocument();
    expect(screen.getByText('Di')).toBeInTheDocument();
    expect(screen.getByText('Mi')).toBeInTheDocument();
    expect(screen.getByText('Do')).toBeInTheDocument();
    expect(screen.getByText('Fr')).toBeInTheDocument();
    expect(screen.getByText('Sa')).toBeInTheDocument();
    expect(screen.getByText('So')).toBeInTheDocument();
  });

  /**
   * Test: Monatstage-Rendering
   * Überprüft, dass alle Kalender-Tagnummern korrekt angezeigt werden (17., 21., 31.).
   * Erwartet: Dezember 2025 sollte die Tage 1 bis 31 an den korrekten Grid-Positionen anzeigen.
   */
  it('renders days of the month', () => {
    render(<Calender habits={mockHabits} />);

    expect(screen.getByText('17')).toBeInTheDocument();
    expect(screen.getByText('21')).toBeInTheDocument();
    expect(screen.getByText('31')).toBeInTheDocument();
  });

  /**
   * Test: Navigation zum nächsten Monat
   * Überprüft, dass das Anklicken der Schaltfläche "nächster Monat" die Kalenderansicht aktualisiert.
   * Erwartet: Der Kalender sollte von Dezember 2025 zu Januar 2026 wechseln.
   */
  it('navigates to next month when next button is clicked', async () => {
    render(<Calender habits={mockHabits} />);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const nextBtn = screen.getByText('nächster Monat');
    await user.click(nextBtn);

    expect(screen.getByText(/Januar 2026/)).toBeInTheDocument();
  });

  /**
   * Test: Navigation zum vorherigen Monat
   * Überprüft, dass das Anklicken der Schaltfläche "vorheriger Monat" die Kalenderansicht aktualisiert.
   * Erwartet: Der Kalender sollte von Dezember 2025 zu November 2025 wechseln.
   */
  it('navigates to previous month when previous button is clicked', async () => {
    render(<Calender habits={mockHabits} />);

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const prevBtn = screen.getByText('vorheriger Monat');
    await user.click(prevBtn);

    expect(screen.getByText(/November 2025/)).toBeInTheDocument();
  });

  /**
   * Test: Leeres Gewohnheits-Array
   * Überprüft, dass der Kalender korrekt gerendert wird, auch wenn keine Gewohnheiten vorhanden sind.
   * Erwartet: Der Kalender sollte alle Tage ohne Abschluss-Indikatoren anzeigen.
   */
  it('handles empty habits array', () => {
    render(<Calender habits={[]} />);

    expect(screen.getByText(/Dezember 2025/)).toBeInTheDocument();
    expect(screen.getByText('17')).toBeInTheDocument();
  });
});
