'use client';

import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, EASE } from '@/components/ui/Reveal';
import { TopicIcon } from '@/components/ui/TopicIcon';
import { onAccent } from '@/components/august/accent';
import { cn } from '@/lib/utils';

export interface DistrictMapProps {
  north: string;
  south: string;
  west: string;
  east: string;
  accent: string;
  heading?: string;
  caption?: string;
  className?: string;
}

// Darken a #rrggbb hex toward black by a keep factor (0..1). Used to build the
// corridor fill gradient from a single accent without adding a color library.
function darken(hex: string, amount = 0.68): string {
  const raw = hex.replace('#', '');
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  const n = Number.parseInt(full, 16);
  if (Number.isNaN(n) || full.length !== 6) return hex;
  const r = Math.round(((n >> 16) & 255) * amount);
  const g = Math.round(((n >> 8) & 255) * amount);
  const b = Math.round((n & 255) * amount);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const VB_W = 440;
const VB_H = 560;

// Stylized corridor outline (closed path). Tall and narrow with gentle organic
// bends so it reads as a real East Side district without pretending to be a
// survey map. North is up.
const CORRIDOR =
  'M 168 72 C 176 58 268 60 276 78 C 286 168 280 312 274 462 C 270 488 176 488 168 466 C 160 312 160 162 168 72 Z';

// Decorative investment parcels inside the corridor. Texture only, no data.
const PARCELS = [
  { x: 190, y: 126, w: 28, h: 18 },
  { x: 232, y: 168, w: 22, h: 16 },
  { x: 184, y: 224, w: 32, h: 20 },
  { x: 234, y: 272, w: 24, h: 18 },
  { x: 196, y: 326, w: 28, h: 16 },
  { x: 228, y: 378, w: 28, h: 20 },
];

type BoundaryKey = 'north' | 'east' | 'south' | 'west';

interface Boundary {
  key: BoundaryKey;
  initial: string;
  dir: string;
  dot: [number, number];
  tickEnd: [number, number];
  chip: [number, number];
  // CSS transform that seats the chip against the tick end (off the corridor).
  shift: string;
  delay: number;
}

// Four boundary callouts. Each has an edge contact dot and an outward tick; the
// floating label is seated near the tick (all in viewBox coordinates). The east
// and west chip x-coordinates are pulled inward from their tick ends so the long
// side labels stay inside the panel on narrow screens.
const BOUNDS: Boundary[] = [
  { key: 'north', initial: 'N', dir: 'North', dot: [222, 69], tickEnd: [222, 44], chip: [222, 44], shift: 'translate(-50%, -100%)', delay: 0.15 },
  { key: 'east', initial: 'E', dir: 'East', dot: [282, 286], tickEnd: [320, 286], chip: [292, 286], shift: 'translate(0, -50%)', delay: 0.28 },
  { key: 'south', initial: 'S', dir: 'South', dot: [222, 479], tickEnd: [222, 507], chip: [222, 507], shift: 'translate(-50%, 0)', delay: 0.41 },
  { key: 'west', initial: 'W', dir: 'West', dot: [161, 268], tickEnd: [129, 268], chip: [152, 268], shift: 'translate(-100%, -50%)', delay: 0.54 },
];

const VIEWPORT = { once: true, margin: '-80px' } as const;

/**
 * DistrictMap renders a self-contained, stylized SVG of the Central City
 * Economic Development (CCED) corridor: a tall, narrow district on Kansas City's
 * East Side. No external map tiles. The outline draws itself in on scroll, the
 * accent fill breathes with a soft pulse, and the four boundaries are tagged
 * with floating callouts. Degrades to a fully drawn static map under reduced
 * motion, and exposes a text description of all four boundaries for screen
 * readers.
 */
export default function DistrictMap({
  north,
  south,
  west,
  east,
  accent,
  heading,
  caption,
  className,
}: DistrictMapProps) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const gradId = `district-grad-${uid}`;
  const glowId = `district-glow-${uid}`;

  // Boundary badge ink: pick the higher-contrast color for text sitting on each
  // accent fill (white on the darker navy/coral/sunrise accents, navy on the
  // lighter sky/golden ones) so every measure swatch stays legible.
  const badgeInk = onAccent(accent);
  // Golden keeps a touch more brightness in the corridor gradient so it does not
  // muddy; the darker accents fall off faster.
  const isGolden = accent.replace('#', '').toLowerCase() === 'f5a623';
  const accentDark = darken(accent, isGolden ? 0.78 : 0.68);

  const names: Record<BoundaryKey, string> = { north, east, south, west };

  const ariaLabel =
    `Map of the CCED district, a tall narrow corridor on Kansas City's East Side. ` +
    `Bounded by ${north} to the north, ${east} to the east, ${south} to the south, and ${west} to the west.`;

  // Faint abstract street grid, inset inside the panel.
  const verticals = Array.from({ length: 11 }, (_, i) => 8 + i * 42).filter((x) => x <= 432);
  const horizontals = Array.from({ length: 14 }, (_, i) => 8 + i * 40).filter((y) => y <= 552);

  return (
    <motion.figure
      {...(reduce
        ? {}
        : {
            initial: fadeUp.initial,
            whileInView: fadeUp.whileInView,
            viewport: fadeUp.viewport,
            transition: { duration: 0.6, ease: EASE },
          })}
      className={cn(
        'rounded-3xl bg-white border border-gray-100 p-6 sm:p-8',
        className,
      )}
      style={{ boxShadow: '0 18px 44px -24px rgba(30,58,95,0.22)' }}
    >
      {(heading || caption) && (
        <header className="mb-5 flex items-start gap-3">
          <span
            className="mt-0.5 grid place-items-center w-10 h-10 shrink-0 rounded-xl"
            style={{ backgroundColor: `${accent}1f`, color: accent }}
          >
            <TopicIcon id="central-city" className="w-5 h-5" />
          </span>
          <div>
            {heading && (
              <h3 className="text-xl sm:text-2xl font-bold text-navy leading-tight">{heading}</h3>
            )}
            {caption && <p className="mt-1 text-sm text-gray-600 leading-relaxed">{caption}</p>}
          </div>
        </header>
      )}

      <div className="relative mx-auto w-full max-w-[420px]">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="block w-full h-auto"
          role="img"
          aria-label={ariaLabel}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={accent} />
              <stop offset="100%" stopColor={accentDark} />
            </linearGradient>
            <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>

          {/* faint panel the map sits on */}
          <rect
            x={8}
            y={8}
            width={VB_W - 16}
            height={VB_H - 16}
            rx={22}
            fill="#f8f9fa"
            stroke="rgba(30,58,95,0.08)"
          />

          {/* abstract street grid */}
          <g stroke="#1e3a5f" strokeOpacity={0.05} strokeWidth={1}>
            {verticals.map((x) => (
              <line key={`v${x}`} x1={x} y1={10} x2={x} y2={VB_H - 10} />
            ))}
            {horizontals.map((y) => (
              <line key={`h${y}`} x1={10} y1={y} x2={VB_W - 10} y2={y} />
            ))}
            {/* two diagonal boulevards for a less rigid grid */}
            <line x1={8} y1={180} x2={432} y2={360} strokeOpacity={0.06} />
            <line x1={120} y1={552} x2={360} y2={8} strokeOpacity={0.06} />
          </g>

          {/* soft accent glow halo behind the corridor (the fill pulse) */}
          <motion.path
            d={CORRIDOR}
            fill={accent}
            filter={`url(#${glowId})`}
            initial={reduce ? { opacity: 0.12 } : { opacity: 0.06 }}
            animate={reduce ? { opacity: 0.12 } : { opacity: [0.06, 0.18, 0.06] }}
            transition={reduce ? { duration: 0 } : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* white base lifts the corridor off the grid */}
          <path d={CORRIDOR} fill="#ffffff" fillOpacity={0.72} />

          {/* accent corridor fill, gently breathing */}
          <motion.path
            d={CORRIDOR}
            fill={`url(#${gradId})`}
            initial={reduce ? { opacity: 0.24 } : { opacity: 0.16 }}
            animate={reduce ? { opacity: 0.24 } : { opacity: [0.16, 0.32, 0.16] }}
            transition={reduce ? { duration: 0 } : { duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* decorative investment parcels */}
          {PARCELS.map((p, i) => (
            <motion.rect
              key={`parcel-${p.x}-${p.y}`}
              x={p.x}
              y={p.y}
              width={p.w}
              height={p.h}
              rx={4}
              fill={accent}
              fillOpacity={0.34}
              initial={reduce ? false : { opacity: 0, scale: 0.4 }}
              whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
              viewport={VIEWPORT}
              transition={reduce ? undefined : { duration: 0.5, delay: 0.9 + i * 0.08, ease: EASE }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          ))}

          {/* the district outline draws itself in */}
          <motion.path
            d={CORRIDOR}
            fill="none"
            stroke={accent}
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.5 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={VIEWPORT}
            transition={reduce ? { duration: 0 } : { duration: 1.8, ease: EASE }}
          />

          {/* boundary ticks + contact dots */}
          {BOUNDS.map((b) => (
            <g key={`tick-${b.key}`}>
              <line
                x1={b.dot[0]}
                y1={b.dot[1]}
                x2={b.tickEnd[0]}
                y2={b.tickEnd[1]}
                stroke={accent}
                strokeOpacity={0.45}
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
              <motion.circle
                cx={b.dot[0]}
                cy={b.dot[1]}
                r={4.5}
                fill={accent}
                stroke="#ffffff"
                strokeWidth={1.75}
                initial={reduce ? false : { opacity: 0, scale: 0 }}
                whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
                viewport={VIEWPORT}
                transition={reduce ? undefined : { duration: 0.4, delay: 1.5 + b.delay * 0.4, ease: EASE }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
            </g>
          ))}

          {/* north compass, top-left */}
          <g aria-hidden="true">
            <line x1={40} y1={84} x2={40} y2={62} stroke="rgba(30,58,95,0.4)" strokeWidth={1.5} />
            <path d="M40 56 l5.5 11 l-11 0 Z" fill={accent} />
            <text
              x={40}
              y={100}
              textAnchor="middle"
              fontSize={11}
              fontWeight={700}
              fill="#1e3a5f"
              fillOpacity={0.55}
            >
              N
            </text>
          </g>
        </svg>

        {/* floating boundary callouts (HTML overlay, sized to content) */}
        {BOUNDS.map((b) => {
          // East and west sit in the narrow side gutters, so on small screens
          // their long labels (Indiana Avenue, The Paseo) are capped and allowed
          // to wrap. North and south are center-anchored and never clip.
          const isSide = b.key === 'east' || b.key === 'west';
          return (
            <motion.div
              key={`chip-${b.key}`}
              className="pointer-events-none absolute z-10"
              style={{
                left: `${(b.chip[0] / VB_W) * 100}%`,
                top: `${(b.chip[1] / VB_H) * 100}%`,
                transform: b.shift,
              }}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={reduce ? undefined : { duration: 0.45, delay: 1.5 + b.delay, ease: EASE }}
            >
              <div
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 rounded-xl bg-white/95 backdrop-blur-sm border border-navy/10 px-2 py-1 sm:px-2.5 sm:py-1.5 shadow-[0_6px_18px_-10px_rgba(30,58,95,0.35)]',
                  isSide && 'max-w-[5.5rem] sm:max-w-none',
                )}
              >
                <span
                  className="grid place-items-center w-5 h-5 sm:w-6 sm:h-6 shrink-0 rounded-full text-[0.6rem] sm:text-[0.68rem] font-bold"
                  style={{ backgroundColor: accent, color: badgeInk }}
                  aria-hidden="true"
                >
                  {b.initial}
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-[0.55rem] sm:text-[0.58rem] uppercase tracking-wider text-gray-400 font-semibold">
                    {b.dir}
                  </span>
                  <span
                    className={cn(
                      'text-[0.7rem] sm:text-[0.8rem] font-bold text-navy sm:whitespace-nowrap',
                      isSide ? 'break-words' : 'whitespace-nowrap',
                    )}
                  >
                    {names[b.key]}
                  </span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-[0.7rem] text-gray-400">
        Stylized for orientation. Boundaries are approximate and not to scale.
      </p>
    </motion.figure>
  );
}
