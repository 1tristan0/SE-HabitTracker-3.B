// HabitsErstellen.jsx
import HabitCreateContent from "../HabitCreateContent";

export default function HabitsErstellen() {
  const handleCreateHabit = (habitData) => {
    // hier Habit speichern (API-Call / Zustand aktualisieren)
    // und anschließend z. B. zurück auf die Übersicht navigieren
  };

  const handleCancel = () => {
    // zurück zur Habit-Liste navigieren
  };

  return (
    <HabitCreateContent
      onSubmit={handleCreateHabit}
      onCancel={handleCancel}
    />
  );
}
