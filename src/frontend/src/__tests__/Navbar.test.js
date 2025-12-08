import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../components/Navbar';

// Mock window.location.hash
delete window.location;
window.location = { hash: '' };

describe('Navbar', () => {
  beforeEach(() => {
    window.location.hash = '';
  });

  it('renders navigation links', () => {
    render(
      <Navbar
        onAddHabitClick={() => {}}
        onOverviewClick={() => {}}
      />
    );

    expect(screen.getByText('Übersicht')).toBeInTheDocument();
    expect(screen.getByText('Hinzufügen')).toBeInTheDocument();
  });

  it('sets active state for Übersicht when hash is empty or overview', () => {
    window.location.hash = '';
    const { rerender } = render(
      <Navbar
        onAddHabitClick={() => {}}
        onOverviewClick={() => {}}
      />
    );

    let overviewLink = screen.getByText('Übersicht');
    expect(overviewLink.closest('a')).toHaveClass('text-green-600');

    window.location.hash = '#overview';
    rerender(
      <Navbar
        onAddHabitClick={() => {}}
        onOverviewClick={() => {}}
      />
    );

    overviewLink = screen.getByText('Übersicht');
    expect(overviewLink.closest('a')).toHaveClass('text-green-600');
  });

  it('sets active state for Hinzufügen when hash is add', () => {
    window.location.hash = '#add';
    render(
      <Navbar
        onAddHabitClick={() => {}}
        onOverviewClick={() => {}}
      />
    );

    const addLink = screen.getByText('Hinzufügen');
    expect(addLink.closest('a')).toHaveClass('text-green-600');
  });

  it('calls onOverviewClick when Übersicht is clicked', async () => {
    const handleOverviewClick = jest.fn();
    render(
      <Navbar
        onAddHabitClick={() => {}}
        onOverviewClick={handleOverviewClick}
      />
    );

    const overviewLink = screen.getByText('Übersicht');
    await userEvent.click(overviewLink);

    expect(handleOverviewClick).toHaveBeenCalled();
  });

  it('calls onAddHabitClick when Hinzufügen is clicked', async () => {
    const handleAddClick = jest.fn();
    render(
      <Navbar
        onAddHabitClick={handleAddClick}
        onOverviewClick={() => {}}
      />
    );

    const addLink = screen.getByText('Hinzufügen');
    await userEvent.click(addLink);

    expect(handleAddClick).toHaveBeenCalled();
  });

  it('updates hash when navigation link is clicked', async () => {
    render(
      <Navbar
        onAddHabitClick={() => {}}
        onOverviewClick={() => {}}
      />
    );

    const addLink = screen.getByText('Hinzufügen');
    await userEvent.click(addLink);

    expect(window.location.hash).toBe('#add');

    const overviewLink = screen.getByText('Übersicht');
    await userEvent.click(overviewLink);

    expect(window.location.hash).toBe('#overview');
  });

  it('renders with proper container classes for styling', () => {
    const { container } = render(
      <Navbar
        onAddHabitClick={() => {}}
        onOverviewClick={() => {}}
      />
    );

    const navbar = container.querySelector('nav');
    expect(navbar).toHaveClass('bg-white', 'shadow');
  });
});
