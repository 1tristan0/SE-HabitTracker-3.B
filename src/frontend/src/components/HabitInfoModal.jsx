import { convertToGermanDateString } from "../lib/convert";
import {
  getNumberOfCompletedHabits,
  getNumberOfCompletedHabitsLastMonth,
  getPercentageOfCompletedHabits,
  getPercentageOfCompletedHabitsLastMonth,
} from "../lib/habit";

export default function HabitInfoModal({ habit, onClose }) {
  if (!habit) return null;

  const completedLast30 = getNumberOfCompletedHabitsLastMonth(habit) ?? 0;
  const completionRate = getPercentageOfCompletedHabitsLastMonth(habit) ?? 0;
  const completionRateLabel = `${completionRate}%`;

  const startedAt = habit.start_date
    ? convertToGermanDateString(habit.start_date)
    : "—";

  const lastDoneAt = habit.last_checked
    ? convertToGermanDateString(habit.last_checked)
    : "Noch nie erledigt";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-xl mx-4 rounded-2xl bg-primary1 text-primary4 shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary4/40 px-6 py-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold leading-tight">
              {habit.habit_name}
            </h1>
            
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
          {habit.description && (
            <div className="rounded-xl bg-primary3/80 border border-slate-700 px-4 py-3">
              <p className="text-sm text-primary1 leading-snug">
                {habit.description}
              </p>
            </div>
          )}

          {/* Kennzahlen */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              name="Letzte 30 Tage"
              value={completedLast30}
            />
            <StatCard
              name="Abschlussrate"
              value={completionRateLabel}
            />
            <StatCard
              name="Aktuelle Streak"
              value={habit ? habit.streak : 0}
            />
          </div>

          {/* Timeline-Infos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-slate-700 bg-primary3 px-4 py-3">
              <p className="text-primary1 text-xs mb-1 uppercase tracking-wide opacity-80">
                Gestartet am
              </p>
              <p className="font-medium text-primary1">{startedAt}</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-primary3 px-4 py-3">
              <p className="text-primary1 text-xs mb-1 uppercase tracking-wide opacity-80">
                Zuletzt erledigt
              </p>
              <p className="font-medium text-primary1">{lastDoneAt}</p>
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
function StatCard({ name, value}) {
  return (
    <div className="rounded-xl border border-slate-700 bg-primary3 px-4 py-3 flex flex-col justify-between">
      <p className="text-xs text-primary1 mb-1">{name}</p>
      <p className="text-xl font-semibold leading-tight text-primary1">
        {value}
      </p>
    </div>
  );
}
