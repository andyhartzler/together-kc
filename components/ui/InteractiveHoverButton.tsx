'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InteractiveHoverButtonProps {
  text?: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'lg';
  className?: string;
  external?: boolean;
}

const InteractiveHoverButton: React.FC<InteractiveHoverButtonProps> = ({
  text = 'Button',
  href,
  variant = 'primary',
  size = 'default',
  className,
  external = false,
}) => {
  const variantStyles = {
    primary: 'bg-coral text-white hover:bg-coral/85',
    secondary: 'bg-navy text-white hover:bg-navy/85',
    outline: 'bg-white/10 text-white border-2 border-white/80 hover:bg-white hover:text-navy',
  };

  const sizeStyles = {
    default: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const baseClasses = cn(
    'group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200',
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const content = (
    <>
      <span>{text}</span>
      <svg
        className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={baseClasses}>
      {content}
    </button>
  );
};

export { InteractiveHoverButton };
