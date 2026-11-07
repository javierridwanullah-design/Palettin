'use client';

import React from 'react';
import { ColorItem } from '@/types';
import { toHex, toHSL, getPastelName, getHarmonies, hsl2hex, copyToClipboard } from '@/lib/colorUtils';

interface HarmonyTabProps {
  selectedColor: ColorItem | null;
  onToast: (msg: string, icon?: string) => void;
}

export const HarmonyTab: React.FC<HarmonyTabProps> = ({ selectedColor, onToast }) => {
  if (!selectedColor) {
    return (
      <div className="tab-body-card">
        <div className="placeholder-state">
          <div className="placeholder-icon">🌸</div>
          <p>
            Pilih warna pada palet untuk melihat perhitungan harmoni komplementer, analog, triadic, dan tetradic.
          </p>
        </div>
      </div>
    );
  }

  const hex = toHex(selectedColor.r, selectedColor.g, selectedColor.b).toUpperCase();
  const hsl = toHSL(selectedColor.r, selectedColor.g, selectedColor.b);
  const name = getPastelName(selectedColor.r, selectedColor.g, selectedColor.b);
  const harmonyMap = getHarmonies(selectedColor);

  const copyText = async (txt: string) => {
    await copyToClipboard(txt);
    onToast(`Tersalin: ${txt}`, '✓');
  };

  return (
    <div className="tab-body-card">
      <div className="harmony-base-bar">
        <div className="base-dot" style={{ background: hex }} />
        <div className="base-info">
          <h4>Warna Acuan: {name}</h4>
          <p>
            {hex} • HSL({hsl.h}, {hsl.s}%, {hsl.l}%)
          </p>
        </div>
      </div>

      <div className="harmony-items-list">
        {Object.entries(harmonyMap).map(([title, arr]) => {
          const hexList = arr.map(h => hsl2hex(h.h, h.s, h.l).toUpperCase());
          return (
            <div key={title} className="harmony-card-row">
              <div className="harmony-row-top">
                <h5>{title}</h5>
                <button
                  className="btn-soft"
                  style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                  onClick={() => copyText(hexList.join(', '))}
                >
                  Salin Rangkaian
                </button>
              </div>
              <div className="harmony-strip-boxes">
                {arr.map((h, i) => {
                  const hx = hsl2hex(h.h, h.s, h.l).toUpperCase();
                  return (
                    <div
                      key={i}
                      className="harmony-swatch-slot"
                      style={{ background: hx }}
                      onClick={() => copyText(hx)}
                    >
                      <span className="hex-tip">{hx}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

