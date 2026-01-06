
export default function BegleiterModal({ onClose }) {
    const handleSave = () => {
        // Logik zum Speichern der Auswahl
        console.log("Begleiter gespeichert");
        onClose();
    };
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-full max-w-2xl mx-4 rounded-2xl bg-primary1 text-primary4 shadow-2xl border border-slate-700">
          <div className="flex items-center justify-between border-b border-primary4 px-6 py-4">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-lg font-semibold leading-tight">
                  Wähle deinen Begleiter aus
                </h1>
                
              </div>
            </div>
  
            <button
              
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/80 text-primary4 text-sm hover:bg-slate-800 hover:text-white transition"
              aria-label="Schließen"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
  
          {/* Content */}
          <div className="px-6 py-5 space-y-6 flex justify-center">
            <img src="/images/cat.png" alt="Begleiter Auswahl" width={150} height={100} className="mx-auto"/>
            <img src="/images/dog.png" alt="Begleiter Auswahl" width={150} height={100} className="mx-auto"/>
            <img src="/images/worm.png" alt="Begleiter Auswahl" width={100} height={100} className="mx-auto"/>
            <img src="/images/hamster.png" alt="Begleiter Auswahl" width={100} height={100} className="mx-auto"/>
            
            
          </div>
        </div>
        <button className="mt-6 btn btn-primary" onClick={handleSave}>Speichern</button>
      </div>
    );
}