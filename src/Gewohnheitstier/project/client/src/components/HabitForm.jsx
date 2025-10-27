// client/src/components/HabitForm.jsx
import { useState } from 'react';

export default function HabitForm({ onAdd }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onAdd(name, desc); setName(''); setDesc(''); }} className="mb-5">
      <div className="mb-3">
        <label className="form-label">Name der Gewohnheit</label>
        <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Beschreibung</label>
        <textarea className="form-control" rows={3} value={desc} onChange={e=>setDesc(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary">Hinzufügen</button>
    </form>
  );
}