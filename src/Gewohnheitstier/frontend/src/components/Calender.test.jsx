import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

// Mock the calendar utilities used by the component
jest.mock('../lib/calendar', () => ({
  getMonthMatrix: jest.fn(() => [[{ date: new Date('2025-11-25'), day: 25, inMonth: true }]]),
  getCheckedHabiitsFromDay: jest.fn(() => [{ id: 1 }]),
  getUncheckedHabitsFromDay: jest.fn(() => [{ id: 2 }]),
  isEveryHabitChecked: jest.fn(() => true),
}));

// Mock conversion helpers so output is stable
jest.mock('../lib/convert', () => ({
  monthAndYear: jest.fn(() => 'November 2025'),
  todayAsString: jest.fn(() => '2025-11-25'),
}));

// Mock the CalendarModal to a simple component that displays props so we can assert them
jest.mock('./CalendarModal', () => (props) => {
  return (
    <div data-testid="mock-modal">
      Modal checked:{Array.isArray(props.checkedHabits) ? props.checkedHabits.length : 0} unchecked:{Array.isArray(props.uncheckedHabits) ? props.uncheckedHabits.length : 0}
    </div>
  );
});

import Calender from './Calender';

describe('Calender component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('shows fallback text when there are no habits', () => {
    // Provide empty habits array
    render(<Calender habits={[]} />);

    // Weekday header
    expect(screen.getByText('Mo')).toBeInTheDocument();

    // With no habits the component should show "Noch nichts erledigt heute."
    expect(screen.getByText('Noch nichts erledigt heute.')).toBeInTheDocument();
  });

  test('renders month header, opens modal and displays checked/unchecked counts when day clicked', () => {
    const habits = [{ id: 'h1' }];
    render(<Calender habits={habits} />);

    // Month header comes from mocked monthAndYear
    expect(screen.getByText('November 2025')).toBeInTheDocument();

    // the day button rendered by our mocked matrix should be present (shows day number 25)
    const dayButton = screen.getByRole('button', { name: /25/i });
    expect(dayButton).toBeInTheDocument();

    // Click the day to open the modal
    fireEvent.click(dayButton);

    // The mocked modal should be visible and show checked/unchecked counts from our mocks
    expect(screen.getByTestId('mock-modal')).toHaveTextContent('Modal checked:1 unchecked:1');

    // When isEveryHabitChecked is mocked to true, bottom text should indicate all done
    expect(screen.getByText('Alle Gewohnheiten für heute erledigt!')).toBeInTheDocument();
  });
});
