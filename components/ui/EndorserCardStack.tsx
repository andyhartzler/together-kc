"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type EndorserQuote = {
  id: string | number;
  name: string;
  title: string;
  organization?: string;
  quote: string;
  imageSrc: string;
  imageScale?: number;
  imageOffsetY?: number;
};

export type EndorserCardStackProps = {
  quotes: EndorserQuote[];
  initialIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  spreadDeg?: number;
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;
  springStiffness?: number;
  springDamping?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  className?: string;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function EndorserCardStack({
  quotes,
  initialIndex = 0,
  maxVisible = 5,
  cardWidth = 400,
  cardHeight = 480,
  overlap = 0.55,
  spreadDeg = 12,
  perspectivePx = 1200,
  depthPx = 100,
  tiltXDeg = 2,
  activeLiftPx = 30,
  activeScale = 1.05,
  inactiveScale = 0.88,
  springStiffness = 120,
  springDamping = 20,
  loop = true,
  autoAdvance = true,
  intervalMs = 3000,
  className,
}: EndorserCardStackProps) {
  const reduceMotion = useReducedMotion();
  const len = quotes.length;

  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len));
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // Autoplay - only pause when actively dragging
  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len) return;
    if (isDragging) return;

    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(700, intervalMs));

    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, isDragging, reduceMotion, len, loop, active, next]);

  if (!len) return null;

  return (
    <div className={cn("w-full", className)}>
      {/* Stage */}
      <div
        className="relative w-full touch-pan-y"
        style={{ height: Math.max(520, cardHeight + 60) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Ambient glow effects */}
        <div
          className="pointer-events-none absolute inset-x-0 top-10 mx-auto h-64 w-[80%] rounded-full opacity-40"
          style={{
            background: "radial-gradient(ellipse, rgba(74, 144, 217, 0.3) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-48 w-[90%] rounded-full opacity-50"
          style={{
            background: "radial-gradient(ellipse, rgba(30, 58, 95, 0.4) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ perspective: `${perspectivePx}px` }}
        >
          <AnimatePresence initial={false}>
            {quotes.map((quote, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              if (!visible) return null;

              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 8;
              const z = -abs * depthPx;
              const isActive = off === 0;
              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;
              // Blur increases with distance from center
              const blurAmount = isActive ? 0 : Math.min(abs * 1.5, 4);

              const dragProps = isActive
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.15,
                    onDragStart: () => setIsDragging(true),
                    onDragEnd: (
                      _e: unknown,
                      info: { offset: { x: number }; velocity: { x: number } }
                    ) => {
                      setIsDragging(false);
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(120, cardWidth * 0.2);
                      if (travel > threshold || v > 500) prev();
                      else if (travel < -threshold || v < -500) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={quote.id}
                  className={cn(
                    "absolute rounded-3xl overflow-hidden",
                    "will-change-transform select-none",
                    isActive
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-pointer"
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: y + 60, x, rotateZ, rotateX, scale: 0.8 }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  onClick={() => !isActive && setActive(i)}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: "preserve-3d",
                      filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
                    }}
                  >
                    <EndorserCard quote={quote} active={isActive} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function EndorserCard({ quote, active }: { quote: EndorserQuote; active: boolean }) {
  return (
    <div className="relative h-full w-full">
      {/* Solid glass card background - no transparency */}
      <div
        className={cn(
          "absolute inset-0 rounded-3xl transition-all duration-300",
          active
            ? "bg-gradient-to-br from-white via-white to-sky/5 shadow-2xl shadow-sky/30"
            : "bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-xl shadow-navy/15"
        )}
      />

      {/* Glass reflection overlay for dewy look */}
      <div
        className={cn(
          "absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300",
          active ? "opacity-100" : "opacity-60"
        )}
        style={{
          background: active
            ? "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 40%, rgba(74,144,217,0.1) 100%)"
            : "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 50%, rgba(200,200,200,0.2) 100%)",
        }}
      />

      {/* Glossy highlight at top */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1/3 rounded-t-3xl pointer-events-none transition-opacity duration-300",
          active ? "opacity-80" : "opacity-40"
        )}
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, transparent 100%)",
        }}
      />

      {/* Border glow for active card */}
      {active && (
        <>
          <div
            className="absolute -inset-[2px] rounded-3xl -z-10"
            style={{
              background: "linear-gradient(135deg, #4a90d9 0%, #87CEEB 50%, #4a90d9 100%)",
              backgroundSize: "200% 200%",
              animation: "gradientShift 3s ease infinite",
            }}
          />
          <div
            className="absolute -inset-[3px] rounded-3xl -z-20 opacity-50"
            style={{
              background: "linear-gradient(135deg, #4a90d9 0%, #87CEEB 50%, #4a90d9 100%)",
              filter: "blur(12px)",
            }}
          />
        </>
      )}

      {/* Subtle border for inactive cards */}
      {!active && (
        <div className="absolute inset-0 rounded-3xl border border-gray-200/80 pointer-events-none" />
      )}

      {/* Inner content */}
      <div className="relative h-full w-full rounded-3xl overflow-hidden p-6 flex flex-col">
        {/* Quote icon */}
        <div className="flex justify-center mb-3">
          <svg
            className={cn(
              "w-9 h-9 transition-colors duration-300",
              active ? "text-coral" : "text-coral/50"
            )}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Quote text - always visible, no animation */}
        <div className="flex-1 flex items-center justify-center px-2">
          <blockquote
            className={cn(
              "text-center leading-relaxed transition-colors duration-300",
              active
                ? "text-navy text-lg md:text-xl font-medium"
                : "text-navy/80 text-base md:text-lg"
            )}
          >
            &ldquo;{quote.quote}&rdquo;
          </blockquote>
        </div>

        {/* Author section */}
        <div
          className={cn(
            "mt-3 pt-4 border-t transition-colors duration-300",
            active ? "border-sky/40" : "border-gray-200"
          )}
        >
          <div className="flex items-center gap-4">
            {/* Photo with ring effect */}
            <div
              className={cn(
                "relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 transition-all duration-300",
                active
                  ? "ring-[3px] ring-sky/60 ring-offset-2 ring-offset-white"
                  : "ring-2 ring-gray-200"
              )}
            >
              <Image
                src={quote.imageSrc}
                alt={quote.name}
                fill
                className="object-cover object-top"
                style={{ transform: `scale(${quote.imageScale || 1}) translateY(${quote.imageOffsetY || 0}px)` }}
                sizes="80px"
              />
            </div>

            {/* Name and title */}
            <div className="flex-1 min-w-0">
              <div
                className={cn(
                  "font-bold transition-colors duration-300 text-base leading-tight",
                  active ? "text-navy" : "text-navy/80"
                )}
              >
                {quote.name}
              </div>
              <div
                className={cn(
                  "text-xs transition-colors duration-300 leading-tight",
                  active ? "text-sky font-medium" : "text-gray-500"
                )}
              >
                {quote.title}
              </div>
              {quote.organization && (
                <div
                  className={cn(
                    "text-xs transition-colors duration-300 leading-tight whitespace-pre-line",
                    active ? "text-gray-600" : "text-gray-400"
                  )}
                >
                  {quote.organization}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
