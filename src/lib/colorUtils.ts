import { ColorItem, ColorFormat, CompanionRecommendation, HSLColor } from '@/types';

// ==================== MEDIAN CUT ====================
export function medianCut(pixels: number[][], count: number): ColorItem[] {
  if (!pixels.length) return [];
  const boxes: { pixels: number[][] }[] = [{ pixels }];

  while (boxes.length < count) {
    let maxRange = -1;
    let maxIndex = 0;
    let maxChannel = 0;

    for (let i = 0; i < boxes.length; i++) {
      const bPixels = boxes[i].pixels;
      if (bPixels.length < 2) continue;
      for (let ch = 0; ch < 3; ch++) {
        let minVal = 255;
        let maxVal = 0;
        for (let j = 0; j < bPixels.length; j++) {
          const v = bPixels[j][ch];
          if (v < minVal) minVal = v;
          if (v > maxVal) maxVal = v;
        }
        const range = maxVal - minVal;
        if (range > maxRange) {
          maxRange = range;
          maxIndex = i;
          maxChannel = ch;
        }
      }
    }

    if (maxRange <= 0) break;

    const targetBox = boxes[maxIndex];
    targetBox.pixels.sort((a, b) => a[maxChannel] - b[maxChannel]);
    const mid = targetBox.pixels.length >> 1;
    boxes.splice(maxIndex, 1, { pixels: targetBox.pixels.slice(0, mid) }, { pixels: targetBox.pixels.slice(mid) });
  }

  const total = pixels.length;
  return boxes
    .map(box => {
      const sum = [0, 0, 0];
      for (const p of box.pixels) {
        sum[0] += p[0];
        sum[1] += p[1];
        sum[2] += p[2];
      }
      const len = box.pixels.length;
      return {
        r: Math.round(sum[0] / len),
        g: Math.round(sum[1] / len),
        b: Math.round(sum[2] / len),
        percentage: ((len / total) * 100).toFixed(1),
      };
    })
    .sort((a, b) => parseFloat(b.percentage) - parseFloat(a.percentage));
}

// ==================== CONVERSIONS ====================
export function toHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('');
}

export function toHSL(r: number, g: number, b: number): HSLColor {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hsl2rgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function hsl2hex(h: number, s: number, l: number): string {
  const { r, g, b } = hsl2rgb(h, s, l);
  return toHex(r, g, b);
}

export function formatValue(c: { r: number; g: number; b: number }, fmt: ColorFormat): string {
  if (fmt === 'hex') return toHex(c.r, c.g, c.b).toUpperCase();
  if (fmt === 'rgb') return `rgb(${c.r}, ${c.g}, ${c.b})`;
  const h = toHSL(c.r, c.g, c.b);
  return `hsl(${h.h}, ${h.s}%, ${h.l}%)`;
}

export function getPastelName(r: number, g: number, b: number): string {
  const { h, s, l } = toHSL(r, g, b);
  if (l < 15) return 'Midnight Tone';
  if (l > 92) return 'Soft Marshmallow';
  if (s < 12) return l > 60 ? 'Misty Linen' : 'Warm Clay';

  let tone = '';
  if (l > 75) tone = 'Pastel ';
  else if (l < 35) tone = 'Deep ';
  else tone = 'Gentle ';

  if (h < 18 || h >= 345) return tone + 'Rose';
  if (h < 42) return tone + 'Peach';
  if (h < 65) return tone + 'Butter';
  if (h < 155) return tone + 'Sage / Matcha';
  if (h < 195) return tone + 'Eucalyptus';
  if (h < 235) return tone + 'Sky Breeze';
  if (h < 280) return tone + 'Lavender';
  if (h < 325) return tone + 'Lilac';
  return tone + 'Blush';
}

// ==================== RECOMMENDATIONS & HARMONY ====================
export function getCompanionRecommendations(baseRgb: { r: number; g: number; b: number }): CompanionRecommendation[] {
  const hsl = toHSL(baseRgb.r, baseRgb.g, baseRgb.b);
  const recs: CompanionRecommendation[] = [];

  // 1. Warna Kontras / Komplementer
  const compHue = (hsl.h + 180) % 360;
  const compRgb = hsl2rgb(compHue, Math.min(hsl.s + 10, 85), Math.max(Math.min(hsl.l, 70), 45));
  recs.push({
    name: 'Komplementer (Kontras Dinamis)',
    role: 'Aksen Tombol & Aksi',
    reason: 'Menciptakan daya tarik visual tinggi yang pas untuk tombol utama.',
    rgb: compRgb,
    hex: toHex(compRgb.r, compRgb.g, compRgb.b),
  });

  // 2. Warna Analog Lembut
  const anaHue = (hsl.h + 30) % 360;
  const anaRgb = hsl2rgb(anaHue, Math.max(hsl.s - 5, 20), Math.min(hsl.l + 5, 80));
  recs.push({
    name: 'Analog Harmonis',
    role: 'Komponen Sekunder / Card',
    reason: 'Memberikan kesan tenang dan menyatu sempurna dengan warna dasar.',
    rgb: anaRgb,
    hex: toHex(anaRgb.r, anaRgb.g, anaRgb.b),
  });

  // 3. Nuansa Latar Lembut
  const bgTintRgb = hsl2rgb(hsl.h, 25, 96);
  recs.push({
    name: 'Latar Halus (Pastel Tint)',
    role: 'Latar Belakang Website',
    reason: 'Warna kanvas lembut dengan rona warna yang senada agar mata tidak lelah.',
    rgb: bgTintRgb,
    hex: toHex(bgTintRgb.r, bgTintRgb.g, bgTintRgb.b),
  });

  // 4. Warna Teks Bersih & Terbaca
  const textDeepRgb = hsl2rgb(hsl.h, 20, 15);
  recs.push({
    name: 'Kontras Teks Dalam',
    role: 'Tipografi & Judul',
    reason: 'Memberikan tingkat keterbacaan yang tajam dan nyaman dibaca.',
    rgb: textDeepRgb,
    hex: toHex(textDeepRgb.r, textDeepRgb.g, textDeepRgb.b),
  });

  return recs;
}

export function rotateHue(hsl: HSLColor, deg: number): HSLColor {
  return { h: (hsl.h + deg + 360) % 360, s: hsl.s, l: hsl.l };
}

export function getHarmonies(baseRgb: { r: number; g: number; b: number }) {
  const hsl = toHSL(baseRgb.r, baseRgb.g, baseRgb.b);
  return {
    'Komplementer (Kontras Berseberangan)': [hsl, rotateHue(hsl, 180)],
    'Analog (Warna Berdampingan)': [rotateHue(hsl, -30), hsl, rotateHue(hsl, 30)],
    'Triadic (Segitiga Warna Seimbang)': [hsl, rotateHue(hsl, 120), rotateHue(hsl, 240)],
    'Split Komplementer': [hsl, rotateHue(hsl, 150), rotateHue(hsl, 210)],
    'Tetradic (Empat Titik Harmonis)': [hsl, rotateHue(hsl, 90), rotateHue(hsl, 180), rotateHue(hsl, 270)],
  };
}

// ==================== CONTRAST & WCAG ====================
export function relLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calcContrast(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }): number {
  const l1 = relLuminance(a.r, a.g, a.b);
  const l2 = relLuminance(b.r, b.g, b.b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// ==================== CLIPBOARD ====================
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    ta.style.pointerEvents = 'none';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const success = document.execCommand('copy');
    document.body.removeChild(ta);
    return success;
  } catch {
    return false;
  }
}

