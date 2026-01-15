import { useState } from 'react';

export default function HabitChangeModal({ habit, onClose, edit }) {
  const [name, setName] = useState(habit?.habit_name || '');
  const [description, setDescription] = useState(habit?.description || '');

  const handleSave = () => {
    edit(habit.id, { name, description });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 rounded-2xl bg-primary1 text-primary4 shadow-2xl border border-slate-700">
        <div className="flex items-center justify-between border-b border-primary4 px-6 py-4">
          <h1 className="text-lg font-semibold leading-tight">
            Gewohnheit bearbeiten
          </h1>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/80 text-primary4 text-sm hover:bg-slate-800 hover:text-white transition"
            aria-label="Schließen"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Name Feld */}
          <div>
            <label className="block text-sm font-medium text-primary4 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-primary3 focus:outline-none focus:border-slate-400 transition text-white"
              placeholder="Gewohnheitsname"
            />
          </div>

          {/* Beschreibung Feld */}
          <div>
            <label className="block text-sm font-medium text-primary4 mb-2">
              Beschreibung
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-primary3 focus:outline-none focus:border-slate-400 transition resize-none text-white"
              placeholder="Beschreibung der Gewohnheit"
              rows={4}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-primary4 px-6 py-4 flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-slate-600 text-primary4 hover:bg-slate-800 transition"
            onClick={onClose}
          >
            Abbrechen
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-primary3 text-white hover:bg-primary4 transition font-medium"
            onClick={handleSave}
          >
            Änderungen speichern
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';

export default function HabitChangeModal({ habit, onClose, edit }) {
  const [name, setName] = useState(habit?.habit_name || '');
  const [description, setDescription] = useState(habit?.description || '');

  const handleSave = () => {
    edit(habit.id, { name, description });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 rounded-2xl bg-primary1 text-primary4 shadow-2xl border border-slate-700">
        <div className="flex items-center justify-between border-b border-primary4 px-6 py-4">
          <h1 className="text-lg font-semibold leading-tight">
            Gewohnheit bearbeiten
          </h1>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/80 text-primary4 text-sm hover:bg-slate-800 hover:text-white transition"
            aria-label="Schließen"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* Name Feld */}
          <div>
            <label className="block text-sm font-medium text-primary4 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-primary3 focus:outline-none focus:border-slate-400 transition text-white"
              placeholder="Gewohnheitsname"
            />
          </div>

          {/* Beschreibung Feld */}
          <div>
            <label className="block text-sm font-medium text-primary4 mb-2">
              Beschreibung
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-primary3 focus:outline-none focus:border-slate-400 transition resize-none text-white"
              placeholder="Beschreibung der Gewohnheit"
              rows={4}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-primary4 px-6 py-4 flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-slate-600 text-primary4 hover:bg-slate-800 transition"
            onClick={onClose}
          >
            Abbrechen
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-primary3 text-white hover:bg-primary4 transition font-medium"
            onClick={handleSave}
          >
            Änderungen speichern
          </button>
        </div>
      </div>
    </div>
  );
}