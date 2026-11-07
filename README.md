# Palettin — Next.js Edition 🎨

Aplikasi ekstraksi dan eksplorasi warna harmoni dari gambar menggunakan **Next.js 15 (App Router)**, **React 19**, dan **TypeScript**.

## ✨ Fitur Unggulan

- **Ekstraksi Warna Cepat**: Menggunakan algoritma *Median Cut* berbasis HTML5 Canvas langsung di sisi klien.
- **Unggah Fleksibel**: Mendukung Drag & Drop, tombol pilih file, tautan URL gambar, dan pintasan `Ctrl + V` (paste gambar langsung dari clipboard).
- **Rekomendasi Warna & Mockup Website Dinamis**: Menghasilkan rekomendasi warna kontras, analog seirama, background tint, dan deep text contrast yang langsung disimulasikan pada mockup website interaktif secara real-time.
- **Harmoni Warna Lengkap**: Komplementer, Analog, Triadic, Split Komplementer, dan Tetradic dengan tombol salin rangkaian warna.
- **Uji Aksesibilitas WCAG**: Pengecekan rasio kontras teks vs latar belakang beserta indikator kelulusan WCAG AA & AAA (Normal & Large Text).
- **Ekspor Praktis**: Salin Variabel CSS, Salin JSON, Unduh SVG palet, dan Unduh PNG palet.
- **Tema Pastel**: Tema *Pastel Cream* dan *Pastel Dusk* dengan tekstur kertas halus dan efek ambient aurora.

## 🚀 Cara Menjalankan

1. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

2. **Build untuk Production**:
   ```bash
   npm run build
   npm run start
   ```

## 📁 Struktur Proyek

```
palette-picker/
├── src/
│   ├── app/
│   │   ├── globals.css         # Variabel tema, animasi pastel, dan styling
│   │   ├── layout.tsx          # Root layout & ambient aurora
│   │   └── page.tsx            # Halaman utama aplikasi Palettin
│   ├── components/
│   │   ├── Header.tsx          # Navigasi & switch tema Cream / Dusk
│   │   ├── UploadZone.tsx      # Area drag-and-drop, URL, & paste
│   │   ├── ImagePreview.tsx    # Pratinjau gambar & slider jumlah palet
│   │   ├── PaletteRibbon.tsx   # Pita spektrum warna interaktif
│   │   ├── SwatchesGrid.tsx    # Kartu swatch warna (HEX / RGB / HSL)
│   │   ├── ExportActions.tsx   # Tombol ekspor CSS, JSON, SVG, PNG
│   │   ├── Toast.tsx           # Notifikasi feedback penyalinan / unduhan
│   │   └── tabs/
│   │       ├── MatchingTab.tsx # Rekomendasi warna & mockup website
│   │       ├── HarmonyTab.tsx  # Harmoni warna komplementer, analog, dll
│   │       └── ContrastTab.tsx # Uji rasio kontras & kepatuhan WCAG
│   ├── lib/
│   │   └── colorUtils.ts       # Algoritma median cut, konversi warna, WCAG
│   └── types/
│       └── index.ts            # Type definitions TypeScript
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
```

