
import { useState } from 'react';
import { setAnimal } from '../api/userApi';

export default function BegleiterModal({ onClose, onSelect, animalMood, token }) {
  const [selected, setSelected] = useState(null);

  const handleSave = async () => {
    if (selected) {
      console.log('Ausgewählter Begleiter:', selected);
      try {
        await setAnimal(token, selected, animalMood);
        if (typeof onSelect === 'function') onSelect(selected, animalMood);
      } catch (err) {
        console.error('Fehler beim Speichern des Begleiters:', err);
      }
    } else {
      console.log('Kein Begleiter ausgewählt');
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
          <div className="px-6 py-5 space-y-6 flex items-center justify-center gap-4">
            <img
              src="/images/cat(1).png"
              alt="Katze"
              onClick={() => setSelected('katze')}
              className={`mx-auto block cursor-pointer rounded-lg w-24 h-24 object-contain mt-3 ${selected === 'katze' ? 'ring-4 ring-primary4' : ''}`}
            />
            <img
              src="/images/dog(1).png"
              alt="Hund"
              onClick={() => setSelected('hund')}
              className={`mx-auto block cursor-pointer rounded-lg w-24 h-24 object-contain mt-2 ${selected === 'hund' ? 'ring-4 ring-primary4' : ''}`}
            />
            <img
              src="/images/worm(1).png"
              alt="Wurm"
              onClick={() => setSelected('wurm')}
              className={`mx-auto block cursor-pointer rounded-lg w-24 h-24 object-contain mt-2 ${selected === 'wurm' ? 'ring-4 ring-primary4' : ''}`}
            />
            <img
              src="/images/hamster(1).png"
              alt="Hamster"
              onClick={() => setSelected('hamster')}
              className={`mx-auto block cursor-pointer rounded-lg w-24 h-24 object-contain mt-2 ${selected === 'hamster' ? 'ring-4 ring-primary4' : ''}`}
            />
            
            
          </div>
          <button className="px-3 py-1 rounded bg-primary3 hover:bg-primary4 text-primary1 float-end m-3" onClick={handleSave}>Speichern</button>
        </div>
        
      </div>
    );
}