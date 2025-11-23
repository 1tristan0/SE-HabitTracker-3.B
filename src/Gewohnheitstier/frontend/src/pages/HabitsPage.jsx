// client/src/pages/HabitsPage.jsx
import { useEffect, useState } from 'react';
import HabitForm from '../components/HabitForm';
import Navbar from '../components/Navbar';
import HabitGrid from '../components/HabitGrid';

import {
  fetchHabits,
  addHabit as apiAddHabit,
  deleteHabit as apiDeleteHabit,
  toggleHabitToday,
} from '../api/habitsApi';
import Calender from '../components/Calender';
import HabitInfoModal from '../components/HabitInfoModal';

export default function HabitsPage({ userId, onLogout }) {
  const [habits, setHabits] = useState([]);

  const load = async () => {
    try {
      const data = await fetchHabits(userId);
      setHabits(data);
    } catch (err) {
      console.error('Laden fehlgeschlagen:', err.message);
    }
  };

  const add = async (name, desc) => {
    try {
      await apiAddHabit({ userId, name, desc });
      await load();
    } catch (err) {
      console.error('Anlegen fehlgeschlagen:', err.message);
    }
  };

  const remove = async (id) => {
    try {
      await apiDeleteHabit({ userId, id });
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error('Löschen fehlgeschlagen:', err.message);
    }
  };

  // Check/Uncheck ohne RPC: habitsApi entscheidet anhand last_checked, was zu tun ist
  const check = async (id /* , nextChecked */) => {
    try {
      const updated = await toggleHabitToday({ habitId: id, userId });
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
    } catch (err) {
      console.error('Check fehlgeschlagen:', err.message);
    }
  };

  useEffect(() => {
    if (userId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Navbar onLogout={onLogout} />
      </div>

      <HabitForm onAdd={add} />
      
<HabitInfoModal

/>


      <HabitGrid habits={habits} onDelete={remove} onCheck={check} />
      <Calender habits={habits} />
    </div>
  );
}