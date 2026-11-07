'use client';

import React from 'react';

interface ImagePreviewProps {
  imageSrc: string;
  colorCount: number;
  onColorCountChange: (count: number) => void;
  onReExtract: () => void;
  onReset: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageSrc,
  colorCount,
  onColorCountChange,
  onReExtract,
  onReset,
}) => {
  return (
    <section className="section-visible panel-card">
      <div className="panel-header">
        <h3 className="panel-title">Gambar Terpilih</h3>
        <button className="btn-soft" onClick={onReset}>
          <span>↩</span> Ganti Gambar
        </button>
      </div>

      <div className="preview-frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt="Pratinjau Foto" />
      </div>

      <div className="slider-row">
        <div className="slider-container">
          <label htmlFor="colorCount">Jumlah Warna Palet:</label>
          <input
            type="range"
            id="colorCount"
            min={3}
            max={12}
            value={colorCount}
            onChange={(e) => onColorCountChange(Number(e.target.value))}
          />
          <span className="badge-count">{colorCount}</span>
        </div>
        <button className="btn-pill" onClick={onReExtract}>
          Ekstrak Ulang
        </button>
      </div>
    </section>
  );
};

