// client/src/pages/HabitsPage.jsx
import HabitForm from '../components/HabitForm';
import HabitCard from '../components/HabitCard';
import { useHabits } from '../hooks/useHabits';

export default function HabitsPage({ userId, onLogout }) {
  const { habits, add, remove } = useHabits(userId);
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between mb-4">
        <h1>Gewohnheitstier</h1>
        <button className="btn btn-outline-secondary" onClick={onLogout}>Logout</button>
      </div>
      <HabitForm onAdd={add} />
      {habits.map(h => <HabitCard key={h.id} habit={h} onDelete={remove} />)}
    </div>
  );
}