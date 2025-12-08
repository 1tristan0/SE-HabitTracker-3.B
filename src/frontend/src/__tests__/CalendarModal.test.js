import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalendarModal from '../components/CalendarModal';

describe('CalendarModal', () => {
  const mockCheckedHabits = [
    { id: 1, habit_name: 'Morning Run' },
    { id: 2, habit_name: 'Read 30 mins' },
  ];

  const mockUncheckedHabits = [
    { id: 3, habit_name: 'Meditate' },
  ];

  it('renders with title showing selected date', () => {
    render(
      <CalendarModal
        selected="2025-12-07"
        checkedHabits={mockCheckedHabits}
        uncheckedHabits={mockUncheckedHabits}
        setOpenModal={() => {}}
      />
    );

    expect(screen.getByText(/Details für 2025-12-07/)).toBeInTheDocument();
  });

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

  it('shows empty state for checked habits when array is empty', () => {
    render(
      <CalendarModal
        selected="2025-12-07"
        checkedHabits={[]}
        uncheckedHabits={mockUncheckedHabits}
        setOpenModal={() => {}}
      />
    );

    expect(screen.getByText(/Keine erledigten Gewohnheiten/)).toBeInTheDocument();
  });

  it('shows empty state for unchecked habits when array is empty', () => {
    render(
      <CalendarModal
        selected="2025-12-07"
        checkedHabits={mockCheckedHabits}
        uncheckedHabits={[]}
        setOpenModal={() => {}}
      />
    );

    expect(screen.getByText(/Keine offenen Gewohnheiten/)).toBeInTheDocument();
  });

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

  it('calls setOpenModal when close icon is clicked', async () => {
    const handleClose = jest.fn();
    render(
      <CalendarModal
        selected="2025-12-07"
        checkedHabits={mockCheckedHabits}
        uncheckedHabits={mockUncheckedHabits}
        setOpenModal={handleClose}
      />
    );

    const closeIcon = screen.getByLabelText('Schließen');
    await userEvent.click(closeIcon);

    expect(handleClose).toHaveBeenCalledWith(false);
  });

  it('has proper accessibility attributes', () => {
    render(
      <CalendarModal
        selected="2025-12-07"
        checkedHabits={mockCheckedHabits}
        uncheckedHabits={mockUncheckedHabits}
        setOpenModal={() => {}}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
