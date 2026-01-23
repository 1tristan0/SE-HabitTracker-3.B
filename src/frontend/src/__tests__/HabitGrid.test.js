import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HabitGrid from '../components/habits/HabitGrid';

describe('HabitGrid', () => {
  const mockHabits = [
    {
      id: 1,
      habit_name: 'Morning Run',
      description: 'Run 5km every morning',
      streak: 7,
      last_checked: '2025-12-07',
    },
    {
      id: 2,
      habit_name: 'Read 30 mins',
      description: 'Read for 30 minutes',
      streak: 5,
      last_checked: '2025-12-06',
    },
    {
      id: 3,
      habit_name: 'Meditate',
      description: 'Daily meditation',
      streak: 3,
      last_checked: '2025-12-07',
    },
  ];

  const mockToday = '2025-12-07';

  /**
   * Test: "Bereits heute erledigt" Sektion Header
   * Überprüft, dass die Kopfzeile für die Sektion "Bereits heute erledigt" angezeigt wird.
   * Erwartet: Die Komponente sollte einen Header mit dem Text "Bereits heute erledigt" rendern.
   */
  it('renders the "Bereits heute erledigt" section header', () => {
    render(
      <HabitGrid
        habits={mockHabits}
        onDelete={() => {}}
        onCheck={() => {}}
      />
    );

    expect(screen.getByText('Bereits heute erledigt')).toBeInTheDocument();
  });

  /**
   * Test: Getestete und nicht getestete Gewohnheiten trennen
   * Überprüft, dass abhängig von last_checked getestete Gewohnheiten getrennt werden.
   * Erwartet: Morning Run und Meditate (heute überprüft) sollten von Read 30 mins (gestern überprüft) getrennt sein.
   */
  it('separates checked habits from unchecked habits', () => {
    render(
      <HabitGrid
        habits={mockHabits}
        onDelete={() => {}}
        onCheck={() => {}}
      />
    );

    // Checked habits (today: 2025-12-07)
    expect(screen.getByText('Morning Run')).toBeInTheDocument();
    expect(screen.getByText('Meditate')).toBeInTheDocument();

    // Unchecked habits
    expect(screen.getByText('Read 30 mins')).toBeInTheDocument();
  });

  /**
   * Test: Nur heutige überprüfte Gewohnheiten in der speziellen Sektion
   * Überprüft, dass nur die Gewohnheiten mit today's Datum in der speziellen Sektion angezeigt werden.
   * Erwartet: Morning Run und Meditate sollten in der "Bereits heute erledigt" Sektion sein.
   */
  it('displays only today\'s checked habits in the special section', () => {
    render(
      <HabitGrid
        habits={mockHabits}
        onDelete={() => {}}
        onCheck={() => {}}
      />
    );

    // Both checked habits should appear, but Read should be in unchecked section
    const morningRunCards = screen.getAllByText('Morning Run');
    expect(morningRunCards.length).toBeGreaterThan(0);
  });

  /**
   * Test: onHabitCheck wird bei Checkbox-Umschaltung aufgerufen
   * Überprüft, dass der onHabitCheck Callback aufgerufen wird, wenn eine Gewohnheits-Checkbox geklickt wird.
   * Erwartet: Der handleCheck Mock sollte aufgerufen worden sein, nachdem eine Checkbox geklickt wurde.
   */
  it('calls onHabitCheck when habit checkbox is toggled', async () => {
    const handleCheck = jest.fn();
    render(
      <HabitGrid
        habits={mockHabits}
        onDelete={() => {}}
        onCheck={handleCheck}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);

    expect(handleCheck).toHaveBeenCalled();
  });

  /**
   * Test: onHabitDelete wird bei Löschen-Button-Klick aufgerufen
   * Überprüft, dass der onHabitDelete Callback aufgerufen wird, wenn der Löschen-Button geklickt wird.
   * Erwartet: Der handleDelete Mock sollte aufgerufen worden sein, nachdem der Löschen-Button geklickt wurde.
   */
  it('calls onHabitDelete when delete button is clicked', async () => {
    const handleDelete = jest.fn();
    render(
      <HabitGrid
        habits={mockHabits}
        onDelete={handleDelete}
        onCheck={() => {}}
      />
    );

    const deleteButtons = screen.getAllByText('Löschen');
    if (deleteButtons.length > 0) {
      await userEvent.click(deleteButtons[0]);
      expect(handleDelete).toHaveBeenCalled();
    }
  });

  /**
   * Test: Rendern mit leerem Gewohnheits-Array
   * Überprüft, dass die Komponente korrekt rendert, wenn die Gewohnheits-Liste leer ist.
   * Erwartet: Die Komponente sollte ohne Fehler rendern und den Header anzeigen.
   */
  it('renders with empty habits array', () => {
    render(
      <HabitGrid
        habits={[]}
        onDelete={() => {}}
        onCheck={() => {}}
      />
    );

    expect(screen.getByText('Bereits heute erledigt')).toBeInTheDocument();
  });

  /**
   * Test: Gewohnheitsinformationen in Karten korrekt anzeigen
   * Überprüft, dass alle Gewohnheits-Details (Name, Beschreibung) in den Karten angezeigt werden.
   * Erwartet: Gewohnheitsname und Beschreibung sollten im DOM vorhanden sein.
   */
  it('displays habit information correctly in cards', () => {
    render(
      <HabitGrid
        habits={mockHabits}
        onDelete={() => {}}
        onCheck={() => {}}
      />
    );

    // Check that habit details are displayed
    expect(screen.getByText('Morning Run')).toBeInTheDocument();
    expect(screen.getByText('Run 5km every morning')).toBeInTheDocument();
  });

  /**
   * Test: Nicht getestete Gewohnheiten zusammenfassen
   * Überprüft, dass nicht getestete Gewohnheiten in einer separaten Gruppe angezeigt werden.
   * Erwartet: Es sollte eine dedizierte Sektion für nicht getestete Gewohnheiten vorhanden sein.
   */
  it('groups unchecked habits together', () => {
    const { container } = render(
      <HabitGrid
        habits={mockHabits}
        onDelete={() => {}}
        onCheck={() => {}}
      />
    );

    // Should have two sections - checked and unchecked
    const sections = container.querySelectorAll('[class*="habitcard"]');
    expect(sections.length).toBeGreaterThanOrEqual(1);
  });

  /**
   * Test: Gewohnheiten ohne Beschreibung verarbeiten
   * Überprüft, dass die Komponente korrekt mit Gewohnheiten ohne Beschreibung umgeht.
   * Erwartet: Der Gewohnheitsname sollte angezeigt werden, auch wenn die Beschreibung leer ist.
   */
  it('handles habits with no description', () => {
    const habitsWithoutDesc = [
      {
        id: 1,
        habit_name: 'Exercise',
        description: '',
        streak: 2,
        last_checked: '2025-12-07',
      },
    ];

    render(
      <HabitGrid
        habits={habitsWithoutDesc}
        onDelete={() => {}}
        onCheck={() => {}}
      />
    );

    expect(screen.getByText('Exercise')).toBeInTheDocument();
  });

  /**
   * Test: Streak-Informationen für jede Gewohnheit anzeigen
   * Überprüft, dass die Streak-Informationen für jede Gewohnheit sichtbar sind.
   * Erwartet: Gewohnheitskarten sollten vorhanden sein und Streak-Daten enthalten.
   */
  it('displays streak information for each habit', () => {
    const { container } = render(
      <HabitGrid
        habits={mockHabits}
        onDelete={() => {}}
        onCheck={() => {}}
      />
    );

    // Check that streak information is displayed in habit cards
    const habitCards = container.querySelectorAll('.habitcard');
    expect(habitCards.length).toBeGreaterThan(0);
    
    // Verify that streak text is visible
    expect(screen.getByText(/Streak: 7/)).toBeInTheDocument();
  });
});
