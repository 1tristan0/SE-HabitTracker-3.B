import { convertToGermanDateString } from "../lib/convert";

export default function CalendarModal({ selected, checkedHabits = [], uncheckedHabits = [], setOpenModal }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Details für den {convertToGermanDateString(selected)}</h2>
        <p className="text-lg text-green-400">Folgende Habits wurden an dem Tag erledigt</p>
        <ul className="list-disc list-inside mt-4">
          {checkedHabits.length > 0 ? (
            checkedHabits.map((habit, index) => (
              <li key={index} className="">{habit.habit_name}</li>
            ))
          ) : (
            <li className="">Keine Habits wurden an diesem Tag erledigt</li>
          )}
        </ul>
        <p className="text-lg text-red-400 mt-3"> Folgende Habits wurden an dem Tag nicht erledigt</p>
        <ul className="list-disc list-inside mt-4">
          {uncheckedHabits.length > 0 ? (
            uncheckedHabits.map((habit, index) => (
              <li key={index} className="">{habit.habit_name}</li>
            ))
          ) : (
            <li className="">Keine Habits wurden an diesem Tag nicht erledigt</li>
          )}
        </ul>
        <button onClick={() => setOpenModal(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Schließen</button>
      </div>
    </div>
  );
}