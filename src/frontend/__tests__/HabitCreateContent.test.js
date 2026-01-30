import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HabitCreateContent from '../src/components/habits/HabitCreateContent';

describe('HabitCreateContent', () => {

  /**
   * Test: Submit-Button ist deaktiviert, wenn das Name-Feld leer ist.
   * Überprüft die Client-seitige Validierung.
   */
  it('disables submit button when name field is empty', () => {
    render(
      <HabitCreateContent
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Hinzufügen/i });
    expect(submitButton).toBeDisabled();
  });

  /**
   * Test: Submit-Button wird aktiviert, wenn Name eingegeben wird.
   * Überprüft, dass die Validierung korrekt funktioniert.
   */
  it('enables submit button when name is entered', async () => {
    render(
      <HabitCreateContent
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const nameInput = screen.getByLabelText(/Name der Gewohnheit/i);
    const submitButton = screen.getByRole('button', { name: /Hinzufügen/i });

    await userEvent.type(nameInput, 'Morning Jog');

    expect(submitButton).toBeEnabled();
  });

  /**
   * Test: Ruft onSubmit mit Name und Beschreibung auf, wenn das Formular abgesendet wird.
   * Überprüft, dass die Callback-Funktion mit den korrekten Daten aufgerufen wird.
   */
  it('calls onSubmit with name and description when form is submitted', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    const mockOnCancel = jest.fn();

    render(
      <HabitCreateContent
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByLabelText(/Name der Gewohnheit/i);
    const descriptionInput = screen.getByLabelText(/Beschreibung/i);
    const submitButton = screen.getByRole('button', { name: /Hinzufügen/i });

    await userEvent.type(nameInput, 'Morning Run');
    await userEvent.type(descriptionInput, 'Run 5km every morning');
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('Morning Run', 'Run 5km every morning');
  });


  /**
   * Test: Verhindert Submit, wenn nur Leerzeichen im Name-Feld eingegeben wurden.
   * Überprüft, dass die Validierung auch bei Whitespace-only greift.
   */
  it('prevents submit when name contains only whitespace', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

    render(
      <HabitCreateContent
        onSubmit={mockOnSubmit}
        onCancel={jest.fn()}
      />
    );

    const nameInput = screen.getByLabelText(/Name der Gewohnheit/i);
    const submitButton = screen.getByRole('button', { name: /Hinzufügen/i });

    await userEvent.type(nameInput, '   ');
    await userEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  /**
   * Test: Beschreibung ist optional - onSubmit wird auch ohne Beschreibung aufgerufen.
   * Überprüft, dass ein Habit nur mit Namen erstellt werden kann.
   */
  it('calls onSubmit with empty description when description is not provided', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

    render(
      <HabitCreateContent
        onSubmit={mockOnSubmit}
        onCancel={jest.fn()}
      />
    );

    const nameInput = screen.getByLabelText(/Name der Gewohnheit/i);
    const submitButton = screen.getByRole('button', { name: /Hinzufügen/i });

    await userEvent.type(nameInput, 'Daily Meditation');
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith('Daily Meditation', '');
  });


  /**
   * Test: Fehlerbehandlung bei fehlgeschlagenem onSubmit.
   * Überprüft, dass Fehler beim Submit abgefangen werden (console.error).
   */
  it('handles errors when onSubmit fails', async () => {
    const mockOnSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <HabitCreateContent
        onSubmit={mockOnSubmit}
        onCancel={jest.fn()}
      />
    );

    const nameInput = screen.getByLabelText(/Name der Gewohnheit/i);
    const submitButton = screen.getByRole('button', { name: /Hinzufügen/i });

    await userEvent.type(nameInput, 'Test Habit');
    await userEvent.click(submitButton);

    // Warten auf async Fehlerbehandlung
    await screen.findByLabelText(/Name der Gewohnheit/i);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to create habit:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
