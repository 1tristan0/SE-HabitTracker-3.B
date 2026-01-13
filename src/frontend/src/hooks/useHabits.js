// client/src/hooks/useHabits.js
import { useEffect, useState } from 'react';
import { fetchHabits, addHabit, deleteHabit, updateHabit } from '../api/habitsApi';

export function useHabits(token) {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setHabits(await fetchHabits(token)); }
    finally { setLoading(false); }
  };

  const add = async (name, desc) => { await addHabit(token, { name, desc }); await load(); };
  const remove = async (id) => { await deleteHabit(token, id); await load(); };
  const update = async (id, payload) => { await updateHabit(token, id, payload); await load(); };


  useEffect(() => { if (token) load(); }, [token]);

  return { habits, loading, add, remove, update, reload: load };


}
