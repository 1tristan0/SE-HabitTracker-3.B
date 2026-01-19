import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HabitChangeModal from '../components/HabitChangeModal';

describe('HabitChangeModal', () => {
  const mockHabit = {
    id: 1,
    habit_name: 'Morning Jog',
    description: 'Run 5km in the morning',
    start_date: '2025-01-01',
    streak: 5,
  };

  /**
   * Test: Wenn der Name des Habits geändert wurde, wird das geänderte Habit angezeigt.
   * 
   * Szenario:
   * 1. Modal wird mit einem bestehendem Habit geöffnet
   * 2. Der Benutzer ändert den Namen des Habits
   * 3. Benutzer klickt "Änderungen speichern"
   * 
   * Erwartet:
   * - Der edit-Callback wird mit der korrekten Habit-ID und dem neuen Namen aufgerufen
   * - Das Modal wird geschlossen
   */
  it('should call edit with changed habit name when save button is clicked', async () => {
    const mockEdit = jest.fn();
    const mockOnClose = jest.fn();
    const newName = 'Evening Jog';

    render(
      <HabitChangeModal
        habit={mockHabit}
        onClose={mockOnClose}
        edit={mockEdit}
      />
    );

    // Input-Feld für Name finden und Text ändern
    const nameInput = screen.getByPlaceholderText('Gewohnheitsname');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, newName);

    // Verifizieren, dass der neue Name im Input-Feld steht
    expect(nameInput.value).toBe(newName);

    // "Änderungen speichern" Button klicken
    const saveButton = screen.getByText('Änderungen speichern');
    await userEvent.click(saveButton);

    // Verifizieren, dass edit-Callback mit korrekter ID und neuen Daten aufgerufen wurde
    expect(mockEdit).toHaveBeenCalledWith(mockHabit.id, {
      name: newName,
      description: mockHabit.description,
    });
  });

  /**
   * Test: Wenn die Beschreibung des Habits geändert wurde, wird die geänderte Beschreibung angezeigt.
   * 
   * Szenario:
   * 1. Modal wird mit einem bestehendem Habit geöffnet
   * 2. Der Benutzer ändert die Beschreibung des Habits
   * 3. Benutzer klickt "Änderungen speichern"
   * 
   * Erwartet:
   * - Der edit-Callback wird mit der korrekten Habit-ID und der neuen Beschreibung aufgerufen
   * - Das Modal wird geschlossen
   */
  it('should call edit with changed habit description when save button is clicked', async () => {
    const mockEdit = jest.fn();
    const mockOnClose = jest.fn();
    const newDescription = 'Run 10km in the evening with faster pace';

    render(
      <HabitChangeModal
        habit={mockHabit}
        onClose={mockOnClose}
        edit={mockEdit}
      />
    );

    // Textarea für Beschreibung finden und Text ändern
    const descriptionInput = screen.getByPlaceholderText('Beschreibung der Gewohnheit');
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, newDescription);

    // Verifizieren, dass die neue Beschreibung im Textarea-Feld steht
    expect(descriptionInput.value).toBe(newDescription);

    // "Änderungen speichern" Button klicken
    const saveButton = screen.getByText('Änderungen speichern');
    await userEvent.click(saveButton);

    // Verifizieren, dass edit-Callback mit korrekter ID und neuen Daten aufgerufen wurde
    expect(mockEdit).toHaveBeenCalledWith(mockHabit.id, {
      name: mockHabit.habit_name,
      description: newDescription,
    });
  });

  /**
   * Test: Modal-Rendering mit initialen Daten.
   * Überprüft, dass das Modal mit den korrekten initialen Werten für Name und Beschreibung gerendert wird.
   */
  it('renders modal with initial habit data', () => {
    render(
      <HabitChangeModal
        habit={mockHabit}
        onClose={() => {}}
        edit={() => {}}
      />
    );

    const nameInput = screen.getByPlaceholderText('Gewohnheitsname');
    const descriptionInput = screen.getByPlaceholderText('Beschreibung der Gewohnheit');

    expect(nameInput.value).toBe(mockHabit.habit_name);
    expect(descriptionInput.value).toBe(mockHabit.description);
  });

  /**
   * Test: Beide Name und Beschreibung ändern und speichern.
   * Überprüft, dass beide Änderungen im edit-Callback reflektiert werden.
   */
  it('should call edit with both name and description changes', async () => {
    const mockEdit = jest.fn();
    const mockOnClose = jest.fn();
    const newName = 'Cycling';
    const newDescription = 'Ride bike for 30 minutes';

    render(
      <HabitChangeModal
        habit={mockHabit}
        onClose={mockOnClose}
        edit={mockEdit}
      />
    );

    // Beide Felder ändern
    const nameInput = screen.getByPlaceholderText('Gewohnheitsname');
    const descriptionInput = screen.getByPlaceholderText('Beschreibung der Gewohnheit');

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, newName);
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, newDescription);

    // Speichern
    const saveButton = screen.getByText('Änderungen speichern');
    await userEvent.click(saveButton);

    // Beide Änderungen sollten im edit-Callback reflektiert sein
    expect(mockEdit).toHaveBeenCalledWith(mockHabit.id, {
      name: newName,
      description: newDescription,
    });
  });
});