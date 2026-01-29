'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

export interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  containerClassName?: string;
}

const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, className, containerClassName, type = 'text', value, defaultValue, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined ? Boolean(value) : Boolean(defaultValue);
    const isFloating = isFocused || hasValue;

    return (
      <div className={cn('relative', containerClassName)}>
        <input
          type={type}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            'peer w-full h-14 px-4 pt-5 pb-2 rounded-lg border border-gray-200 bg-white',
            'text-base text-navy',
            'transition-all duration-200',
            'focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'placeholder:text-transparent',
            className
          )}
          placeholder={label}
          {...props}
        />
        <label
          className={cn(
            'absolute left-4 transition-all duration-200 pointer-events-none',
            'text-gray-500',
            isFloating
              ? 'top-2 text-xs text-sky font-medium'
              : 'top-1/2 -translate-y-1/2 text-base'
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export { FloatingInput };
