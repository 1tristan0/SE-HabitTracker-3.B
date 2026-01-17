import { convertToGermanDateString } from "../lib/convert";
import { getNumberOfCompletedHabits, getNumberOfCompletedHabitsLastMonth, getPercentageOfCompletedHabits } from "../lib/habit";

export default function HabitInfoModal({ habit, onClose }) {
    console.log("Habit in Modal:", habit);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 rounded-2xl bg-primary1 text-primary4 shadow-2xl border border-slate-700">
        <div className="flex items-center justify-between border-b border-primary4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                {habit ? habit.habit_name : "Habit Name"}
              </h1>
              
            </div>
          </div>

          <button
            
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/80 text-primary4 text-sm hover:bg-slate-800 hover:text-white transition"
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
              <p className="text-sm text-primary4">
                {habit ? habit.description : "Beschreibung"}
              </p>
            </div>
          

          {/* Kennzahlen */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
                name="Abgeschlossene Gewohnheiten letzte 30 Tage"
                value={getNumberOfCompletedHabitsLastMonth(habit) || 0}
            />
            <StatCard
                name="Anteil abgeschlossene Gewohnheiten"
                value={getPercentageOfCompletedHabits(habit) ? `${getPercentageOfCompletedHabits(habit)}%` : "0%"}
            />
            <StatCard
              name="Aktuelle Streak"
              value={habit ? habit.streak : 0}
            />
          </div>

          {/* Timeline-Infos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-slate-700 bg-primary3 px-4 py-3">
              <p className="text-primary1 text-xs mb-1">
                Gestartet am
              </p>
              <p className="font-medium text-primary1">
                {habit ? convertToGermanDateString(habit.start_date) : "DD.MM.YYYY"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-primary3 px-4 py-3">
              <p className="text-primary1 text-xs mb-1">
                Zuletzt erledigt
              </p>
              <p className="font-medium text-primary1">
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
    <div className="rounded-xl border border-slate-700 bg-primary3 px-4 py-3">
      <p className="text-xs text-primary1 mb-1">
        {name}
      </p>
      <p className="text-xl font-semibold leading-tight text-primary1">
        {value}
      </p>
       
        <p className="text-[11px] text-slate-500 mt-1">
          
        </p>
      
    </div>
  );
}
