'use client';

import React from 'react';
import { ColorItem, ColorFormat } from '@/types';
import { toHex, formatValue, getPastelName, copyToClipboard } from '@/lib/colorUtils';

interface SwatchesGridProps {
  colors: ColorItem[];
  selectedIndex: number;
  format: ColorFormat;
  onSelectColor: (index: number) => void;
  onToast?: (msg: string, icon?: string) => void;
}

export const SwatchesGrid: React.FC<SwatchesGridProps> = ({
  colors,
  selectedIndex,
  format,
  onSelectColor,
  onToast,
}) => {
  return (
    <div className="swatches-grid">
      {colors.map((c, i) => {
        const hex = toHex(c.r, c.g, c.b);
        const code = formatValue(c, format);
        const name = getPastelName(c.r, c.g, c.b);
        const isSelected = i === selectedIndex;

        return (
          <div
            key={i}
            className={`swatch-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectColor(i)}
            title="Klik untuk memilih warna"
          >
            <div className="swatch-color-box" style={{ background: hex }}>
              <span className="swatch-percentage">{c.percentage}%</span>
            </div>
            <div className="swatch-details">
              <span
                className="swatch-code"
                title="Klik untuk salin kode warna ini"
                style={{ cursor: 'copy' }}
                onClick={async (e) => {
                  e.stopPropagation();
                  await copyToClipboard(code);
                  onToast?.(`Kode ${code} disalin!`, '✓');
                }}
              >
                {code}
              </span>
              <span className="swatch-named">{name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

