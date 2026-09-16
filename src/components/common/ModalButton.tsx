'use client';

import React from 'react';

export type ModalButtonVariant =
  | 'primary'
  | 'danger'
  | 'secondary'
  | 'gold'
  | 'cyan'
  | 'locked';

export type ModalButtonSize = 'sm' | 'md' | 'lg';

export interface ModalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ModalButtonVariant;
  size?: ModalButtonSize;
  fullWidth?: boolean;
}

export const ModalButton: React.FC<ModalButtonProps> = React.memo(({
  variant = 'secondary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  children,
  style,
  ...props
}) => {
  const isLocked = variant === 'locked' || disabled;
  const classes = [
    'modal-btn',
    `modal-btn-${size}`,
    `modal-btn-${variant}`,
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={isLocked}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
});

ModalButton.displayName = 'ModalButton';
