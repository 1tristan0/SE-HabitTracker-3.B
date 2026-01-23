import { isInFuture } from '../../../lib/convert';
import ProgressCircle from '../ProgressCircle';

export default function CalendarDayButton({ cell, dateStr, isToday, isSelected, completion, percent, onDayClick }) {
  return (
    <button
      className={
        `py-3 border rounded-md focus:outline-none transition-colors hover:bg-primary2 dayButton` +
        `${cell.inMonth ? "bg-white " : "bg-gray-50 text-gray-400"} ` +
        `${isToday ? "ring-2 ring-primary3" : ""} ` +
        `${isInFuture(cell.date) ? "cursor-not-allowed bg-gray-300" : "hover:bg-primary2 cursor-pointer text-primary3"} `
      }
      aria-pressed={isSelected}
      disabled={isInFuture(cell.date)}
      onClick={() => onDayClick(dateStr)}
      title={cell.date.toLocaleDateString()}
    >
      <div className="text-sm">{cell.day}</div>
      {completion === true ? (
        <div className="mt-1 w-5 h-5 mx-auto bg-green-500 rounded-full"></div>
      ) : (
        <div className="mt-1 w-5 h-5 mx-auto">
          <ProgressCircle percent={percent} />
        </div>
      )}
    </button>
  );
}
