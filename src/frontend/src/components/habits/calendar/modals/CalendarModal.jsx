import { convertToGermanDateString } from "../../../../lib/convert";
import Modal from "../../../ui/Modal";

export default function CalendarModal({ selected, checkedHabits = [], uncheckedHabits = [], setOpenModal }) {
  return (
    <Modal title={`Details für den ${convertToGermanDateString(selected)}`} onClose={() => setOpenModal(false)} size="lg">
      {/* Content */}
      <div className="space-y-6">
        {/* Erledigte Habits */}
        <div>
          <h2 className="text-base font-semibold text-primary4 mb-3">Folgende Habits wurden an dem Tag erledigt</h2>
          {checkedHabits.length > 0 ? (
            <ul className="space-y-2">
              {checkedHabits.map((habit, index) => (
                <li key={index} className="rounded-xl border border-slate-700 bg-primary3/80 px-4 py-3 text-sm text-primary1">
                  {habit.habit_name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-slate-700 bg-primary3/80 px-4 py-3">
              <p className="text-sm text-primary1">Keine Habits wurden an diesem Tag erledigt</p>
            </div>
          )}
        </div>

        {/* Nicht erledigte Habits */}
        <div>
          <h2 className="text-base font-semibold text-primaryRed mb-3">Folgende Habits wurden an dem Tag nicht erledigt</h2>
          {uncheckedHabits.length > 0 ? (
            <ul className="space-y-2">
              {uncheckedHabits.map((habit, index) => (
                <li key={index} className="rounded-xl border border-slate-700 bg-primaryRed/80 px-4 py-3 text-sm text-primary1">
                  {habit.habit_name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-slate-700 bg-primaryRed/80 px-4 py-3">
              <p className="text-sm text-primary1">Keine Habits wurden an diesem Tag nicht erledigt</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
