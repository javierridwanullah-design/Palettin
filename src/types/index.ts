export interface ColorItem {
  r: number;
  g: number;
  b: number;
  percentage: string;
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export interface CompanionRecommendation {
  name: string;
  role: string;
  reason: string;
  rgb: { r: number; g: number; b: number };
  hex: string;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

