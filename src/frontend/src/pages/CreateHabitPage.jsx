
import { useNavigate } from "react-router";
import {
  addHabit as apiAddHabit,
} from "../api/habitsApi";
import HabitCreateContent from "../components/habits/HabitCreateContent";

export default function CreateHabitPage({userId, session}) {
  const navigate = useNavigate();
  const token = session?.accessToken;

  // Funktion zum Hinzufügen eines neuen Habits
  const add = async (name, desc) => {
      try {
        await apiAddHabit(token, { name, desc });
          navigate("/");
      } catch (err) {
        console.error('Anlegen fehlgeschlagen:', err.message);
      }
  };
  // Zurück zur Übersichtsseite navigieren
  const handleCancel = () => {
     navigate("/");
  };

  return (
    <HabitCreateContent
      onSubmit={add}
      onCancel={handleCancel}
    />
  );
}
