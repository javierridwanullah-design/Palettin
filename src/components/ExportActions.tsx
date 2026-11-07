'use client';

import React from 'react';
import { ColorItem } from '@/types';
import {
  generateCSS,
  generateTailwind,
  generateJSON,
  downloadSVG,
  downloadPNG,
  copyToClipboard,
} from '@/lib/colorUtils';

interface ExportActionsProps {
  colors: ColorItem[];
  onToast: (msg: string, icon?: string) => void;
}

export const ExportActions: React.FC<ExportActionsProps> = ({ colors, onToast }) => {
  const handleCopyCSS = async () => {
    const css = generateCSS(colors);
    await copyToClipboard(css);
    onToast('Variabel CSS tersalin ke papan klip.', '✓');
  };

  const handleCopyTailwind = async () => {
    const tw = generateTailwind(colors);
    await copyToClipboard(tw);
    onToast('Config Tailwind CSS tersalin ke papan klip.', '✨');
  };

  const handleCopyJSON = async () => {
    const json = generateJSON(colors);
    await copyToClipboard(json);
    onToast('Format JSON tersalin ke papan klip.', '✓');
  };

  const handleDownloadSVG = () => {
    downloadSVG(colors);
    onToast('File SVG berhasil diunduh.', '🖼️');
  };

  const handleDownloadPNG = () => {
    downloadPNG(colors);
    onToast('File PNG berhasil diunduh.', '📸');
  };

  return (
    <div className="export-container">
      <button className="btn-soft" onClick={handleCopyCSS}>
        Salin Variabel CSS
      </button>
      <button className="btn-soft" onClick={handleCopyTailwind}>
        Salin Config Tailwind
      </button>
      <button className="btn-soft" onClick={handleCopyJSON}>
        Salin Format JSON
      </button>
      <button className="btn-soft" onClick={handleDownloadSVG}>
        Unduh File SVG
      </button>
      <button className="btn-soft" onClick={handleDownloadPNG}>
        Unduh File PNG
      </button>
    </div>
  );
};

