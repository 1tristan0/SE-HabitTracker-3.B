
import { useNavigate } from "react-router";
import {
  addHabit as apiAddHabit,
} from "../api/habitsApi";
import HabitCreateContent from "../components/habits/HabitCreateContent";

export default function CreateHabitPage({userId, session}) {
  const navigate = useNavigate();
  const token = session?.accessToken;

  
  const add = async (name, desc) => {
      try {
        await apiAddHabit(token, { name, desc });
        console.log("Habit successfully added.");
          navigate("/");
      } catch (err) {
        console.error('Anlegen fehlgeschlagen:', err.message);
      }
  };

  const handleCancel = () => {
    // zurück zur Startseite
     navigate("/");
  };

  return (
    <HabitCreateContent
      onSubmit={add}
      onCancel={handleCancel}
    />
  );
}
