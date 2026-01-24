'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'lg';
}

// Arrow icon component
const ArrowRight = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = 'Button', className, href, variant = 'primary', size = 'default', ...props }, ref) => {
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const variantStyles = {
    primary: {
      base: 'border-coral bg-white text-coral',
      activeBase: 'border-coral bg-coral text-white',
      circle: 'bg-coral',
      hoverText: 'text-white',
    },
    secondary: {
      base: 'border-navy bg-white text-navy',
      activeBase: 'border-navy bg-navy text-white',
      circle: 'bg-navy',
      hoverText: 'text-white',
    },
    outline: {
      base: 'border-white/80 bg-white/10 text-white',
      activeBase: 'border-white bg-white text-navy',
      circle: 'bg-white',
      hoverText: 'text-navy',
    },
  };

  const sizeStyles = {
    default: 'min-w-[140px] px-6 py-3 text-sm',
    lg: 'min-w-[160px] px-8 py-4 text-base',
  };

  const styles = variantStyles[variant];

  // Simple mobile content - just text with background color change
  const mobileContent = (
    <span className="relative z-10 select-none">{text}</span>
  );

  // Desktop content - full animation
  const desktopContent = (
    <>
      {/* Default text - slides out */}
      <span
        className={cn(
          'inline-block transition-all duration-300 select-none',
          isActive ? 'translate-x-12 opacity-0' : 'translate-x-0 opacity-100'
        )}
      >
        {text}
      </span>

      {/* Hover text with arrow - slides in */}
      <div
        className={cn(
          'absolute inset-0 z-10 flex items-center justify-center gap-2 transition-all duration-300 select-none',
          styles.hoverText,
          isActive ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'
        )}
      >
        <span>{text}</span>
        <ArrowRight />
      </div>

      {/* Expanding circle background */}
      <div
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out',
          styles.circle,
          isActive ? 'w-[200%] h-[300%]' : 'w-0 h-0'
        )}
      />
    </>
  );

  const baseClasses = cn(
    'relative cursor-pointer overflow-hidden rounded-full border-2 text-center font-semibold select-none',
    // Mobile: simple bg transition, Desktop: keep base for animation
    isMobile
      ? cn(styles.base, 'transition-colors duration-150 active:scale-95', isActive && styles.activeBase)
      : cn(styles.base, 'transition-colors'),
    sizeStyles[size],
    className
  );

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) setIsActive(true);
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) setIsActive(false);
  }, [isMobile]);

  const handleTouchStart = useCallback(() => {
    if (isMobile) setIsActive(true);
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (isMobile) {
      // Brief delay so user sees the active state
      setTimeout(() => setIsActive(false), 150);
    }
  }, [isMobile]);

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {isMobile ? mobileContent : desktopContent}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      className={baseClasses}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      {isMobile ? mobileContent : desktopContent}
    </button>
  );
});

InteractiveHoverButton.displayName = 'InteractiveHoverButton';

export { InteractiveHoverButton };
