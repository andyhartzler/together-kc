'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { accentInk } from '@/components/august/accent';
import { PAPER_EASE } from '@/components/august/paper';
import {
  VIEWPORT_REVEAL,
  usePaperEntrance,
} from '@/components/august/signatures/entrance';
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

const VB_W = 360;
const VB_H = 560;

// The plat rectangle. The real CCED district (9th Street to Gregory
// Boulevard, The Paseo to Indiana Avenue) is roughly a mile wide and
// six-plus miles tall, so the plat honors that tall, narrow proportion.
const PLAT = { x: 136, y: 64, w: 88, h: 432 } as const;

// Corner registration marks (printer's crosshairs) at the panel corners.
const MARKS: Array<[number, number]> = [
  [26, 26],
  [VB_W - 26, 26],
  [26, VB_H - 26],
  [VB_W - 26, VB_H - 26],
];

/**
 * DistrictMap, PAPER TRAIL restyle: the district plat. A tall, narrow
 * hatched rectangle drawn like a surveyor's exhibit: 45-degree ink hatching,
 * a heavy boundary that draws itself once on scroll, the four boundary
 * streets typeset on their true sides, and corner registration marks. Flat
 * print, nothing loops. Reduced motion renders the plat fully drawn, and the
 * four boundaries read as text through the figure's aria-label.
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
  const animate = usePaperEntrance();
  const inks = accentInk(accent);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const hatchId = `plat-hatch-${uid}`;

  const ariaLabel =
    `Plat of the CCED district, a tall narrow corridor on Kansas City's East Side. ` +
    `Bounded by ${north} to the north, ${east} to the east, ${south} to the south, and ${west} to the west.`;

  const cx = PLAT.x + PLAT.w / 2;
  const cy = PLAT.y + PLAT.h / 2;

  const streetLabel = {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.14em',
    fill: 'var(--ink)',
  } as const;
  const dirLabel = {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.18em',
    fill: 'var(--ink-soft)',
  } as const;

  return (
    <figure className={cn('m-0 w-full', className)}>
      {(heading || caption) && (
        <figcaption className="mb-5">
          {heading && (
            <h3 className="flex items-center gap-3 text-lg font-extrabold leading-snug text-ink sm:text-xl">
              <span
                aria-hidden="true"
                className="inline-block h-[3px] w-6 shrink-0"
                style={{ backgroundColor: inks.field }}
              />
              {heading}
            </h3>
          )}
          {caption && <p className="type-fine mt-2 max-w-prose">{caption}</p>}
        </figcaption>
      )}

      <div className="mx-auto w-full max-w-[380px]">
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className="block h-auto w-full"
          role="img"
          aria-label={ariaLabel}
        >
          <defs>
            <pattern id={hatchId} width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="7" height="7" fill="transparent" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(30,58,95,0.3)" strokeWidth="1.4" />
            </pattern>
          </defs>

          {/* corner registration marks */}
          <g stroke="var(--ink-soft)" strokeWidth={1} aria-hidden="true">
            {MARKS.map(([mx, my]) => (
              <g key={`${mx}-${my}`}>
                <line x1={mx - 9} y1={my} x2={mx + 9} y2={my} />
                <line x1={mx} y1={my - 9} x2={mx} y2={my + 9} />
              </g>
            ))}
          </g>

          {/* hatched district fill */}
          <motion.rect
            x={PLAT.x}
            y={PLAT.y}
            width={PLAT.w}
            height={PLAT.h}
            fill={`url(#${hatchId})`}
            initial={animate ? { opacity: 0 } : false}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT_REVEAL}
            transition={{ duration: 0.6, delay: animate ? 0.5 : 0, ease: PAPER_EASE }}
          />

          {/* boundary draws itself once */}
          <motion.rect
            x={PLAT.x}
            y={PLAT.y}
            width={PLAT.w}
            height={PLAT.h}
            fill="none"
            stroke={inks.inkOnPaper}
            strokeWidth={2.5}
            initial={animate ? { pathLength: 0 } : false}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT_REVEAL}
            transition={animate ? { duration: 1.2, ease: PAPER_EASE } : { duration: 0 }}
          />

          {/* boundary streets on their true sides */}
          <g aria-hidden="true" style={{ textTransform: 'uppercase' }}>
            <text x={cx} y={PLAT.y - 24} textAnchor="middle" style={dirLabel}>
              North
            </text>
            <text x={cx} y={PLAT.y - 10} textAnchor="middle" style={streetLabel}>
              {north}
            </text>

            <text x={cx} y={PLAT.y + PLAT.h + 20} textAnchor="middle" style={streetLabel}>
              {south}
            </text>
            <text x={cx} y={PLAT.y + PLAT.h + 34} textAnchor="middle" style={dirLabel}>
              South
            </text>

            <text
              x={PLAT.x - 14}
              y={cy}
              textAnchor="middle"
              transform={`rotate(-90 ${PLAT.x - 14} ${cy})`}
              style={streetLabel}
            >
              {west}
            </text>
            <text
              x={PLAT.x - 28}
              y={cy}
              textAnchor="middle"
              transform={`rotate(-90 ${PLAT.x - 28} ${cy})`}
              style={dirLabel}
            >
              West
            </text>

            <text
              x={PLAT.x + PLAT.w + 14}
              y={cy}
              textAnchor="middle"
              transform={`rotate(90 ${PLAT.x + PLAT.w + 14} ${cy})`}
              style={streetLabel}
            >
              {east}
            </text>
            <text
              x={PLAT.x + PLAT.w + 28}
              y={cy}
              textAnchor="middle"
              transform={`rotate(90 ${PLAT.x + PLAT.w + 28} ${cy})`}
              style={dirLabel}
            >
              East
            </text>
          </g>

          {/* north arrow, top-left */}
          <g aria-hidden="true">
            <line x1={40} y1={92} x2={40} y2={68} stroke="var(--ink-soft)" strokeWidth={1.5} />
            <path d="M40 60 l5 10 l-10 0 Z" fill={inks.inkOnPaper} />
            <text x={40} y={108} textAnchor="middle" style={dirLabel}>
              N
            </text>
          </g>
        </svg>
      </div>

      <p className="type-fine mt-3">
        Stylized for orientation. Boundaries are approximate and not to scale.
      </p>
    </figure>
  );
}
