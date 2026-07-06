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

// ===========================================================================
// PAPER TRAIL ink system (August 2026 redesign). The raw swatches are
// FILL-ONLY: bars, ballot-oval fills, file tabs, large stamps, poster hero
// fields. Any accent-colored TEXT set on paper or a sheet must use the
// inkOnPaper variant, and text set ON a field uses textOnField: navy ink on
// the light golden/sunrise fields, paper ink (never pure white) on the dark
// sky/navy/coral fields.
// ===========================================================================

export const PAPER = '#f4efe4';
export const SHEET = '#fffdf8';
export const INK_SOFT = 'rgba(30, 58, 95, 0.62)';
export const HAIRLINE = 'rgba(30, 58, 95, 0.16)';
export const CORAL_PRESS = '#c62828';

export interface AccentInk {
  /** Raw swatch. Fill-only: never use as a text color on paper or sheet. */
  field: string;
  /** Text ink placed directly ON the field (paper or navy per the spec). */
  textOnField: string;
  /** AA-safe variant for accent-colored text on paper / sheet backgrounds. */
  inkOnPaper: string;
}

// Keyed by the lowercase accent.name from AUGUST_BALLOT.measures[].accent.
export const ACCENT_INKS: Record<string, AccentInk> = {
  sky: { field: '#4a90d9', textOnField: PAPER, inkOnPaper: '#2b6cb0' },
  navy: { field: '#1e3a5f', textOnField: PAPER, inkOnPaper: NAVY },
  coral: { field: '#e53935', textOnField: PAPER, inkOnPaper: CORAL_PRESS },
  golden: { field: '#f5a623', textOnField: NAVY, inkOnPaper: '#9a6b0f' },
  sunrise: { field: '#d2561e', textOnField: NAVY, inkOnPaper: '#b3481a' },
};

// Resolve an ink set from either an accent name ('Sky', 'golden') or a raw
// swatch hex ('#4a90d9'). Unknown hex values degrade gracefully via the
// luminance helpers; unknown non-hex strings fall back to plain navy ink.
export function accentInk(nameOrSwatch: string): AccentInk {
  const key = nameOrSwatch.trim().toLowerCase();
  const byName = ACCENT_INKS[key];
  if (byName) return byName;
  const byHex = Object.values(ACCENT_INKS).find((v) => v.field.toLowerCase() === key);
  if (byHex) return byHex;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(key)) {
    return {
      field: key,
      textOnField: onAccent(key) === NAVY ? NAVY : PAPER,
      inkOnPaper: inkOnWhite(key),
    };
  }
  return { field: NAVY, textOnField: PAPER, inkOnPaper: NAVY };
}
