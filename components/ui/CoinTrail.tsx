'use client';

import React, { useCallback, useMemo, useRef, useId } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDimensions } from '@/components/hooks/use-debounced-dimensions';
import Image from 'next/image';

interface CoinTrailProps {
  pixelSize?: number;
  fadeDuration?: number;
  delay?: number;
  className?: string;
}

const CoinTrail: React.FC<CoinTrailProps> = ({
  pixelSize = 50,
  fadeDuration = 1000,
  delay = 0,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);
  const trailId = useId();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / pixelSize);
      const y = Math.floor((e.clientY - rect.top) / pixelSize);

      const pixelElement = document.getElementById(
        `${trailId}-pixel-${x}-${y}`
      );
      if (pixelElement) {
        const animatePixel = (pixelElement as unknown as { __animatePixel?: () => void }).__animatePixel;
        if (animatePixel) animatePixel();
      }
    },
    [pixelSize, trailId]
  );

  const columns = useMemo(
    () => Math.ceil(dimensions.width / pixelSize),
    [dimensions.width, pixelSize]
  );
  const rows = useMemo(
    () => Math.ceil(dimensions.height / pixelSize),
    [dimensions.height, pixelSize]
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 w-full h-full overflow-hidden',
        className
      )}
      onMouseMove={handleMouseMove}
    >
      {dimensions.width > 0 && Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <CoinDot
              key={`${colIndex}-${rowIndex}`}
              id={`${trailId}-pixel-${colIndex}-${rowIndex}`}
              size={pixelSize}
              fadeDuration={fadeDuration}
              delay={delay}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

interface CoinDotProps {
  id: string;
  size: number;
  fadeDuration: number;
  delay: number;
}

const CoinDot: React.FC<CoinDotProps> = React.memo(
  ({ id, size, fadeDuration, delay }) => {
    const controls = useAnimationControls();

    const animatePixel = useCallback(() => {
      controls.start({
        opacity: [1, 0],
        scale: [0.5, 1, 0.8],
        rotate: [0, 15, -10, 0],
        transition: {
          duration: fadeDuration / 1000,
          delay: delay / 1000,
          ease: 'easeOut'
        },
      });
    }, [controls, fadeDuration, delay]);

    const ref = useCallback(
      (node: HTMLDivElement | null) => {
        if (node) {
          (node as unknown as { __animatePixel: () => void }).__animatePixel = animatePixel;
        }
      },
      [animatePixel]
    );

    return (
      <motion.div
        id={id}
        ref={ref}
        className="flex items-center justify-center"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        initial={{ opacity: 0 }}
        animate={controls}
      >
        <Image
          src="/images/coin.png"
          alt=""
          width={size - 10}
          height={size - 10}
          className="pointer-events-none select-none"
          draggable={false}
        />
      </motion.div>
    );
  }
);

CoinDot.displayName = 'CoinDot';
export { CoinTrail };
