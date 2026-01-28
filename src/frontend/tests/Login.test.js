import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../src/components/auth/Login';

describe('Login', () => {

  test('calls onSubmit with email and password on submit', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();

    render(<Login onSubmit={onSubmit} switchToRegister={() => {}} />);

    await user.type(screen.getByLabelText(/E-Mail/i), 'test@example.com');
    await user.type(screen.getByLabelText(/Passwort/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /Login/i }));

    expect(onSubmit).toHaveBeenCalledWith('test@example.com', 'secret123');
  });

  test('calls switchToRegister when register button clicked', async () => {
    const user = userEvent.setup();
    const switchToRegister = jest.fn();

    render(<Login onSubmit={() => {}} switchToRegister={switchToRegister} />);

    await user.click(screen.getByRole('button', { name: /Noch keinen Account\? Registrieren/i }));

    expect(switchToRegister).toHaveBeenCalled();
  });
});
