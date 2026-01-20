export default function StreakBadge({ streak = 0 }) {
  const s = Number(streak) || 0;
  let bg = "#e9ecef";
  let textColor = "#222";

  if (s >= 30) {
    bg = "linear-gradient(135deg,#ffd166,#f4a261)";
    textColor = "#3b2f00";
  } else if (s >= 7) {
    bg = "#ff7a00";
    textColor = "#fff";
  } else if (s >= 3) {
    bg = "#2f9e44";
    textColor = "#fff";
  }

  const containerStyle = {
    minWidth: 46,
    height: 32,              // smaller than before → more compact
    borderRadius: 999,
    padding: "4px 8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,

    background: bg,
    color: textColor,
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  };

  return (
    <div
      className="streak-badge"
      title={`Streak: ${s} ${s === 1 ? "Tag" : "Tage"}`}
      style={{ ...containerStyle, overflow: "visible" }}
    >
      <img src="/flame.svg" alt="Flame icon" fill="orange" style={{ width: 14, height: 14 }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1.1,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>{s}</span>
      </div>
    </div>
  );
}