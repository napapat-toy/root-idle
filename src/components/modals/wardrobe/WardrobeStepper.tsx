'use client';

import React from 'react';

interface WardrobeStepperProps {
  curIndex: number;
  totalCount: number;
  curName: string;
  onPrev: () => void;
  onNext: () => void;
}

export const WardrobeStepper: React.FC<WardrobeStepperProps> = React.memo(({
  curIndex,
  totalCount,
  curName,
  onPrev,
  onNext,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-panel-2)',
        border: '1px solid var(--line-soil)',
        borderRadius: '16px',
        padding: '10px 12px',
        gap: '10px',
        boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.3)',
      }}
    >
      <button
        onClick={onPrev}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'var(--bg-panel)',
          border: '1px solid var(--line-soil)',
          color: 'var(--root-cream)',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
          userSelect: 'none',
        }}
        aria-label="Previous Item"
      >
        ◀
      </button>

      <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
        <div style={{ fontSize: '11px', color: 'var(--root-cream-dim)', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
          {curIndex + 1} / {totalCount}
        </div>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--root-cream)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {curName}
        </div>
      </div>

      <button
        onClick={onNext}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'var(--bg-panel)',
          border: '1px solid var(--line-soil)',
          color: 'var(--root-cream)',
          fontSize: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
          userSelect: 'none',
        }}
        aria-label="Next Item"
      >
        ▶
      </button>
    </div>
  );
});

WardrobeStepper.displayName = 'WardrobeStepper';
