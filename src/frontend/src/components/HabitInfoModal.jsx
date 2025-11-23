// HabitInfoModal.jsx
export default function HabitInfoModal() {


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 rounded-2xl bg-slate-900 text-slate-100 shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-2xl">
              
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">
                Rauchen
              </h1>
               
                <p className="text-xs text-slate-400">
                Frequenz: 10
                </p>
              
            </div>
          </div>

          <button
            
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/80 text-slate-300 text-sm hover:bg-slate-800 hover:text-white transition"
            aria-label="Schließen"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Beschreibung */}
           
            <div>
              <p className="text-sm text-slate-200">
                Jeden Tag ne Schachtel rauchen
              </p>
            </div>
          

          {/* Kennzahlen */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
             
            />
            <StatCard
             
            />
            <StatCard
              
            />
            
          </div>

          {/* Timeline-Infos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3">
              <p className="text-slate-400 text-xs mb-1">
                Gestartet am
              </p>
              <p className="font-medium">
                23.12.2032
              </p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3">
              <p className="text-slate-400 text-xs mb-1">
                Zuletzt erledigt
              </p>
              <p className="font-medium">
                12.12.1212
              </p>
            </div>
          </div>

          {/* Progressbar für Erfolgsquote */}
           
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Fortschritt Richtung 100 %</span>
                <span>50 %</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all"
                  
                />
              </div>
            </div>
          
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center border-t border-slate-700 px-6 py-4">
          <p className="text-xs text-slate-400">
            Tipp: Kleine tägliche Schritte schlagen große, seltene Aktionen. ✨
          </p>

          <div className="flex gap-2">
            <button
              
              className="px-4 py-2 text-sm rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 transition"
            >
              Zurück
            </button>
            {/* Optional: Direkt heute abhaken */}
            <button
              type="button"
              className="px-4 py-2 text-sm rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold transition"
            >
              Heute erledigt ✅
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Kleiner Helper-Component für Kennzahlen-Karten
 */
function StatCard() {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3">
      <p className="text-xs text-slate-400 mb-1">
        Testkarte
      </p>
      <p className="text-xl font-semibold leading-tight">
        10
      </p>
       
        <p className="text-[11px] text-slate-500 mt-1">
          
        </p>
      
    </div>
  );
}
