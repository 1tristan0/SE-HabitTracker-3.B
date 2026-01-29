export default function StreakBadge({ streak = 0 }) {
  const s = Number(streak) || 0;
  // Map streak ranges to Tailwind classes (no inline styles)
  const bgClasses =
    s >= 30
      ? "bg-gradient-to-br from-[#ffd166] to-[#f4a261]"
      : s >= 7
      ? "bg-[#ff7a00]"
      : s >= 3
      ? "bg-[#2f9e44]"
      : "bg-[#e9ecef]";

  const textClasses = s >= 30 ? "text-[#3b2f00]" : "text-[#222]";

  const containerClasses = `streak-badge inline-flex items-center justify-center gap-[6px] min-w-[46px] h-8 rounded-full px-2 py-1 shadow-sm overflow-visible ${bgClasses} ${textClasses}`;

  return (
    <div className={containerClasses} title={`Streak: ${s} ${s === 1 ? "Tag" : "Tage"}`}>
      <img src="/flame.svg" alt="Flame icon" className="w-[14px] h-[14px]" />

      <div className="flex flex-col leading-[1.1] items-start">
        <span className="text-[0.8rem] font-bold">{s}</span>
      </div>
    </div>
  );
}