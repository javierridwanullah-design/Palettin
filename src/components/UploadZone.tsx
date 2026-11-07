'use client';

import React, { useRef, useState, useEffect } from 'react';

interface UploadZoneProps {
  onImageSelected: (dataUrl: string) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected, onToast }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      for (const item of Array.from(e.clipboardData.items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            readFile(file);
            break;
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        onImageSelected(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      readFile(e.target.files[0]);
    }
  };

  const handleUrlLoad = () => {
    const url = urlInput.trim();
    if (!url) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          onImageSelected(canvas.toDataURL());
        }
      } catch {
        onToast('Gagal memproses gambar dari URL ini karena pembatasan CORS (Cross-Origin). Silakan unduh gambar dan unggah langsung.', '⚠️');
      }
    };
    img.onerror = () => {
      onToast('Gagal memuat gambar dari tautan tersebut.', '⚠️');
    };
    img.src = url;
  };

  return (
    <div
      className={`upload-card ${isDragOver ? 'drag-over' : ''}`}
      onClick={(e) => {
        const tag = (e.target as HTMLElement).tagName;
        if (!['INPUT', 'BUTTON'].includes(tag)) {
          fileInputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          readFile(file);
        }
      }}
    >
      <div className="upload-cluster">
        <div className="cluster-bubble" style={{ background: 'var(--pastel-peach)' }}>🖼️</div>
        <div className="cluster-bubble" style={{ background: 'var(--pastel-matcha)' }}>✨</div>
        <div className="cluster-bubble" style={{ background: 'var(--pastel-sky)' }}>🎨</div>
      </div>
      <h3>Tarik dan Lepaskan Foto di Sini</h3>
      <p className="sub">
        Mendukung format JPG, PNG, atau WEBP. Anda juga dapat menekan{' '}
        <kbd style={{ background: 'var(--surface-subtle)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border)' }}>
          Ctrl + V
        </kbd>{' '}
        untuk menempelkan gambar.
      </p>

      <div className="clean-line">atau gunakan tautan gambar</div>

      <div className="url-row" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className="url-input"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="https://example.com/foto-desain.jpg"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleUrlLoad();
          }}
        />
        <button className="btn-pill" onClick={handleUrlLoad}>
          Ekstrak Warna
        </button>
      </div>

      {/* Preset Coba Langsung */}
      <div style={{ marginTop: '24px' }} onClick={(e) => e.stopPropagation()}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-soft)', display: 'block', marginBottom: '10px' }}>
          Atau coba foto contoh berikut:
        </span>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-soft"
            style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            onClick={() => {
              onImageSelected(
                `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fce2d6"/><stop offset="50%" stop-color="%23f4b8b0"/><stop offset="100%" stop-color="%23dce8dc"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g1)"/><circle cx="180" cy="160" r="110" fill="%23d98880" opacity="0.8"/><circle cx="420" cy="240" r="130" fill="%23dce8dc" opacity="0.9"/><circle cx="310" cy="200" r="70" fill="%23fff4e6" opacity="0.95"/></svg>`
              );
              onToast('Foto contoh Sakura Sunset dimuat', '🌸');
            }}
          >
            🌸 Sakura Sunset
          </button>
          <button
            type="button"
            className="btn-soft"
            style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            onClick={() => {
              onImageSelected(
                `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23dbeaf2"/><stop offset="50%" stop-color="%238ec5d6"/><stop offset="100%" stop-color="%23437f97"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g2)"/><circle cx="450" cy="120" r="100" fill="%23ffd166" opacity="0.85"/><circle cx="200" cy="270" r="140" fill="%232b5973" opacity="0.75"/></svg>`
              );
              onToast('Foto contoh Ocean Breeze dimuat', '🌊');
            }}
          >
            🌊 Ocean Breeze
          </button>
          <button
            type="button"
            className="btn-soft"
            style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            onClick={() => {
              onImageSelected(
                `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f5f3e9"/><stop offset="50%" stop-color="%23cbd5b0"/><stop offset="100%" stop-color="%237b906f"/></linearGradient></defs><rect width="600" height="400" fill="url(%23g3)"/><circle cx="220" cy="170" r="120" fill="%238a9a5b" opacity="0.8"/><circle cx="390" cy="230" r="100" fill="%23dfd8c8" opacity="0.9"/><circle cx="480" cy="130" r="60" fill="%23e8927c" opacity="0.75"/></svg>`
              );
              onToast('Foto contoh Matcha Cafe dimuat', '🍵');
            }}
          >
            🍵 Matcha Cafe
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

