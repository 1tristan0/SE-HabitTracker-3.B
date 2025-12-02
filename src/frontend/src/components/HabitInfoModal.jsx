import { convertToGermanDateString } from "../lib/convert";
import { getNumberOfCompletedHabits, getPercentageOfCompletedHabits } from "../lib/habit";

// HabitInfoModal.jsx
export default function HabitInfoModal({ habit, onClose }) {
    console.log("Habit in Modal:", habit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 rounded-2xl bg-slate-900 text-slate-100 shadow-2xl border border-slate-700">
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                {habit ? habit.habit_name : "Habit Name"}
              </h1>
              
            </div>
          </div>

          <button
            
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/80 text-slate-300 text-sm hover:bg-slate-800 hover:text-white transition"
            aria-label="Schließen"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Beschreibung */}
           
            <div>
              <p className="text-sm text-slate-200">
                {habit ? habit.description : "Beschreibung"}
              </p>
            </div>
          

          {/* Kennzahlen */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
                name="Abgeschlossene Gewohnheiten"
                value={getNumberOfCompletedHabits(habit) || 0}
            />
            <StatCard
                name="Anteil abgeschlossene Gewohnheiten"
                value={getPercentageOfCompletedHabits(habit) ? `${getPercentageOfCompletedHabits(habit)}%` : "0%"}
            />
            
          </div>

          {/* Timeline-Infos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3">
              <p className="text-slate-400 text-xs mb-1">
                Gestartet am
              </p>
              <p className="font-medium">
                {habit ? convertToGermanDateString(habit.start_date) : "DD.MM.YYYY"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3">
              <p className="text-slate-400 text-xs mb-1">
                Zuletzt erledigt
              </p>
              <p className="font-medium">
                {habit ? convertToGermanDateString(habit.last_checked) : "DD.MM.YYYY"}
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

/**
 * Kleiner Helper-Component für Kennzahlen-Karten
 */
function StatCard({name, value}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3">
      <p className="text-xs text-slate-400 mb-1">
        {name}
      </p>
      <p className="text-xl font-semibold leading-tight">
        {value}
      </p>
       
        <p className="text-[11px] text-slate-500 mt-1">
          
        </p>
      
    </div>
  );
}
