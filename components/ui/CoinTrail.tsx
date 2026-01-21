'use client';

import React, { useCallback, useMemo, useRef, useId } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDimensions } from '@/components/hooks/use-debounced-dimensions';
import Image from 'next/image';

// Coin types
const COIN_PERCENT = { src: '/images/coin-1-percent.png', sizeMultiplier: 0.9 };
const COIN_CENT = { src: '/images/coin-cent.png', sizeMultiplier: 0.9 };
const COIN_VOTE_YES = { src: '/images/coin-vote-yes.png', sizeMultiplier: 1.2 };

const COINS = [COIN_PERCENT, COIN_CENT, COIN_VOTE_YES];

// First round sequence: 6 vote yes → cent → percent → cent → percent → 6 vote yes
const FIRST_ROUND_SEQUENCE = [
  ...Array(6).fill(COIN_VOTE_YES),
  COIN_CENT,
  COIN_PERCENT,
  COIN_CENT,
  COIN_PERCENT,
  ...Array(6).fill(COIN_VOTE_YES),
];

// Get weighted random coin (vote yes is 2x more likely)
function getRandomCoin() {
  const weights = [1, 1, 2]; // percent, cent, vote yes
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < COINS.length; i++) {
    random -= weights[i];
    if (random <= 0) return COINS[i];
  }
  return COIN_VOTE_YES;
}

// Session state - only accessed on client side
const sessionState = {
  currentCoin: COIN_VOTE_YES,
  isActive: false,
  coinIndex: 0,
  isFirstRound: true,
};

// Get next coin in sequence or random after first round
function getNextCoin() {
  if (sessionState.isFirstRound) {
    const coin = FIRST_ROUND_SEQUENCE[sessionState.coinIndex];
    sessionState.coinIndex++;
    if (sessionState.coinIndex >= FIRST_ROUND_SEQUENCE.length) {
      sessionState.isFirstRound = false;
    }
    return coin;
  }
  return getRandomCoin();
}

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
      sessionState.isActive = true;
    }
  }, []);

  const endSession = useCallback(() => {
    sessionState.isActive = false;
  }, []);

  // Get next coin for each pixel trigger
  const advanceCoin = useCallback(() => {
    sessionState.currentCoin = getNextCoin();
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
        // Advance to next coin before animating
        advanceCoin();
        const animatePixel = (pixelElement as unknown as { __animatePixel?: () => void }).__animatePixel;
        if (animatePixel) animatePixel();
      }
    },
    [pixelSize, trailId, advanceCoin]
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