// ==================== EXPORTS ====================
export function generateCSS(colors: ColorItem[]): string {
  return (
    ':root {\n' +
    colors.map((c, i) => `  --color-palettin-${i + 1}: ${toHex(c.r, c.g, c.b)};`).join('\n') +
    '\n}'
  );
}

export function generateTailwind(colors: ColorItem[]): string {
  const colorMap: Record<string, string> = {};
  colors.forEach((c, i) => {
    colorMap[`palettin-${i + 1}`] = toHex(c.r, c.g, c.b).toUpperCase();
  });

  return `// tailwind.config.ts\nimport type { Config } from 'tailwindcss';\n\nexport default {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colorMap, null, 8)}\n    }\n  }\n} satisfies Config;`;
}

export function generateJSON(colors: ColorItem[]): string {
  return JSON.stringify(
    colors.map(c => ({
      hex: toHex(c.r, c.g, c.b),
      rgb: { r: c.r, g: c.g, b: c.b },
      hsl: toHSL(c.r, c.g, c.b),
      percentage: c.percentage + '%',
      name: getPastelName(c.r, c.g, c.b),
    })),
    null,
    2
  );
}

export function downloadSVG(colors: ColorItem[]) {
  const w = 840,
    h = 220,
    bw = w / colors.length;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h + 60}">
    <rect width="${w}" height="${h + 60}" fill="#FBF9F5" rx="20"/>`;
  colors.forEach((c, i) => {
    const hx = toHex(c.r, c.g, c.b);
    svg += `<rect x="${i * bw}" y="0" width="${bw}" height="${h}" fill="${hx}"/>`;
    svg += `<text x="${i * bw + bw / 2}" y="${h + 38}" text-anchor="middle" fill="#726860" font-family="monospace" font-size="12">${hx.toUpperCase()}</text>`;
  });
  svg += '</svg>';
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  downloadBlob(blob, 'palettin.svg');
}

export function downloadPNG(colors: ColorItem[]) {
  const w = 840,
    h = 220,
    fh = 60,
    bw = w / colors.length;
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h + fh;
  const cx = cv.getContext('2d');
  if (!cx) return;

  cx.fillStyle = '#FBF9F5';
  cx.fillRect(0, 0, w, h + fh);

  colors.forEach((c, i) => {
    cx.fillStyle = toHex(c.r, c.g, c.b);
    cx.fillRect(i * bw, 0, bw, h);
    cx.fillStyle = '#726860';
    cx.font = '12px monospace';
    cx.textAlign = 'center';
    cx.fillText(toHex(c.r, c.g, c.b).toUpperCase(), i * bw + bw / 2, h + 36);
  });

  cv.toBlob(blob => {
    if (blob) downloadBlob(blob, 'palettin.png');
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

