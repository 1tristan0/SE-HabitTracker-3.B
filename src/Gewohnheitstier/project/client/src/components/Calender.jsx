import React, { useMemo, useState } from "react";
import { getMonthMatrix, isEveryHabitChecked } from "../lib/calendar";
import { monthAndYear, todayAsString } from "../lib/convert";

const WEEKDAYS = ["Mo","Di","Mi","Do","Fr","Sa","So"];



export default function Calender({ habits }) {
  const now = new Date();
  const [view, setView] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [selected, setSelected] = useState(null);

  const todayStr = todayAsString();

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


  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="flex items-center justify-between mb-4">
        

        <div className="flex justify-between items-center w-full">
          <button onClick={prevMonth} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">vorheriger Monat</button>
          <h2 className="text-2xl font-semibold text-gray-800">{monthAndYear(view.year, view.month)}</h2>
          <button onClick={nextMonth} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">nächster Monat</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-sm font-medium text-gray-600 py-2">{w}</div>
        ))}

        {matrix.map((week, wi) => (
          week.map((cell, di) => {
            const dateStr = cell.date.toISOString().slice(0,10);
            const isToday = dateStr === todayStr;
            const isSelected = selected === dateStr;
            const completion = isEveryHabitChecked(habits, dateStr); // true or percent number
            const percent = typeof completion === "number" ? completion : 0;
            return (
              <button
                key={`${wi}-${di}`}
                className={
                  `py-3 border rounded-md focus:outline-none transition-colors ` +
                  `${cell.inMonth ? "bg-white" : "bg-gray-50 text-gray-400"} ` +
                  `${isToday ? "ring-2 ring-blue-400" : ""} ` +
                  `${completion === true ? "bg-green-600 " : ""}`
                }
                aria-pressed={isSelected}
                title={cell.date.toLocaleDateString()}
              >
                <div className="text-sm">{cell.day}</div>
                {completion === true ? (
                  <div className="mt-1 w-5 h-5 mx-auto bg-green-500 rounded-full"></div>
                ) : (
                  <div className="mt-1 w-5 h-5 mx-auto">
                    {percent > 0 ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" className="mx-auto">
                        <circle cx="10" cy="10" r="8" stroke="#e5e7eb" strokeWidth="2" fill="none" />
                        <circle
                          cx="10"
                          cy="10"
                          r="8"
                          stroke="#FF6803"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(2 * Math.PI * 8 * percent) / 100} ${2 * Math.PI * 8}`}
                          transform="rotate(-90 10 10)"
                        />
                      </svg>
                    ) : (
                      <div className="w-5 h-5"></div>
                    )}
                  </div>
                )}
              </button>
            );
          })
        ))}
      </div>
        <div className="mt-4 text-sm text-gray-600">
          {isEveryHabitChecked(habits, todayStr) === true ? (
            <div>Alle Gewohnheiten für heute erledigt!</div>
          ) : (
            <div>
              {(() => {
                const c = isEveryHabitChecked(habits, todayStr);
                return typeof c === "number" && c > 0 ? (
                  <div>{`Heute erledigt: ${c}%`}</div>
                ) : (
                  <div>Noch nichts erledigt heute.</div>
                );
              })()}
            </div>
          )}
        </div>

    </div>
  );
}