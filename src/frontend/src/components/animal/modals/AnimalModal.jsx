import { useState } from 'react';
import { setAnimal } from '../../../api/userApi';
import SaveButton from '../../ui/Buttons/SaveButton';
import Modal from '../../ui/Modal';

export default function AnimalModal({ onClose, onSelect, animalMood, token }) {
  const [selected, setSelected] = useState(null);
  // Begleiter speichern
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
    <Modal
      title={"Wähle deinen Begleiter aus"}
      onClose={onClose}
      size="lg"
      footer={<SaveButton onClick={handleSave} text="Speichern" />}
    >
      {/* Content */}
      <div className="space-y-6 flex items-center justify-center gap-4">
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
    </Modal>
  );
}