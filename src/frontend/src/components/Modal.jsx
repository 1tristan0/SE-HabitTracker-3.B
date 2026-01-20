import CloseButton from './ui/CloseButton';

export default function Modal({
  title,
  onClose,
  children,
  footer,
  showClose = true,
  size = 'lg',
  className = '',
  closeOnBackdropClick = true,
  headerRight = null,
  ariaLabel,
}) {
  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
  };

  const maxW = sizeMap[size] || sizeMap.lg;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => {
        if (closeOnBackdropClick && typeof onClose === 'function') onClose();
      }}
    >
      <div
        className={`w-full ${maxW} mx-4 rounded-2xl bg-primary1 text-primary4 shadow-2xl border border-slate-700 ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-primary4/40 px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold leading-tight">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            {headerRight}
            {showClose && <CloseButton onClose={onClose} />}
          </div>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer && <div className="border-t border-primary4 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
