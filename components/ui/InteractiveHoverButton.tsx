'use client';

import React from 'react';
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
      <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>

      {/* Hover text with arrow - slides in */}
      <div
        className={cn(
          'absolute inset-0 z-10 flex items-center justify-center gap-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100',
          styles.hoverText
        )}
      >
        <span>{text}</span>
        <ArrowRight />
      </div>

      {/* Expanding circle background */}
      <div
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 rounded-full transition-all duration-300 ease-out group-hover:w-[400px] group-hover:h-[400px]',
          styles.circle
        )}
      />
    </>
  );

  const baseClasses = cn(
    'group relative cursor-pointer overflow-hidden rounded-full border-2 text-center font-semibold transition-colors',
    styles.base,
    sizeStyles[size],
    className
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button ref={ref} className={baseClasses} {...props}>
      {buttonContent}
    </button>
  );
});

InteractiveHoverButton.displayName = 'InteractiveHoverButton';

export { InteractiveHoverButton };
