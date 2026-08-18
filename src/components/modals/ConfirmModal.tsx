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
    <div className="offline-backdrop fixed inset-0 bg-[rgba(10,7,4,0.75)] flex items-center justify-center z-[60] p-5 backdrop-blur-xs">
      <div className="offline-modal bg-[var(--bg-panel)] border border-[var(--line-soil)] rounded-2xl p-6 max-w-[340px] w-full text-center shadow-2xl">
        <div className="text-3xl mb-1.5">⚠️</div>
        <h2 className="font-serif text-lg font-bold text-[var(--root-cream)] mb-1.5">
          {title}
        </h2>
        <div className="text-[12.5px] text-[var(--root-cream-dim)] mb-5 leading-relaxed">
          {message}
        </div>
        <div className="modal-actions flex gap-2 justify-center">
          <button
            onClick={onConfirm}
            className="flex-1 bg-[var(--accent-glow-dim)] text-[#12190d] border-none py-2 px-4 rounded-lg font-semibold text-sm cursor-pointer hover:brightness-110 active:scale-98 transition-all"
          >
            ยืนยัน
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-[var(--bg-panel-2)] text-[var(--root-cream)] border border-[var(--line-soil)] py-2 px-4 rounded-lg font-medium text-sm cursor-pointer hover:border-[var(--root-cream-dim)] transition-all"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
};
