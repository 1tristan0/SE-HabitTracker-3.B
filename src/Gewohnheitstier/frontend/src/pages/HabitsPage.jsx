// client/src/pages/HabitsPage.jsx
import { useEffect, useState } from 'react';
import HabitGrid from '../components/HabitGrid';

import {
  fetchHabits,
  deleteHabit as apiDeleteHabit,
  toggleHabitToday,
} from '../api/habitsApi';
import Calender from '../components/Calender';

export default function HabitsPage({ userId, onLogout }) {
  const [habits, setHabits] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  const load = async () => {
    try {
      const data = await fetchHabits(userId);
      setHabits(data);
    } catch (err) {
      console.error('Laden fehlgeschlagen:', err.message);
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
  const opennModal = (habit) => {
    setSelectedHabit(habit);
    setOpenModal(true);
    
  }
  const closeModal = () => {
    setOpenModal(false);
  }


  return (
    <div className="container py-5">
      <HabitGrid habits={habits} onDelete={remove} onCheck={check} onClick={opennModal} onClose={closeModal} />
      { openModal && <HabitInfoModal habit={selectedHabit} onClose={closeModal} /> }
      <Calender habits={habits} />
    </div>
  );
}