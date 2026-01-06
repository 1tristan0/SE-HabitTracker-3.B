
import { useState } from 'react';

export default function BegleiterModal({ onClose }) {
  const [selected, setSelected] = useState(null);

  const handleSave = () => {
    if (selected) {
      console.log("Ausgewählter Begleiter:", selected);
    } else {
      console.log("Kein Begleiter ausgewählt");
    }
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
          <div className="px-6 py-5 space-y-6 flex justify-center gap-4">
            <img
              src="/images/cat(1).png"
              alt="Katze"
              width={100}
              height={100}
              onClick={() => setSelected('cat')}
              className={`mx-auto cursor-pointer rounded-lg ${selected === 'cat' ? 'ring-4 ring-primary4' : ''}`}
            />
            <img
              src="/images/dog(1).png"
              alt="Hund"
              width={100}
              height={100}
              onClick={() => setSelected('dog')}
              className={`mx-auto cursor-pointer rounded-lg ${selected === 'dog' ? 'ring-4 ring-primary4' : ''}`}
            />
            <img
              src="/images/worm(1).png"
              alt="Wurm"
              width={100}
              height={100}
              onClick={() => setSelected('worm')}
              className={`mx-auto cursor-pointer rounded-lg ${selected === 'worm' ? 'ring-4 ring-primary4' : ''}`}
            />
            <img
              src="/images/hamster(1).png"
              alt="Hamster"
              width={100}
              height={100}
              onClick={() => setSelected('hamster')}
              className={`mx-auto cursor-pointer rounded-lg ${selected === 'hamster' ? 'ring-4 ring-primary4' : ''}`}
            />
            
            
          </div>
          <button className="mt-6 btn btn-primary" onClick={handleSave}>Speichern</button>
        </div>
        
      </div>
    );
}