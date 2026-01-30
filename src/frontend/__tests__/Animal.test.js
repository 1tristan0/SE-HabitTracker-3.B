import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Animal from '../src/components/animal/Animal';

describe('Animal', () => {
  /**
   * Test: Begleiter zeigt positives (glückliches) Bild, wenn animalMood "gluecklich" ist.
   * 
   * Szenario:
   * - Benutzer hat mindestens ein Habit heute erfüllt
   * - animalMood ist "gluecklich"
   * 
   * Erwartet:
   * - Das normale Bild des Begleiters wird angezeigt (z.B. /images/cat(1).png)
   * - Das traurige Bild wird NICHT verwendet
   */
  it('displays happy companion image when at least one habit is completed', () => {
    render(
      <Animal
        selectedAnimal="katze"
        onClick={jest.fn()}
        animalMood="gluecklich"
      />
    );

    const image = screen.getByAltText('katze');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/cat(1).png');
  });

  /**
   * Test: Begleiter zeigt negatives (trauriges) Bild, wenn animalMood "traurig" ist.
   * 
   * Szenario:
   * - Benutzer hat noch kein Habit heute erfüllt
   * - animalMood ist "traurig"
   * 
   * Erwartet:
   * - Das traurige Bild des Begleiters wird angezeigt (z.B. /images/Katze_unhappy.png)
   */
  it('displays sad companion image when no habits are completed', () => {
    render(
      <Animal
        selectedAnimal="katze"
        onClick={jest.fn()}
        animalMood="traurig"
      />
    );

    const image = screen.getByAltText('katze');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/Katze_unhappy.png');
  });


  /**
   * Test: Klick auf Begleiter ruft onClick-Callback auf.
   */
  it('calls onClick when companion is clicked', async () => {
    const mockOnClick = jest.fn();

    render(
      <Animal
        selectedAnimal="katze"
        onClick={mockOnClick}
        animalMood="gluecklich"
      />
    );

    const button = screen.getByRole('button', { name: /Begleiter auswählen/i });
    await userEvent.click(button);

    expect(mockOnClick).toHaveBeenCalled();
  });

});
