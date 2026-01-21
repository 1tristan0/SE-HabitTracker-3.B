import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarModal from '../components/habits/calendar/modals/CalendarModal';

describe('CalendarModal', () => {
  const mockCheckedHabits = [
    { id: 1, habit_name: 'Morning Run' },
    { id: 2, habit_name: 'Read 30 mins' },
  ];

  const mockUncheckedHabits = [
    { id: 3, habit_name: 'Meditate' },
  ];

  /**
   * Testet das Rendern des Modals mit dem ausgewählten Datum im Titel.
   * Überprüft, dass das Datum im Modaltitel korrekt angezeigt wird.
   */
  it('renders with title showing selected date', () => {
    render(
      <CalendarModal
        selected="2025-12-07"
        checkedHabits={mockCheckedHabits}
        uncheckedHabits={mockUncheckedHabits}
        setOpenModal={() => {}}
      />
    );

    expect(screen.getByText(/Details für den 07.12.2025/)).toBeInTheDocument();
  });

  /**
   * Testet die Anzeige der erledigten Gewohnheiten im "Erledigt"-Bereich.
   * Überprüft, dass die checked-Gewohnheiten korrekt rendern.
   */
  it('displays checked habits in the "Erledigt" section', () => {
    render(
      <CalendarModal
        selected="2025-12-07"
        checkedHabits={mockCheckedHabits}
        uncheckedHabits={mockUncheckedHabits}
        setOpenModal={() => {}}
      />
    );

    expect(screen.getByText('Morning Run')).toBeInTheDocument();
    expect(screen.getByText('Read 30 mins')).toBeInTheDocument();
  });

  /**
   * Testet die Anzeige der nicht erledigten Gewohnheiten im "Nicht erledigt"-Bereich.
   * Überprüft, dass die unchecked-Gewohnheiten korrekt rendern.
   */
  it('displays unchecked habits in the "Nicht erledigt" section', () => {
    render(
      <CalendarModal
        selected="2025-12-07"
        checkedHabits={mockCheckedHabits}
        uncheckedHabits={mockUncheckedHabits}
        setOpenModal={() => {}}
      />
    );

    expect(screen.getByText('Meditate')).toBeInTheDocument();
  });

  /**
   * Testet die Anzeige eines leeren Zustands für erledigte Gewohnheiten.
   * Überprüft, dass eine Fallback-Nachricht angezeigt wird, wenn die checked-Liste leer ist.
   */
  it('shows empty state for checked habits when array is empty', () => {
    render(
      <CalendarModal
        selected="2025-12-07"
        checkedHabits={[]}
        uncheckedHabits={mockUncheckedHabits}
        setOpenModal={() => {}}
      />
    );

    expect(screen.getByText(/Keine Habits wurden an diesem Tag erledigt/)).toBeInTheDocument();
  });

  /**
   * Testet die Anzeige eines leeren Zustands für nicht erledigte Gewohnheiten.
   * Überprüft, dass eine Fallback-Nachricht angezeigt wird, wenn die unchecked-Liste leer ist.
   */
  it('shows empty state for unchecked habits when array is empty', () => {
    render(
      <CalendarModal
        selected="2025-12-07"
        checkedHabits={mockCheckedHabits}
        uncheckedHabits={[]}
        setOpenModal={() => {}}
      />
    );

    expect(screen.getByText(/Keine Habits wurden an diesem Tag nicht erledigt/)).toBeInTheDocument();
  });

  /**
   * Testet, dass der setOpenModal-Callback aufgerufen wird, wenn der Schließen-Button geklickt wird.
   * Überprüft die korrekte Auslösung des Modal-Schließens mit Parameter false.
   */
  it('calls setOpenModal when close button is clicked', async () => {
    const handleClose = jest.fn();
    render(
      <CalendarModal
        selected="2025-12-07"
        checkedHabits={mockCheckedHabits}
        uncheckedHabits={mockUncheckedHabits}
        setOpenModal={handleClose}
      />
    );

    const closeBtn = screen.getByText('Schließen');
    await userEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalledWith(false);
  });
});
