'use client';

import React from 'react';
import { ColorItem } from '@/types';
import { toHex, calcContrast } from '@/lib/colorUtils';

interface ContrastTabProps {
  contrastColor1: ColorItem | null;
  contrastColor2: ColorItem | null;
  contrastSlot: 1 | 2;
  onSlotChange: (slot: 1 | 2) => void;
  onSwap: () => void;
}

export const ContrastTab: React.FC<ContrastTabProps> = ({
  contrastColor1,
  contrastColor2,
  contrastSlot,
  onSlotChange,
  onSwap,
}) => {
  if (!contrastColor1 && !contrastColor2) {
    return (
      <div className="tab-body-card">
        <div className="placeholder-state">
          <div className="placeholder-icon">⚖️</div>
          <p>
            Pilih dua warna dari palet di atas untuk memeriksa keterbacaan teks dan kepatuhan standar WCAG.
          </p>
        </div>
      </div>
    );
  }

  const c1 = contrastColor1 || { r: 255, g: 255, b: 255, percentage: '100' };
  const c2 = contrastColor2 || { r: 44, g: 38, b: 35, percentage: '100' };
  const h1 = toHex(c1.r, c1.g, c1.b).toUpperCase();
  const h2 = toHex(c2.r, c2.g, c2.b).toUpperCase();

  const ratio = calcContrast(c1, c2);
  const ratioStr = ratio.toFixed(2);

  const isAANormal = ratio >= 4.5;
  const isAALarge = ratio >= 3.0;
  const isAAANormal = ratio >= 7.0;
  const isAAALarge = ratio >= 4.5;

  const scoreColor = ratio >= 7 ? '#2E7D32' : ratio >= 4.5 ? '#E65100' : '#C62828';

  return (
    <div className="tab-body-card">
      <div className="contrast-layout">
        <div
          className={`contrast-box ${contrastSlot === 1 ? 'picking' : ''}`}
          onClick={() => onSlotChange(1)}
        >
          <div className="contrast-swatch-thumb" style={{ background: h1 }} />
          <div className="contrast-box-label">Warna Teks (Depan)</div>
          <div className="contrast-box-val">{h1}</div>
        </div>

        <div className="btn-swap-contrast" onClick={onSwap} title="Tukar Warna">
          ⇄
        </div>

        <div
          className={`contrast-box ${contrastSlot === 2 ? 'picking' : ''}`}
          onClick={() => onSlotChange(2)}
        >
          <div className="contrast-swatch-thumb" style={{ background: h2 }} />
          <div className="contrast-box-label">Warna Latar (Belakang)</div>
          <div className="contrast-box-val">{h2}</div>
        </div>
      </div>

      <div className="contrast-results-grid">
        <div className="contrast-result-card">
          <div className="contrast-score-num" style={{ color: scoreColor }}>
            {ratioStr}:1
          </div>
          <div className="contrast-score-title">Rasio Kontras</div>
          <div className="contrast-specimen" style={{ background: h2, color: h1 }}>
            <div className="headline">Pratinjau Judul</div>
            <div className="body-txt">Teks paragraf ini untuk membaca keterbacaan font normal.</div>
          </div>
          <div className="wcag-pills">
            <span className={`wcag-pill ${isAANormal ? 'pass' : 'fail'}`}>
              {isAANormal ? '✓' : '✗'} AA Teks Normal
            </span>
            <span className={`wcag-pill ${isAALarge ? 'pass' : 'fail'}`}>
              {isAALarge ? '✓' : '✗'} AA Teks Besar
            </span>
          </div>
        </div>

        <div className="contrast-result-card">
          <div className="contrast-score-num" style={{ color: scoreColor }}>
            {ratioStr}:1
          </div>
          <div className="contrast-score-title">Tampilan Terbalik</div>
          <div className="contrast-specimen" style={{ background: h1, color: h2 }}>
            <div className="headline">Inverted Title</div>
            <div className="body-txt">Melihat kenyamanan mata jika latar dan warna teks ditukar.</div>
          </div>
          <div className="wcag-pills">
            <span className={`wcag-pill ${isAAANormal ? 'pass' : 'fail'}`}>
              {isAAANormal ? '✓' : '✗'} AAA Normal
            </span>
            <span className={`wcag-pill ${isAAALarge ? 'pass' : 'fail'}`}>
              {isAAALarge ? '✓' : '✗'} AAA Besar
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

