// client/src/components/HabitForm.jsx
export default function HabitForm({ onAdd }) {
    const [name, setName] = useState(''); const [desc, setDesc] = useState('');
    return (
      <form onSubmit={(e)=>{e.preventDefault(); onAdd(name,desc); setName(''); setDesc('');}}>
        {/* Inputs… */}
        <button type="submit" className="btn btn-primary">Hinzufügen</button>
      </form>
    );
  }