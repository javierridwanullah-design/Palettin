'use client';

import React, { useState } from 'react';
import { ColorItem } from '@/types';
import { toHex, getPastelName, getCompanionRecommendations, copyToClipboard } from '@/lib/colorUtils';

interface MatchingTabProps {
  selectedColor: ColorItem | null;
  selectedCompanionIndex: number;
  onSelectCompanion: (index: number) => void;
  onToast: (msg: string, icon?: string) => void;
}

export const MatchingTab: React.FC<MatchingTabProps> = ({
  selectedColor,
  selectedCompanionIndex,
  onSelectCompanion,
  onToast,
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  if (!selectedColor) {
    return (
      <div className="tab-body-card">
        <div className="placeholder-state">
          <div className="placeholder-icon">🎯</div>
          <p>
            Silakan klik salah satu warna dari palet di atas untuk melihat warna pendamping yang cocok dan simulasinya pada website.
          </p>
        </div>
      </div>
    );
  }

  const baseHex = toHex(selectedColor.r, selectedColor.g, selectedColor.b).toUpperCase();
  const baseName = getPastelName(selectedColor.r, selectedColor.g, selectedColor.b);
  const companions = getCompanionRecommendations(selectedColor);
  const activeCompanion = companions[selectedCompanionIndex] || companions[0];

  const isBaseLight =
    (0.299 * selectedColor.r + 0.587 * selectedColor.g + 0.114 * selectedColor.b) / 255 > 0.55;
  const mockWebBg = companions[2].hex;
  const mockCardBg = '#FFFFFF';
  const mockText = companions[3].hex;
  const mockPrimary = baseHex;
  const mockSecondary = activeCompanion.hex;

  const primaryText = isBaseLight ? '#2C2623' : '#FFFFFF';
  const secLum =
    (0.299 * activeCompanion.rgb.r + 0.587 * activeCompanion.rgb.g + 0.114 * activeCompanion.rgb.b) / 255;
  const secondaryText = secLum > 0.55 ? '#2C2623' : '#FFFFFF';

  const copyHex = async (txt: string) => {
    await copyToClipboard(txt);
    onToast(`Tersalin: ${txt}`, '✓');
  };

  return (
    <div className="tab-body-card">
      {/* Status Warna yang Dipilih */}
      <div className="matching-header">
        <div className="selected-indicator">
          <div className="indicator-swatch" style={{ background: baseHex }} />
          <div className="indicator-text">
            <h4>Warna Dasar Terpilih: {baseName}</h4>
            <p>{baseHex} • Pilihan dari Palet Foto Anda</p>
          </div>
        </div>
        <button className="btn-soft" onClick={() => copyHex(baseHex)}>
          Salin Kode Warna
        </button>
      </div>

      {/* Rekomendasi Warna yang Cocok */}
      <div className="recommendations-title">Pilihan Warna Pendamping yang Cocok:</div>
      <div className="recommendations-grid">
        {companions.map((c, idx) => (
          <div
            key={idx}
            className={`rec-card ${idx === selectedCompanionIndex ? 'active' : ''}`}
            onClick={() => onSelectCompanion(idx)}
          >
            <div className="rec-thumb" style={{ background: c.hex }} />
            <div className="rec-info">
              <div className="rec-role">{c.role}</div>
              <div className="rec-hex">{c.hex.toUpperCase()}</div>
              <div className="rec-reason">{c.reason}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Header Pratinjau dengan Toggle Device Mode */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '24px',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div className="recommendations-title" style={{ margin: 0 }}>
          Pratinjau Saat Diaplikasikan Menjadi Halaman Website:
        </div>
        <div className="format-pills">
          <button
            type="button"
            className={`format-pill ${deviceView === 'desktop' ? 'active' : ''}`}
            onClick={() => setDeviceView('desktop')}
            title="Tampilan Layar Komputer / Laptop"
          >
            💻 Mode Laptop
          </button>
          <button
            type="button"
            className={`format-pill ${deviceView === 'mobile' ? 'active' : ''}`}
            onClick={() => setDeviceView('mobile')}
            title="Tampilan Layar Smartphone / HP"
          >
            📱 Mode HP
          </button>
        </div>
      </div>

      {/* Mockup Container */}
      <div
        className="mockup-wrapper"
        style={{
          background: mockWebBg,
          borderColor: 'var(--border)',
          maxWidth: deviceView === 'mobile' ? '380px' : '100%',
          margin: deviceView === 'mobile' ? '0 auto' : '0',
          borderRadius: deviceView === 'mobile' ? '32px' : 'var(--radius-lg)',
          boxShadow: deviceView === 'mobile' ? '0 16px 40px rgba(0,0,0,0.12)' : 'var(--shadow-sm)',
          borderWidth: deviceView === 'mobile' ? '4px' : '1px',
          padding: deviceView === 'mobile' ? '18px 14px' : '24px',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Mockup Navigation Bar */}
        <div
          className="mockup-nav"
          style={{
            background: mockCardBg,
            color: mockText,
            border: '1px solid rgba(0,0,0,0.06)',
            flexDirection: deviceView === 'mobile' ? 'column' : undefined,
            gap: deviceView === 'mobile' ? '10px' : undefined,
            padding: deviceView === 'mobile' ? '12px 14px' : '14px 20px',
          }}
        >
          <span className="nav-brand">Studio Palettin</span>
          <ul
            className="nav-links"
            style={{
              justifyContent: deviceView === 'mobile' ? 'center' : undefined,
              flexWrap: deviceView === 'mobile' ? 'wrap' : undefined,
              fontSize: deviceView === 'mobile' ? '0.76rem' : '0.82rem',
              gap: deviceView === 'mobile' ? '12px' : '16px',
            }}
          >
            <li style={{ color: mockPrimary }}>Beranda</li>
            <li>Layanan</li>
            <li>Galeri</li>
            <li>Kontak</li>
          </ul>
        </div>

        {/* Mockup Hero Banner */}
        <div
          className="mockup-hero-block"
          style={{
            background: mockCardBg,
            color: mockText,
            border: '1px solid rgba(0,0,0,0.06)',
            padding: deviceView === 'mobile' ? '24px 14px' : '44px 28px',
          }}
        >
          <h3 style={{ fontSize: deviceView === 'mobile' ? '1.35rem' : '1.85rem' }}>
            Harmoni Desain yang Sempurna
          </h3>
          <p style={{ fontSize: deviceView === 'mobile' ? '0.84rem' : '0.9rem' }}>
            Halaman ini mendemonstrasikan kombinasi antara warna pilihan Anda (
            <span style={{ color: mockPrimary, fontWeight: 700 }}>{baseHex}</span>) dengan warna pendamping (
            <span style={{ color: mockSecondary, fontWeight: 700 }}>{mockSecondary.toUpperCase()}</span>).
          </p>
          <div
            className="mockup-action-btns"
            style={{
              flexDirection: deviceView === 'mobile' ? 'column' : 'row',
              gap: deviceView === 'mobile' ? '8px' : '12px',
            }}
          >
            <span
              className="mockup-cta-btn"
              style={{
                background: mockPrimary,
                color: primaryText,
                width: deviceView === 'mobile' ? '100%' : 'auto',
                textAlign: 'center',
              }}
            >
              Mulai Sekarang
            </span>
            <span
              className="mockup-cta-btn"
              style={{
                background: mockSecondary,
                color: secondaryText,
                width: deviceView === 'mobile' ? '100%' : 'auto',
                textAlign: 'center',
              }}
            >
              Pelajari Lebih Lanjut
            </span>
          </div>
        </div>

        {/* Mockup Cards */}
        <div
          className="mockup-cards-row"
          style={{
            gridTemplateColumns: deviceView === 'mobile' ? '1fr' : undefined,
          }}
        >
          <div
            className="mockup-content-card"
            style={{ background: mockCardBg, color: mockText, border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <h4 style={{ color: mockPrimary }}>Komponen Utama</h4>
            <p>Kartu informasi dengan penekanan warna primer dari foto Anda sebagai judul dan identitas merek.</p>
          </div>
          <div
            className="mockup-content-card"
            style={{ background: mockSecondary, color: secondaryText, border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <h4 style={{ color: secondaryText }}>Aksen Pendamping</h4>
            <p>Menggunakan warna rekomendasi yang serasi untuk menonjolkan fitur khusus atau penawaran menarik.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

