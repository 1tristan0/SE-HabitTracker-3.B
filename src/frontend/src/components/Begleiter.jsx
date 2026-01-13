export default function Begleiter({ selectedBegleiter, onClick, begleiterMood }) {
    const images = {
        katze: '/images/cat(1).png',
        katzeTraurig: '/images/Katze_unhappy.png',
        hundTraurig: '/images/Hund_unhappy.png',
        wurmTraurig: '/images/wurm_unhappy.png',
        hamsterTraurig: '/images/hamster_unhappy.png',
        hund: '/images/dog(1).png',
        wurm: '/images/worm(1).png',
        hamster: '/images/hamster(1).png',
    };

    const src = images[selectedBegleiter + (begleiterMood === "traurig" ? "Traurig" : "")] || null;

    return (
        <div className="fixed bottom-4 right-4 z-40">
      <div
        onClick={onClick}
        role="button"
        aria-label="Begleiter auswählen"
        className="w-36 h-36 p-2 bg-primary1 text-primary4 rounded-xl shadow-lg border border-slate-700 flex items-center justify-center cursor-pointer"
      >
        {src ? (
          <img src={src} alt={selectedBegleiter} className="w-28 h-28 object-contain block" />
        ) : (
          <div className="text-sm">Kein Begleiter</div>
        )}
      </div>
    </div>
    );
}