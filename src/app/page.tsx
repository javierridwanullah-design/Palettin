'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { ColorItem, ColorFormat } from '@/types';
import { medianCut } from '@/lib/colorUtils';
import { Header } from '@/components/Header';
import { UploadZone } from '@/components/UploadZone';
import { ImagePreview } from '@/components/ImagePreview';
import { PaletteRibbon } from '@/components/PaletteRibbon';
import { SwatchesGrid } from '@/components/SwatchesGrid';
import { ExportActions } from '@/components/ExportActions';
import { MatchingTab } from '@/components/tabs/MatchingTab';
import { HarmonyTab } from '@/components/tabs/HarmonyTab';
import { ContrastTab } from '@/components/tabs/ContrastTab';
import { Toast } from '@/components/Toast';

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [colorCount, setColorCount] = useState<number>(6);
  const [format, setFormat] = useState<ColorFormat>('hex');
  const [activeTab, setActiveTab] = useState<'matching' | 'harmony' | 'contrast'>('matching');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(-1);
  const [selectedCompanionIndex, setSelectedCompanionIndex] = useState<number>(0);
  const [contrastColor1, setContrastColor1] = useState<ColorItem | null>(null);
  const [contrastColor2, setContrastColor2] = useState<ColorItem | null>(null);
  const [contrastSlot, setContrastSlot] = useState<1 | 2>(1);

  // Toast state
  const [toast, setToast] = useState<{ message: string; icon: string; show: boolean }>({
    message: '',
    icon: '✓',
    show: false,
  });
  const toastTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, icon: string = '✓') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ message, icon, show: true });
    toastTimerRef.current = setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2400);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const extractColorsFromImage = useCallback((src: string, count: number) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scale = Math.min(220 / img.naturalWidth, 220 / img.naturalHeight, 1);
        canvas.width = Math.max(1, Math.floor(img.naturalWidth * scale));
        canvas.height = Math.max(1, Math.floor(img.naturalHeight * scale));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const pixels: number[][] = [];
        for (let i = 0; i < imageData.length; i += 4) {
          if (imageData[i + 3] < 128) continue;
          pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
        }

        if (pixels.length === 0) {
          showToast('Gambar transparan atau tidak memiliki warna yang cukup.', '⚠️');
          return;
        }

        const extracted = medianCut(pixels, count);
        setColors(extracted);
        setSelectedColorIndex(0);
        setSelectedCompanionIndex(0);
        setContrastColor1(null);
        setContrastColor2(null);
        setContrastSlot(1);
      } catch (err) {
        showToast('Tidak dapat membaca pixel gambar (kemungkinan pembatasan CORS).', '⚠️');
      }
    };
    img.onerror = () => {
      showToast('Gagal memuat gambar yang dipilih.', '⚠️');
    };
    img.src = src;
  }, [showToast]);

  const handleImageSelected = (src: string) => {
    setImageSrc(src);
    extractColorsFromImage(src, colorCount);
  };

  const handleColorCountChange = (count: number) => {
    setColorCount(count);
  };

  const handleReExtract = () => {
    if (imageSrc) {
      extractColorsFromImage(imageSrc, colorCount);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setColors([]);
    setSelectedColorIndex(-1);
    setSelectedCompanionIndex(0);
    setContrastColor1(null);
    setContrastColor2(null);
  };

  const handleSelectColor = (index: number) => {
    if (activeTab === 'contrast') {
      if (contrastSlot === 1) {
        setContrastColor1(colors[index]);
        setContrastSlot(2);
      } else {
        setContrastColor2(colors[index]);
        setContrastSlot(1);
      }
    } else {
      setSelectedColorIndex(index);
      setSelectedCompanionIndex(0);
    }
  };

  const handleSwapContrast = () => {
    setContrastColor1(contrastColor2);
    setContrastColor2(contrastColor1);
  };

  const selectedColor =
    selectedColorIndex >= 0 && colors[selectedColorIndex] ? colors[selectedColorIndex] : null;

  return (
    <>
      <Header />

      <main className="container">
        {/* Hero Section */}
        <section className="hero-direct">
          <h1>Palettin.</h1>
          <p>
            Ekstraksi warna dominan dari gambar dan temukan rekomendasi paduan warna yang cocok untuk desain website Anda.
          </p>
        </section>

        {/* Upload Zone (hidden when image is selected) */}
        {!imageSrc && (
          <UploadZone onImageSelected={handleImageSelected} onToast={showToast} />
        )}

        {/* Image Preview */}
        {imageSrc && (
          <ImagePreview
            imageSrc={imageSrc}
            colorCount={colorCount}
            onColorCountChange={handleColorCountChange}
            onReExtract={handleReExtract}
            onReset={handleReset}
          />
        )}

        {/* Palette Section */}
        {colors.length > 0 && (
          <section className="section-visible panel-card">
            <div className="panel-header">
              <h3 className="panel-title">Palet Warna Hasil Ekstraksi</h3>
              <div className="format-pills">
                <button
                  className={`format-pill ${format === 'hex' ? 'active' : ''}`}
                  onClick={() => setFormat('hex')}
                >
                  HEX
                </button>
                <button
                  className={`format-pill ${format === 'rgb' ? 'active' : ''}`}
                  onClick={() => setFormat('rgb')}
                >
                  RGB
                </button>
                <button
                  className={`format-pill ${format === 'hsl' ? 'active' : ''}`}
                  onClick={() => setFormat('hsl')}
                >
                  HSL
                </button>
              </div>
            </div>

            <PaletteRibbon colors={colors} onSelectColor={handleSelectColor} />

            <SwatchesGrid
              colors={colors}
              selectedIndex={selectedColorIndex}
              format={format}
              onSelectColor={handleSelectColor}
              onToast={showToast}
            />

            <ExportActions colors={colors} onToast={showToast} />

            {/* Tab Navigation */}
            <div className="tab-pills-row">
              <button
                className={`tab-item-pill ${activeTab === 'matching' ? 'active' : ''}`}
                onClick={() => setActiveTab('matching')}
              >
                <span>🎯</span> Rekomendasi Warna & Mockup Web
              </button>
              <button
                className={`tab-item-pill ${activeTab === 'harmony' ? 'active' : ''}`}
                onClick={() => setActiveTab('harmony')}
              >
                <span>🌸</span> Harmoni Warna Lengkap
              </button>
              <button
                className={`tab-item-pill ${activeTab === 'contrast' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('contrast');
                  setContrastSlot(contrastColor1 ? 2 : 1);
                }}
              >
                <span>📐</span> Uji Kontras Aksesibilitas (WCAG)
              </button>
            </div>

            {/* Active Tab Body */}
            {activeTab === 'matching' && (
              <MatchingTab
                selectedColor={selectedColor}
                selectedCompanionIndex={selectedCompanionIndex}
                onSelectCompanion={setSelectedCompanionIndex}
                onToast={showToast}
              />
            )}

            {activeTab === 'harmony' && (
              <HarmonyTab selectedColor={selectedColor} onToast={showToast} />
            )}

            {activeTab === 'contrast' && (
              <ContrastTab
                contrastColor1={contrastColor1}
                contrastColor2={contrastColor2}
                contrastSlot={contrastSlot}
                onSlotChange={setContrastSlot}
                onSwap={handleSwapContrast}
              />
            )}
          </section>
        )}
      </main>

      <Toast message={toast.message} icon={toast.icon} show={toast.show} />

      <footer className="footer">
        Aplikasi ekstraksi dan eksplorasi warna — <strong>Palettin</strong> © 2026
      </footer>
    </>
  );
}

