import { useEffect, useState } from 'react';
import HabitGrid from '../components/HabitGrid';
import HabitInfoModal from '../components/HabitInfoModal';

import {
  fetchHabits,
  deleteHabit as apiDeleteHabit,
  toggleHabitToday,
  updateHabit,
} from '../api/habitsApi';
import Calender from '../components/Calender';
import HabitChangeModal from '../components/HabitChangeModal';
import BegleiterModal from '../components/BegleiterModal';
import Begleiter from '../components/Begleiter';
import { fetchAnimal } from '../api/userApi';

export default function HabitsPage({ session, onLogout }) {
  const [habits, setHabits] = useState([]);
  const userId = session?.user?.id;        // changed
  const token = session?.accessToken;      // changed
  const [openModal, setOpenModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [openChangeModal, setOpenChangeModal] = useState(false);
  const [openBegleiterModal, setOpenBegleiterModal] = useState(false);
  const [selectedBegleiter, setSelectedBegleiter] = useState("hamster");
  const [animalMood , setAnimalMood] = useState("gluecklich");

  const load = async () => {
    try {
      const data = await fetchHabits(token);
      setHabits(data);
    } catch (err) {
      console.error('Laden fehlgeschlagen:', err.message);
    }
  };

  const remove = async (id) => {
    try {
      await apiDeleteHabit(token, id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error('Löschen fehlgeschlagen:', err.message);
    }
  };

  // Check/Uncheck ohne RPC: habitsApi entscheidet anhand last_checked, was zu tun ist
  const check = async (id /* , nextChecked */) => {
    try {
      const updated = await toggleHabitToday(token, id);
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
    } catch (err) {
      console.error('Check fehlgeschlagen:', err.message);
    }
  };
  const edit = async (id, data = {}) => {
    try{
      const { name, description } = data || {};
      const updated = await updateHabit(token, id, { name, desc: description });
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
    } catch (err) {
      console.error('Update fehlgeschlagen:', err.message);
    }
    
    setOpenChangeModal(false);
  };
  const openChangeModalComponent = (habit) => {
    setSelectedHabit(habit);
    setOpenChangeModal(true);
  }  
  const getAnimal = async () => {
    try {
      const data = await fetchAnimal(token);
      setSelectedBegleiter(data.animal_type);
      console.log("Begleiter geladen:", data);
    } catch (err) {
      console.error('Laden des Gewohnheitstiers fehlgeschlagen:', err.message);
    }
  };

  useEffect(() => {
    if (userId && token) {
      load();
      getAnimal();
    }
    if (userId && token) {
      load();
      getAnimal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);
  const setAnimal = async (animalType, animalmood) => {
    const data = await setAnimal(token, animalType, animalmood);
    setSelectedBegleiter(data.animal_type);
    console.log("Begleiter gesetzt:", data);
  }

  const opennModal = (habit) => {
    setSelectedHabit(habit);
    setOpenModal(true);
    
  }
  const closeModal = () => {
    setOpenModal(false);
  }


  return (
    <div className="container py-5">

      {!userId || !token ? (
        <div className="alert alert-warning" role="alert">
          Bitte melden Sie sich an, um Ihre Gewohnheiten zu verwalten.
        </div>
      ) : (
        <>
          <HabitGrid habits={habits} onDelete={remove} onCheck={check} onClick={opennModal} onClose={closeModal} onEdit={openChangeModalComponent} setAnimalMood={setAnimalMood}/>
          { openModal && <HabitInfoModal habit={selectedHabit} onClose={closeModal} /> }
          {openChangeModal && <HabitChangeModal habit={selectedHabit} onClose={() => setOpenChangeModal(false)} edit={edit}/>}
          <Calender habits={habits} />
          <Begleiter selectedBegleiter={selectedBegleiter} onClick={() => setOpenBegleiterModal(true)} begleiterMood={animalMood}/>
          { openBegleiterModal && <BegleiterModal onClose={() => setOpenBegleiterModal(false)} onSelect={setSelectedBegleiter} token={token} animalMood={animalMood}/> }
        </>
      )}
    </div>
  );
}
