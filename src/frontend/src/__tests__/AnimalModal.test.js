import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnimalModal from '../components/animal/modals/AnimalModal';
import { setAnimal } from '../api/userApi';

// Mock der API
jest.mock('../api/userApi', () => ({
  setAnimal: jest.fn(),
}));

describe('AnimalModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSelect = jest.fn();
  const mockToken = 'test-token-123';
  const mockAnimalMood = 'gluecklich';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: Modal rendert mit allen verfügbaren Begleitern.
   * Überprüft, dass alle vier Tiere (Katze, Hund, Wurm, Hamster) angezeigt werden.
   */
  it('renders modal with all available companions', () => {
    render(
      <AnimalModal
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        animalMood={mockAnimalMood}
        token={mockToken}
      />
    );

    expect(screen.getByText('Wähle deinen Begleiter aus')).toBeInTheDocument();
    expect(screen.getByAltText('Katze')).toBeInTheDocument();
    expect(screen.getByAltText('Hund')).toBeInTheDocument();
    expect(screen.getByAltText('Wurm')).toBeInTheDocument();
    expect(screen.getByAltText('Hamster')).toBeInTheDocument();
  });

  /**
   * Test: Klick auf ein Tier wählt es aus und zeigt visuelles Feedback.
   * Überprüft, dass die ring-4 Klasse hinzugefügt wird.
   */
  it('selects companion when image is clicked', async () => {
    render(
      <AnimalModal
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        animalMood={mockAnimalMood}
        token={mockToken}
      />
    );

    const katzeImage = screen.getByAltText('Katze');
    await userEvent.click(katzeImage);

    expect(katzeImage).toHaveClass('ring-4', 'ring-primary4');
  });

  /**
   * Test: Auswahl wechseln zwischen verschiedenen Tieren.
   * Überprüft, dass nur das zuletzt ausgewählte Tier markiert ist.
   */
  it('changes selection when different companion is clicked', async () => {
    render(
      <AnimalModal
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        animalMood={mockAnimalMood}
        token={mockToken}
      />
    );

    const katzeImage = screen.getByAltText('Katze');
    const hundImage = screen.getByAltText('Hund');

    // Erst Katze auswählen
    await userEvent.click(katzeImage);
    expect(katzeImage).toHaveClass('ring-4', 'ring-primary4');

    // Dann Hund auswählen
    await userEvent.click(hundImage);
    expect(hundImage).toHaveClass('ring-4', 'ring-primary4');
    expect(katzeImage).not.toHaveClass('ring-4', 'ring-primary4');
  });

  /**
   * Test: Speichern-Button ruft setAnimal API mit korrekten Parametern auf.
   * Überprüft, dass die API mit token, animalType und animalMood aufgerufen wird.
   */
  it('calls setAnimal API when save button is clicked with selection', async () => {
    setAnimal.mockResolvedValue({ animal_type: 'katze' });

    render(
      <AnimalModal
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        animalMood={mockAnimalMood}
        token={mockToken}
      />
    );

    const katzeImage = screen.getByAltText('Katze');
    await userEvent.click(katzeImage);

    const saveButton = screen.getByText('Speichern');
    await userEvent.click(saveButton);

    expect(setAnimal).toHaveBeenCalledWith(mockToken, 'katze', mockAnimalMood);
  });



  /**
   * Test: Speichern ohne Auswahl schließt das Modal ohne API-Aufruf.
   */
  it('closes modal without API call when save is clicked without selection', async () => {
    render(
      <AnimalModal
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        animalMood={mockAnimalMood}
        token={mockToken}
      />
    );

    const saveButton = screen.getByText('Speichern');
    await userEvent.click(saveButton);

    expect(setAnimal).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  /**
   * Test: Close-Button (X) schließt das Modal ohne zu speichern.
   */
  it('calls onClose when close button (X) is clicked without saving', async () => {
    render(
      <AnimalModal
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        animalMood={mockAnimalMood}
        token={mockToken}
      />
    );

    const closeButton = screen.getByLabelText('Schließen');
    await userEvent.click(closeButton);

    expect(setAnimal).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  /**
   * Test: Fehlerbehandlung bei API-Fehler.
   * Überprüft, dass Fehler geloggt werden.
   */
  it('handles API error gracefully and closes modal', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    setAnimal.mockRejectedValue(new Error('Network error'));

    render(
      <AnimalModal
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        animalMood={mockAnimalMood}
        token={mockToken}
      />
    );

    const hamsterImage = screen.getByAltText('Hamster');
    await userEvent.click(hamsterImage);

    const saveButton = screen.getByText('Speichern');
    await userEvent.click(saveButton);

    // Warten auf async Operation
    await screen.findByText('Wähle deinen Begleiter aus');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Fehler beim Speichern des Begleiters:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });



  /**
   * Test: onSelect wird nicht aufgerufen bei API-Fehler.
   */
  it('does not call onSelect when API fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    setAnimal.mockRejectedValue(new Error('API Error'));

    render(
      <AnimalModal
        onClose={mockOnClose}
        onSelect={mockOnSelect}
        animalMood={mockAnimalMood}
        token={mockToken}
      />
    );

    const katzeImage = screen.getByAltText('Katze');
    await userEvent.click(katzeImage);

    const saveButton = screen.getByText('Speichern');
    await userEvent.click(saveButton);

    // Warten auf async Operation
    await screen.findByText('Wähle deinen Begleiter aus');

    expect(mockOnSelect).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});