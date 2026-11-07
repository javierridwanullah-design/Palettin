'use client';

import React from 'react';

interface ToastProps {
  message: string;
  icon?: string;
  show: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, icon = '✓', show }) => {
  return (
    <div className={`toast-pill ${show ? 'show' : ''}`} role="alert">
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  );
};

