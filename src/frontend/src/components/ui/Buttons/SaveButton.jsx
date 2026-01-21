export default function SaveButton({ onClick, disabled, text }) {
    return(
        <button
            type="button"
            className="px-4 py-2 rounded-lg bg-primary3 text-white hover:bg-primary4 transition font-medium"
            onClick={onClick}
            disabled={disabled}
          >
            {text}
          </button>
    );
}