// client/src/hooks/useHabits.js
import { useEffect, useState } from 'react';
import { fetchHabits, addHabit, deleteHabit } from '../api/habitsApi';

export function useHabits(userId) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setHabits(await fetchHabits(userId)); }
    finally { setLoading(false); }
  };

  const add = async (name, desc) => { await addHabit({ userId, name, desc }); await load(); };
  const remove = async (id) => { await deleteHabit({ userId, id }); await load(); };

  useEffect(() => { if (userId) load(); }, [userId]);

  return { habits, loading, add, remove, reload: load };
}