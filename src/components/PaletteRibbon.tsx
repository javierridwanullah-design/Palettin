'use client';

import React from 'react';
import { ColorItem } from '@/types';
import { toHex } from '@/lib/colorUtils';

interface PaletteRibbonProps {
  colors: ColorItem[];
  onSelectColor: (index: number) => void;
}

export const PaletteRibbon: React.FC<PaletteRibbonProps> = ({ colors, onSelectColor }) => {
  return (
    <div className="palette-ribbon">
      {colors.map((c, i) => {
        const hex = toHex(c.r, c.g, c.b).toUpperCase();
        return (
          <div
            key={i}
            className="ribbon-bar"
            style={{ background: hex }}
            data-label={hex}
            onClick={() => onSelectColor(i)}
          />
        );
      })}
    </div>
  );
};

