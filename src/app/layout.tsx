import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Palettin — Ekstraksi dan Rekomendasi Warna Harmonis',
  description: 'Ekstraksi warna dominan dari gambar dan temukan rekomendasi paduan warna yang cocok untuk desain website Anda.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FBF9F5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="pastel-cream" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('palettin-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        {/* Ambient Pastel Aurora */}
        <div className="pastel-aurora aurora-1" />
        <div className="pastel-aurora aurora-2" />
        <div className="pastel-aurora aurora-3" />
        {children}
      </body>
    </html>
  );
}

