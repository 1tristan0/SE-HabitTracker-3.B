import React from 'react';

export default function ToggleSwitch({ id, checked, onToggle, ariaLabel = 'Toggle', className = '', style = {}, disabled = false }) {
  const wrapperClass = `form-check form-switch mb-0 ${className}`.trim();

  return (
    <div className={wrapperClass} style={{ transform: 'scale(0.9)', ...style }}>
      <input
        type="checkbox"
        className="form-check-input"
        id={id}
        checked={checked}
        disabled={disabled}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          // Verhindert das Auslösen von onClick des übergeordneten Elements 
          e.stopPropagation();
        }}
        onChange={(e) => {
          e.stopPropagation();
          onToggle && onToggle(e.target.checked);
        }}
        aria-label={ariaLabel}
      />
    </div>
  );
}
