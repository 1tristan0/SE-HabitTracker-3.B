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

    // Card click should not have been triggered by the delete button click
    expect(handleClick).not.toHaveBeenCalled();
  });
});
