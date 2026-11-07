'use client';

import React, { useEffect, useState } from 'react';

export const Header: React.FC = () => {
  const [theme, setTheme] = useState<'pastel-cream' | 'pastel-dusk'>('pastel-cream');

  useEffect(() => {
    const saved = localStorage.getItem('palettin-theme') as 'pastel-cream' | 'pastel-dusk' | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'pastel-cream' ? 'pastel-dusk' : 'pastel-cream';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('palettin-theme', next);
  };

  return (
    <header className="nav-header">
      <a href="#" className="brand-mark">
        <div className="brand-icon">🎨</div>
        <span className="brand-title">Palettin</span>
      </a>
      <button className="theme-switch-btn" onClick={toggleTheme} title="Ganti Tema">
        <span>{theme === 'pastel-dusk' ? '☀️' : '🌙'}</span>
        <span>{theme === 'pastel-dusk' ? 'Tema Cream' : 'Tema Dusk'}</span>
      </button>
    </header>
  );
};

