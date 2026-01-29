'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-lg border border-gray-200 bg-white px-4 py-3',
        'text-base text-navy placeholder:text-gray-400',
        'transition-all duration-200',
        'focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);

Input.displayName = 'Input';

export { Input };
