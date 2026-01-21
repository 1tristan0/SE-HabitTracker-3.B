import React, { useMemo, useState } from "react";
import { getCheckedHabiitsFromDay, getMonthMatrix, getUncheckedHabitsFromDay, isEveryHabitChecked } from "../../../lib/calendar";
import { monthAndYear, todayAsStringBerlin, dateOnlyBerlin } from "../../../lib/convert";
import CalendarModal from "./modals/CalendarModal";
import CalendarDayButton from "../../ui/Buttons/CalendarDayButton";

const WEEKDAYS = ["Mo","Di","Mi","Do","Fr","Sa","So"];



export default function Calender({ habits }) {
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [checkedHabits, setCheckedHabits] = useState([]);
  const [uncheckedHabits, setUncheckedHabits] = useState([]);

  const todayStr = todayAsStringBerlin();

  const matrix = useMemo(() => getMonthMatrix(view.year, view.month), [view]);

  // Wechsel zum vorherigen/nächsten Monat
  const prevMonth = () => {
    setView((v) => {
      const m = v.month - 1;
      if (m < 0) return { year: v.year - 1, month: 11 };
      return { year: v.year, month: m };
    });
  };
  const nextMonth = () => {
    setView((v) => {
      const m = v.month + 1;
      if (m > 11) return { year: v.year + 1, month: 0 };
      return { year: v.year, month: m };
    });
  };
  function onDaySelected(dateStr){
    setOpenModal(true);
    setCheckedHabits(getCheckedHabiitsFromDay(habits, dateStr));
    setUncheckedHabits(getUncheckedHabitsFromDay(habits, dateStr));
  };


  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="flex items-center justify-between mb-4">
        

        <div className="flex justify-between items-center w-full">
          <button onClick={prevMonth} className="px-3 py-1 rounded bg-primary3 hover:bg-primary4 text-primary1">vorheriger Monat</button>
          <h2 className="text-2xl font-semibold text-primary3">{monthAndYear(view.year, view.month)}</h2>
          <button onClick={nextMonth} className="px-3 py-1 rounded bg-primary3 hover:bg-primary4 text-primary1">nächster Monat</button>
        </div>
      </div>
      {openModal && (
        <CalendarModal selected={selected} checkedHabits={checkedHabits} uncheckedHabits={uncheckedHabits} setOpenModal={setOpenModal} />
      )}
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-sm font-medium text-primary3 py-2 ">{w}</div>
        ))}

        {matrix.map((week, wi) => (
          week.map((cell, di) => {
            const dateStr = dateOnlyBerlin(cell.date);
            const isToday = dateStr === todayStr;
            const isSelected = selected === dateStr;
            const completion = isEveryHabitChecked(habits, dateStr); 
            const percent = typeof completion === "number" ? completion : 0;
            return (
              <CalendarDayButton
                key={`${wi}-${di}`}
                cell={cell}
                dateStr={dateStr}
                isToday={isToday}
                isSelected={isSelected}
                completion={completion}
                percent={percent}
                onDayClick={(dateStr) => {
                  setSelected(dateStr);
                  onDaySelected(dateStr);
                }}
              />
            );
          })
        ))}
      </div>

    </div>
  );
}
