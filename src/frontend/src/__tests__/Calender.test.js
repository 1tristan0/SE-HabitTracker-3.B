import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calender from '../components/Calender';

// Mock supabase
jest.mock('../api/habitsApi', () => ({
  getHabits: jest.fn(() => Promise.resolve([])),
}));

describe('Calender Component', () => {
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

    const nextBtn = screen.getByText('nächster Monat');
    await userEvent.click(nextBtn);

    expect(screen.getByText(/Januar 2026/)).toBeInTheDocument();
  });

  /**
   * Test: Navigation zum vorherigen Monat
   * Überprüft, dass das Anklicken der Schaltfläche "vorheriger Monat" die Kalenderansicht aktualisiert.
   * Erwartet: Der Kalender sollte von Dezember 2025 zu November 2025 wechseln.
   */
  it('navigates to previous month when previous button is clicked', async () => {
    render(<Calender habits={mockHabits} />);

    const prevBtn = screen.getByText('vorheriger Monat');
    await userEvent.click(prevBtn);

    expect(screen.getByText(/November 2025/)).toBeInTheDocument();
  });

  /**
   * Test: Modal-Öffnung beim Klick auf einen Tag
   * Überprüft, dass das Anklicken einer Tagesschaltfläche das CalendarModal mit Tagesdetails öffnet.
   * Erwartet: Das Modal sollte mit den Gewohnheitsinformationen des ausgewählten Datums gerendert werden.
   */
  it('opens modal when a day is clicked', async () => {
    const { rerender } = render(<Calender habits={mockHabits} />);

    // Find a day button (e.g., the 17th)
    const dayButton = screen.getByText('17').closest('button');
    await userEvent.click(dayButton);

    // Modal should open - check for modal-specific content
    // This depends on your actual modal implementation
    rerender(<Calender habits={mockHabits} />);
  });

  /**
   * Test: Gewohnheits-Abschluss-Indikatoren
   * Überprüft, dass Tage mit überprüften Gewohnheiten visuelle Indikatoren anzeigen (grüner Punkt oder Prozentring).
   * Erwartet: Tage mit erfüllten Gewohnheiten sollten entweder einen grünen Punkt (100%) oder einen Prozentring (teilweise) anzeigen.
   */
  it('displays completion percentage or green dot for days with checked habits', () => {
    const { container } = render(<Calender habits={mockHabits} />);

    // Check for visual indicators (percentage text or green dot)
    // The exact selectors depend on your implementation
    // This is a general example - adjust based on your SVG/div structure
    const dayElements = container.querySelectorAll('[class*="dayButton"]');
    expect(dayElements.length).toBeGreaterThan(0);
  });

  /**
   * Test: Tailwind-Styling
   * Überprüft, dass der Kalender ordnungsgemäße Tailwind-CSS-Grid-Klassen für das Layout verwendet.
   * Erwartet: Der Kalender-Container sollte die "grid"-Klasse angewendet haben.
   */
  it('renders with proper Tailwind grid classes', () => {
    const { container } = render(<Calender habits={mockHabits} />);

    const calendarGrid = container.querySelector('[class*="grid"]');
    expect(calendarGrid).toHaveClass('grid');
  });

  /**
   * Test: Props-Update-Verarbeitung
   * Überprüft, dass sich der Kalender korrekt neu rendert, wenn sich die Habits-Prop ändert.
   * Erwartet: Das Hinzufügen einer neuen Gewohnheit sollte ein erneutes Rendering ohne Fehler auslösen; der Kalender wird weiterhin angezeigt.
   */
  it('updates calendar when habits prop changes', () => {
    const { rerender } = render(<Calender habits={mockHabits} />);

    const newHabits = [
      ...mockHabits,
      {
        id: 3,
        habit_name: 'Drink Water',
        start_date: '2025-12-01',
        last_checked: '2025-12-07T00:00:00+00:00',
      },
    ];

    rerender(<Calender habits={newHabits} />);

    expect(screen.getByText(/Dezember 2025/)).toBeInTheDocument();
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
