import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Begleiter from '../components/Begleiter';

describe('Begleiter', () => {
  /**
   * Test: Begleiter zeigt positives (glückliches) Bild, wenn begleiterMood "gluecklich" ist.
   * 
   * Szenario:
   * - Benutzer hat mindestens ein Habit heute erfüllt
   * - begleiterMood ist "gluecklich"
   * 
   * Erwartet:
   * - Das normale Bild des Begleiters wird angezeigt (z.B. /images/cat(1).png)
   * - Das traurige Bild wird NICHT verwendet
   */
  it('displays happy companion image when at least one habit is completed', () => {
    render(
      <Begleiter
        selectedBegleiter="katze"
        onClick={jest.fn()}
        begleiterMood="gluecklich"
      />
    );

    const image = screen.getByAltText('katze');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/cat(1).png');
  });

  /**
   * Test: Begleiter zeigt negatives (trauriges) Bild, wenn begleiterMood "traurig" ist.
   * 
   * Szenario:
   * - Benutzer hat noch kein Habit heute erfüllt
   * - begleiterMood ist "traurig"
   * 
   * Erwartet:
   * - Das traurige Bild des Begleiters wird angezeigt (z.B. /images/Katze_unhappy.png)
   */
  it('displays sad companion image when no habits are completed', () => {
    render(
      <Begleiter
        selectedBegleiter="katze"
        onClick={jest.fn()}
        begleiterMood="traurig"
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
      <Begleiter
        selectedBegleiter="katze"
        onClick={mockOnClick}
        begleiterMood="gluecklich"
      />
    );

    const button = screen.getByRole('button', { name: /Begleiter auswählen/i });
    await userEvent.click(button);

    expect(mockOnClick).toHaveBeenCalled();
  });

});