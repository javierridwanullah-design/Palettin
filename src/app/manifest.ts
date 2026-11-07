import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Palettin — Ekstraksi dan Rekomendasi Warna Harmonis',
    short_name: 'Palettin',
    description: 'Ekstraksi warna dominan dari gambar dan temukan rekomendasi paduan warna harmonis.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF9F5',
    theme_color: '#FBF9F5',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
