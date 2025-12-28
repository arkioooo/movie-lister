import React from 'react';

export default function ConfirmModal({
  title = 'Are you sure?',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="confirm-modal">
      <h3>{title}</h3>

      {message && <p className="muted">{message}</p>}

      <div className="confirm-actions">
        <button
          className="btn btn-secondary"
          onClick={onCancel}
        >
          {cancelText}
        </button>

        <button
          className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
          onClick={onConfirm}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
