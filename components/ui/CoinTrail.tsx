'use client';

import React, { useCallback, useMemo, useRef, useId, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDimensions } from '@/components/hooks/use-debounced-dimensions';

// Coin types - using regular img tags for immediate display (no Next.js Image optimization delay)
const COIN_PERCENT = { src: '/images/coin-1-percent.png', sizeMultiplier: 0.9 };
const COIN_CENT = { src: '/images/coin-cent.png', sizeMultiplier: 0.9 };
const COIN_VOTE_YES = { src: '/images/coin-vote-yes.png', sizeMultiplier: 1.2 };

type CoinType = typeof COIN_PERCENT;

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
function getRandomCoin(): CoinType {
  const weights = [1, 1, 2]; // percent, cent, vote yes
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < COINS.length; i++) {
    random -= weights[i];
    if (random <= 0) return COINS[i];
  }
  return COIN_VOTE_YES;
}

// Session state - module level for persistence across re-renders
const sessionState = {
  coinIndex: 0,
  isFirstRound: true,
};

// Get next coin in sequence or random after first round
function getNextCoin(): CoinType {
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

// Preload all coin images immediately
if (typeof window !== 'undefined') {
  COINS.forEach(coin => {
    const img = new window.Image();
    img.src = coin.src;
  });
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
        // Get the next coin FIRST, then trigger animation with it
        const coin = getNextCoin();
        const triggerFn = (pixelElement as unknown as { __trigger?: (coin: CoinType) => void }).__trigger;
        if (triggerFn) triggerFn(coin);
      }
    },
    [pixelSize, trailId]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      triggerPixel(e.clientX, e.clientY);
    },
    [triggerPixel]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.touches[0];
      if (touch) {
        triggerPixel(touch.clientX, touch.clientY);
      }
    },
    [triggerPixel]
  );

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
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
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

// Animation state: null = nothing showing, object = showing animation
interface AnimationState {
  key: number;
  coin: CoinType;
}

const CoinDot: React.FC<CoinDotProps> = React.memo(
  ({ id, size, fadeDuration, delay }) => {
    // Single state that atomically captures both the animation instance and the coin
    const [animation, setAnimation] = useState<AnimationState | null>(null);
    const keyRef = useRef(0);
    const nodeRef = useRef<HTMLDivElement | null>(null);

    // Trigger function - receives coin directly from parent (no stale closure issues)
    const trigger = useCallback((coin: CoinType) => {
      // Increment key to force new animation instance
      const newKey = ++keyRef.current;
      // Atomically set both key and coin together
      setAnimation({ key: newKey, coin });
    }, []);

    // Attach trigger function to DOM element
    const ref = useCallback(
      (node: HTMLDivElement | null) => {
        nodeRef.current = node;
        if (node) {
          (node as unknown as { __trigger: (coin: CoinType) => void }).__trigger = trigger;
        }
      },
      [trigger]
    );

    // Clear animation after it completes (optional cleanup)
    useEffect(() => {
      if (animation) {
        const timer = setTimeout(() => {
          setAnimation(null);
        }, fadeDuration + delay + 100); // Small buffer
        return () => clearTimeout(timer);
      }
    }, [animation, fadeDuration, delay]);

    const coinSize = animation
      ? Math.round((size - 10) * animation.coin.sizeMultiplier)
      : 0;

    return (
      <div
        id={id}
        ref={ref}
        className="flex items-center justify-center"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {animation && (
          <motion.div
            key={animation.key}
            initial={{ opacity: 1, scale: 0.5, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: [0.5, 1, 0.8],
              rotate: [0, 15, -10, 0]
            }}
            transition={{
              duration: fadeDuration / 1000,
              delay: delay / 1000,
              ease: 'easeOut',
            }}
            className="flex items-center justify-center"
          >
            {/* Using img tag instead of Next.js Image for immediate display */}
            <img
              src={animation.coin.src}
              alt=""
              width={coinSize}
              height={coinSize}
              className="pointer-events-none select-none"
              draggable={false}
            />
          </motion.div>
        )}
      </div>
    );
  }
);

CoinDot.displayName = 'CoinDot';
export { CoinTrail };
