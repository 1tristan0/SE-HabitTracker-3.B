
export default function InputField({ label, type = 'text', value, onChange, required = true, placeholder = '' }) {
  const inputId = `input-${label.replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-primary3 mb-1">{label}</label>
      <input
        id={inputId}
        type={type}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary3"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}
