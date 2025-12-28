import React, { useEffect } from 'react';

export default function Toast({
  message,
  actionLabel,
  duration = 5000,
  onAction,
  onClose,
}) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div className="toast">
      <span>{message}</span>

      {actionLabel && (
        <button
          className="toast-action"
          onClick={() => {
            onAction?.();
            onClose();
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
