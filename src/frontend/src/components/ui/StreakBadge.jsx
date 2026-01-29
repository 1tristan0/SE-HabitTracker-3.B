export default function StreakBadge({ streak = 0 }) {
  const s = Number(streak) || 0;
  let bg = "#e9ecef";
  let textColor = "#222";

  if (s >= 30) {
    // Gold Gradient für 30+ Tage
    bg = "gradient-gold";
    textColor = "text-[#3b2f00]";
  } else if (s >= 7) {
    // Grün für 7-29 Tage
    bg = "bg-[#ff7a00]";
    textColor = "text-white";
  } else if (s >= 3) {
    // Blau für 3-6 Tage
    bg = "bg-[#2f9e44]";
    textColor = "text-white";
  }

  const bgClasses =
    s >= 30
      ? "bg-gradient-to-br from-[#ffd166] to-[#f4a261]"
      : bg; 
  const textClasses = s >= 30 ? textColor : textColor; 

  return (
    <div
      className={`streak-badge ${baseClasses} ${bgClasses} ${textClasses}`}
      title={`Streak: ${s} ${s === 1 ? "Tag" : "Tage"}`}
    >
      <img src="/flame.svg" alt="Flame icon" className="w-[14px] h-[14px]" />

      <div className="flex flex-col leading-[1.1] items-start">
        <span className="text-[0.8rem] font-bold">{s}</span>
      </div>
    </div>
  );
}