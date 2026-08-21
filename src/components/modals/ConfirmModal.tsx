'use client';

import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'ยืนยันการทำรายการ',
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="offline-backdrop" style={{ zIndex: 2500 }} onClick={onCancel}>
      <div className="modal-wrapper confirm-modal-wrapper" onClick={e => e.stopPropagation()}>
        <div className="offline-modal generic-modal confirm-modal-box">
          <div className="icon">⚠️</div>
          <h2>{title}</h2>
          <div className="away-time" style={{ marginBottom: '16px' }}>
            {message}
          </div>
          <div className="modal-actions">
            <button onClick={onConfirm}>ยืนยัน</button>
            <button className="secondary" onClick={onCancel}>
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
