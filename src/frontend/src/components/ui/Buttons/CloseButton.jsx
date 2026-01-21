export default function CloseButton({ onClose }) {
  return (
    <button
              
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/80 text-primary4 text-sm hover:bg-slate-800 hover:text-white transition"
        aria-label="Schließen"
        onClick={onClose}
    >
        ✕
    </button>
  );
}