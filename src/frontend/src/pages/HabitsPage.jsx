import { useEffect, useState } from 'react';
import HabitGrid from '../components/habits/HabitGrid';
import HabitInfoModal from '../components/habits/modals/HabitInfoModal';

import {
  fetchHabits,
  deleteHabit as apiDeleteHabit,
  toggleHabitToday,
  updateHabit,
} from '../api/habitsApi';
import Calender from '../components/habits/calendar/Calender';
import HabitChangeModal from '../components/habits/modals/HabitChangeModal';
import AnimalModal from '../components/animal/modals/AnimalModal';
import Animal from '../components/animal/Animal';
import { fetchAnimal } from '../api/userApi';

export default function HabitsPage({ session}) {
  const [habits, setHabits] = useState([]);
  const userId = session?.user?.id;        
  const token = session?.accessToken;      
  const [openModal, setOpenModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [openChangeModal, setOpenChangeModal] = useState(false);
  const [openAnimalModal, setOpenAnimalModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [animalMood , setAnimalMood] = useState("gluecklich");

  // Gewohnheiten laden
  const load = async () => {
    try {
      const data = await fetchHabits(token);
      setHabits(data);
    } catch (err) {
      console.error('Laden fehlgeschlagen:', err.message);
    }
  };
  // Gewohnheit löschen
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
  // Gewohnheit bearbeiten
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
  //Öffnen des Änderungsmodals
  const openChangeModalComponent = (habit) => {
    setSelectedHabit(habit);
    setOpenChangeModal(true);
  }  
  // Begleiter des Nutzers laden
  const getAnimal = async () => {
    try {
      const data = await fetchAnimal(token);
      setSelectedAnimal(data.animal_type);
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
    setSelectedAnimal(data.animal_type);
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
          <Animal selectedAnimal={selectedAnimal} onClick={() => setOpenAnimalModal(true)} animalMood={animalMood}/>
          { openAnimalModal && <AnimalModal onClose={() => setOpenAnimalModal(false)} onSelect={setSelectedAnimal} token={token} animalMood={animalMood}/> }
        </>
      )}
    </div>
  );
}
