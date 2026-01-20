import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from '../components/Signup';

describe('Signup', () => {

  test('calls onSubmit with email and password on submit', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<Signup onSubmit={onSubmit} switchToLogin={() => {}} />);

    await user.type(screen.getByLabelText(/E-Mail/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Passwort/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /Registrieren/i }));

    expect(onSubmit).toHaveBeenCalledWith('test@example.com', 'secret123');
  });

  test('calls switchToLogin when login button clicked', async () => {
    const user = userEvent.setup();
    const switchToLogin = jest.fn();

    render(<Signup onSubmit={() => {}} switchToLogin={switchToLogin} />);
    await user.click(screen.getByRole('button', { name: /Schon registriert\? Login/i }));

    expect(switchToLogin).toHaveBeenCalled();
  });
});