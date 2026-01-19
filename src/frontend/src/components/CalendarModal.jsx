import { convertToGermanDateString } from "../lib/convert";

export default function CalendarModal({ selected, checkedHabits = [], uncheckedHabits = [], setOpenModal }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 rounded-2xl bg-primary1 text-primary4 shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-primary4/40 px-6 py-4">
          <h1 className="text-lg font-semibold leading-tight">
            Details für den {convertToGermanDateString(selected)}
          </h1>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/80 text-primary4 text-sm hover:bg-slate-800 hover:text-white transition"
            aria-label="Schließen"
            onClick={() => setOpenModal(false)}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Erledigte Habits */}
          <div>
            <h2 className="text-base font-semibold text-primary4 mb-3">
              Folgende Habits wurden an dem Tag erledigt
            </h2>
            {checkedHabits.length > 0 ? (
              <ul className="space-y-2">
                {checkedHabits.map((habit, index) => (
                  <li
                    key={index}
                    className="rounded-xl border border-slate-700 bg-primary3/80 px-4 py-3 text-sm text-primary1"
                  >
                    {habit.habit_name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-slate-700 bg-primary3/80 px-4 py-3">
                <p className="text-sm text-primary1">
                  Keine Habits wurden an diesem Tag erledigt
                </p>
              </div>
            )}
          </div>

          {/* Nicht erledigte Habits */}
          <div>
            <h2 className="text-base font-semibold text-primaryRed mb-3">
              Folgende Habits wurden an dem Tag nicht erledigt
            </h2>
            {uncheckedHabits.length > 0 ? (
              <ul className="space-y-2">
                {uncheckedHabits.map((habit, index) => (
                  <li
                    key={index}
                    className="rounded-xl border border-slate-700 bg-primaryRed/80 px-4 py-3 text-sm text-primary1"
                  >
                    {habit.habit_name}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-slate-700 bg-primaryRed/80 px-4 py-3">
                <p className="text-sm text-primary1">
                  Keine Habits wurden an diesem Tag nicht erledigt
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}