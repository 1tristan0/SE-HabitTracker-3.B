export default function HabitChangeModal({ habit, onClose }) {
  return (
    <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Gewohnheit bearbeiten</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    <p>Hier können Sie die Gewohnheit "{habit.habit_name}" bearbeiten.</p>
                    {/* Formularfelder zum Bearbeiten der Gewohnheit würden hier hinzugefügt werden */}
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Schließen</button>
                    <button type="button" className="btn btn-primary">Änderungen speichern</button>
                </div>
            </div>
        </div>
    </div>
  );
}