// Shared accent color math for the August ballot viz components.
// No dependencies by design. The five measure swatches span a wide luminance
// range (navy, coral, sunrise are dark; sky is mid; golden is light), so a
// single golden special-case is not enough to keep text legible. These helpers
// pick the higher-contrast text color per accent and provide an AA-safe
// accent ink for colored text on a white background.

export const NAVY = '#1e3a5f';

export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function withAlpha(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  const f = (c: number) => Math.round(c * (1 - amount));
  return `rgb(${f(r)}, ${f(g)}, ${f(b)})`;
}

// sRGB relative luminance, 0 (black) to 1 (white).
export function relLuminance(hex: string): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

// Best readable text color placed directly ON a solid accent fill.
// Threshold 0.23 maps sky and golden to navy text, and the darker
// navy/coral/sunrise accents to white, which is the higher-contrast choice
// for each of the five measure swatches.
export function onAccent(hex: string): string {
  return relLuminance(hex) > 0.23 ? NAVY : '#ffffff';
}

// Accent-colored text on a WHITE background, darkened enough to clear AA
// (4.5:1) for every measure swatch including sky and golden.
export function inkOnWhite(hex: string): string {
  return darken(hex, 0.42);
}
