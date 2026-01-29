import { useState } from 'react';
import SaveButton from '../../ui/Buttons/SaveButton';
import Modal from '../../ui/Modal';

export default function HabitChangeModal({ habit, onClose, edit }) {
  const [name, setName] = useState(habit?.habit_name || '');
  const [description, setDescription] = useState(habit?.description || '');
  // Funktion zum Speichern der Änderungen
  const handleSave = () => {
    edit(habit.id, { name, description });
  };

  return (
    <Modal
      title={"Gewohnheit bearbeiten"}
      onClose={onClose}
      size="lg"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-slate-600 text-primary4 hover:bg-slate-800 transition"
            onClick={onClose}
          >
            Abbrechen
          </button>
          <SaveButton onClick={handleSave} text="Änderungen speichern" />
        </div>
      }
    >
      {/* Content des Modals */}
      <div className="space-y-5">
        {/* Habitname Feld */}
        <div>
          <label className="block text-sm font-medium text-primary4 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-primary3 focus:outline-none focus:border-slate-400 transition text-white"
            placeholder="Gewohnheitsname"
          />
        </div>

        {/* Habitbeschreibung Feld */}
        <div>
          <label className="block text-sm font-medium text-primary4 mb-2">Beschreibung</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-primary3 focus:outline-none focus:border-slate-400 transition resize-none text-white"
            placeholder="Beschreibung der Gewohnheit"
            rows={4}
          />
        </div>
      </div>
    </Modal>
  );
}
