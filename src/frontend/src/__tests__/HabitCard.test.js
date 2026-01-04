import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HabitCard from '../components/HabitCard';

describe('HabitCard', () => {
  const mockHabit = {
    id: 1,
    habit_name: 'Morning Jog',
    description: 'Run 5km in the morning',
    start_date: '2025-01-01',
    streak: 5,
    last_checked: null,
    prev_last_checked: [],
  };

  /**
   * Testet das Rendern des Gewohnheitsnamens und der Beschreibung.
   * Überprüft, dass beide Texte im DOM vorhanden sind.
   */
  it('renders habit name and description', () => {
    render(
      <HabitCard
        habit={mockHabit}
        onDelete={() => {}}
        onCheck={() => {}}
        onClick={() => {}}
      />
    );

    expect(screen.getByText('Morning Jog')).toBeInTheDocument();
    expect(screen.getByText('Run 5km in the morning')).toBeInTheDocument();
  });

  /**
   * Testet die Anzeige des Streak-Counters.
   * Überprüft, dass die Streak-Information korrekt angezeigt wird.
   */
  it('displays streak', () => {
    render(
      <HabitCard
        habit={mockHabit}
        onDelete={() => {}}
        onCheck={() => {}}
        onClick={() => {}}
      />
    );

    expect(screen.getByText(/Streak: 5/)).toBeInTheDocument();
  });

  /**
   * Testet, dass der onClick-Callback aufgerufen wird, wenn die Karte geklickt wird.
   * Überprüft die Event-Behandlung beim Klick auf die Karte.
   */
  it('calls onClick when card is clicked', async () => {
    const handleClick = jest.fn();
    render(
      <HabitCard
        habit={mockHabit}
        onDelete={() => {}}
        onCheck={() => {}}
        onClick={handleClick}
      />
    );

    const card = screen.getByText('Morning Jog').closest('.card');
    await userEvent.click(card);

    expect(handleClick).toHaveBeenCalled();
  });

  /**
   * Testet, dass der onDelete-Callback mit der korrekten Gewohnheits-ID aufgerufen wird.
   * Überprüft die Lösch-Funktionalität beim Klick auf den "Löschen"-Button.
   */
  it('calls onDelete when delete button is clicked', async () => {
    const handleDelete = jest.fn();
    render(
      <HabitCard
        habit={mockHabit}
        onDelete={handleDelete}
        onCheck={() => {}}
        onClick={() => {}}
      />
    );

    const deleteBtn = screen.getByText('Löschen');
    await userEvent.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledWith(1);
  });

  /**
   * Testet, dass der onCheck-Callback mit Gewohnheits-ID und neuen Zustand aufgerufen wird.
   * Überprüft die Checkbox-Toggle-Funktionalität und den Aufruf des Callbacks mit korrekten Parametern.
   */
  it('calls onCheck when checkbox is toggled', async () => {
    const handleCheck = jest.fn();
    render(
      <HabitCard
        habit={mockHabit}
        onDelete={() => {}}
        onCheck={handleCheck}
        onClick={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    expect(handleCheck).toHaveBeenCalledWith(1, true);
  });

  /**
   * Testet die Event-Propagation-Verhinderung beim Löschen-Button.
   * Überprüft, dass der Klick auf den Löschen-Button nicht den onClick-Callback der Karte auslöst.
   */
  it('does not trigger card click when delete button is clicked', async () => {
    const handleClick = jest.fn();
    const handleDelete = jest.fn();
    render(
      <HabitCard
        habit={mockHabit}
        onDelete={handleDelete}
        onCheck={() => {}}
        onClick={handleClick}
      />
    );

    const deleteBtn = screen.getByText('Löschen');
    await userEvent.click(deleteBtn);

    // Der Klick auf die Karte sollte nicht ausgelöst werden, wenn der Löschen-Button geklickt wird
    expect(handleClick).not.toHaveBeenCalled();
  });
});
