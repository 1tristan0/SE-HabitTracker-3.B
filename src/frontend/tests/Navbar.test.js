import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import Navbar from '../src/components/layout/Navbar';

describe('Navbar', () => {
  /**
   * Testet das Rendering der Navigations-Links.
   * Überprüft, dass beide Navigations-Links "Übersicht" und "Hinzufügen" im DOM vorhanden sind.
   */
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar onLogout={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByText('Übersicht')).toBeInTheDocument();
    expect(screen.getByText('Hinzufügen')).toBeInTheDocument();
  });

  /**
   * Testet den aktiven Zustand für den "Übersicht"-Link.
   * Überprüft, dass der Link die aktive Klasse bekommt, wenn auf "/" navigiert wird.
   */
  it('sets active state for Übersicht when on root path', () => {
    render(
      <BrowserRouter>
        <Navbar onLogout={() => {}} />
      </BrowserRouter>
    );

    const overviewLink = screen.getByText('Übersicht').closest('a');
    expect(overviewLink).toHaveClass('text-primary3');
    expect(overviewLink).toHaveClass('font-semibold');
  });

  /**
   * Testet den aktiven Zustand für den "Hinzufügen"-Link.
   * Überprüft, dass der Link aktiv ist, wenn auf "/add" navigiert wird.
   */
  it('sets active state for Hinzufügen when on add path', () => {
    window.history.pushState({}, 'Test page', '/add');
    render(
      <BrowserRouter>
        <Navbar onLogout={() => {}} />
      </BrowserRouter>
    );

    const addLink = screen.getByText('Hinzufügen').closest('a');
    expect(addLink).toHaveClass('text-primary3');
    expect(addLink).toHaveClass('font-semibold');
  });

  /**
   * Testet, dass beide Links als NavLink-Elemente (a-Tags) vorhanden sind.
   * Überprüft, dass die Links zu den korrekten Pfaden führen.
   */
  it('renders links with correct href attributes', () => {
    render(
      <BrowserRouter>
        <Navbar onLogout={() => {}} />
      </BrowserRouter>
    );

    const overviewLink = screen.getByText('Übersicht').closest('a');
    const addLink = screen.getByText('Hinzufügen').closest('a');

    expect(overviewLink).toHaveAttribute('href', '/');
    expect(addLink).toHaveAttribute('href', '/add');
  });

  /**
   * Testet das Rendering des Logout-Buttons.
   * Überprüft, dass der Logout-Button im DOM vorhanden ist.
   */
  it('renders logout button', () => {
    render(
      <BrowserRouter>
        <Navbar onLogout={() => {}} />
      </BrowserRouter>
    );

    const logoutButton = screen.getByText('Logout', { selector: 'button' });
    expect(logoutButton).toBeInTheDocument();
  });

  /**
   * Testet, dass der onLogout-Callback aufgerufen wird.
   * Überprüft, dass der Handler aufgerufen wird, wenn der Logout-Button geklickt wird.
   */
  it('calls onLogout when logout button is clicked', async () => {
    const handleLogout = jest.fn();
    render(
      <BrowserRouter>
        <Navbar onLogout={handleLogout} />
      </BrowserRouter>
    );

    const logoutButton = screen.getByText('Logout', { selector: 'button' });
    await userEvent.click(logoutButton);

    expect(handleLogout).toHaveBeenCalled();
  });

});
