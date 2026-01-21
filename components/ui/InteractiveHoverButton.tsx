'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

  const variantStyles = {
    primary: {
      base: 'border-coral bg-white text-coral',
      circle: 'bg-coral',
      hoverText: 'text-white',
    },
    secondary: {
      base: 'border-navy bg-white text-navy',
      circle: 'bg-navy',
      hoverText: 'text-white',
    },
    outline: {
      base: 'border-white/80 bg-white/10 text-white',
      circle: 'bg-white',
      hoverText: 'text-navy',
    },
  };

  const sizeStyles = {
    default: 'min-w-[140px] px-6 py-3 text-sm',
    lg: 'min-w-[160px] px-8 py-4 text-base',
  };

  const styles = variantStyles[variant];

  const buttonContent = (
    <>
      {/* Default text - slides out */}
      <motion.span
        className="inline-block"
        animate={{
          x: isActive ? 48 : 0,
          opacity: isActive ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {text}
      </motion.span>

      {/* Hover text with arrow - slides in */}
      <motion.div
        className={cn(
          'absolute inset-0 z-10 flex items-center justify-center gap-2',
          styles.hoverText
        )}
        animate={{
          x: isActive ? 0 : 48,
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <span>{text}</span>
        <ArrowRight />
      </motion.div>

      {/* Expanding circle background */}
      <motion.div
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full',
          styles.circle
        )}
        animate={{
          width: isActive ? 400 : 0,
          height: isActive ? 400 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </>
  );

  const baseClasses = cn(
    'relative cursor-pointer overflow-hidden rounded-full border-2 text-center font-semibold transition-colors',
    styles.base,
    sizeStyles[size],
    className
  );

  const handleInteractionStart = () => setIsActive(true);
  const handleInteractionEnd = () => setIsActive(false);

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
      >
        {buttonContent}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      className={baseClasses}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      {...props}
    >
      {buttonContent}
    </button>
  );
});

InteractiveHoverButton.displayName = 'InteractiveHoverButton';

export { InteractiveHoverButton };
