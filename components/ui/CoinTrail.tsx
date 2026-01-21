'use client';

import React, { useCallback, useMemo, useRef, useId } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDimensions } from '@/components/hooks/use-debounced-dimensions';
import Image from 'next/image';

// Coin types with their weights and size multipliers
const COINS = [
  { src: '/images/coin-1-percent.png', weight: 1, sizeMultiplier: 0.9 },
  { src: '/images/coin-cent.png', weight: 1, sizeMultiplier: 0.9 },
  { src: '/images/coin-vote-yes.png', weight: 1.35, sizeMultiplier: 1.2 },
];

// Get weighted random coin
function getRandomCoin() {
  const totalWeight = COINS.reduce((sum, coin) => sum + coin.weight, 0);
  let random = Math.random() * totalWeight;

  for (const coin of COINS) {
    random -= coin.weight;
    if (random <= 0) return coin;
  }
  return COINS[0];
}

// Session state - only accessed on client side
const sessionState = {
  currentCoin: COINS[0],
  isActive: false,
};

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

  const startSession = useCallback(() => {
    if (!sessionState.isActive) {
      sessionState.currentCoin = getRandomCoin();
      sessionState.isActive = true;
    }
  }, []);

  const endSession = useCallback(() => {
    sessionState.isActive = false;
  }, []);

  const triggerPixel = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.floor((clientX - rect.left) / pixelSize);
      const y = Math.floor((clientY - rect.top) / pixelSize);

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

  const handleMouseEnter = useCallback(() => {
    startSession();
  }, [startSession]);

  const handleMouseLeave = useCallback(() => {
    endSession();
  }, [endSession]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      startSession();
      triggerPixel(e.clientX, e.clientY);
    },
    [triggerPixel, startSession]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      startSession();
      const touch = e.touches[0];
      if (touch) {
        triggerPixel(touch.clientX, touch.clientY);
      }
    },
    [triggerPixel, startSession]
  );

  const handleTouchEnd = useCallback(() => {
    endSession();
  }, [endSession]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      if (touch) {
        triggerPixel(touch.clientX, touch.clientY);
      }
    },
    [triggerPixel]
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
        'absolute inset-0 w-full h-full overflow-hidden touch-none',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
    const [activeCoin, setActiveCoin] = React.useState(COINS[0]);

    const animatePixel = useCallback(() => {
      // Use the current session coin
      setActiveCoin(sessionState.currentCoin);
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

    const coinSize = Math.round((size - 10) * activeCoin.sizeMultiplier);

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
          src={activeCoin.src}
          alt=""
          width={coinSize}
          height={coinSize}
          className="pointer-events-none select-none"
          draggable={false}
        />
      </motion.div>
    );
  }
);

CoinDot.displayName = 'CoinDot';
export { CoinTrail };
