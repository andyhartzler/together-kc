'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LinkCardProps {
  title: string;
  description: string;
  icon?: string; // Emoji icon
  imageUrl?: string; // Optional image
  href: string;
  buttonText?: string;
  variant?: 'dark' | 'light';
  className?: string;
}

const LinkCard: React.FC<LinkCardProps> = ({ className, title, description, icon, imageUrl, href, buttonText, variant = 'dark' }) => {
    const cardVariants = {
      initial: { scale: 1, y: 0 },
      hover: {
        scale: 1.03,
        y: -5,
        transition: {
          type: 'spring' as const,
          stiffness: 300,
          damping: 15,
        },
      },
    };

    const isDark = variant === 'dark';

    return (
      <motion.a
        href={href}
        className={cn(
          'group relative flex h-64 w-full flex-col justify-between overflow-hidden',
          'rounded-2xl p-6 shadow-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2',
          isDark
            ? 'bg-white/10 backdrop-blur-sm border border-white/20'
            : 'bg-white border border-gray-100 shadow-navy/5',
          className
        )}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        aria-label={`Link to ${title}`}
      >
        {/* Text content */}
        <div className="z-10">
          <h3 className={cn(
            "mb-2 text-xl font-semibold tracking-tight",
            isDark ? "text-white" : "text-navy"
          )}>
            {title}
          </h3>
          <p className={cn(
            "max-w-[75%] text-sm",
            isDark ? "text-white/70" : "text-gray-600"
          )}>
            {description}
          </p>
        </div>

        {/* Button */}
        {buttonText && (
          <div className="z-10">
            <span className={cn(
              "inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all",
              isDark
                ? "bg-coral text-white group-hover:bg-coral/90"
                : "bg-coral text-white group-hover:bg-coral/90"
            )}>
              {buttonText}
              <svg
                className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        )}

        {/* Icon/Image container with scale effect on hover */}
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 transform">
          {imageUrl ? (
            <motion.img
              src={imageUrl}
              alt={`${title} illustration`}
              className="h-40 w-40 object-contain transition-transform duration-300 ease-out group-hover:scale-110 opacity-60 group-hover:opacity-80"
            />
          ) : icon ? (
            <motion.span
              className="text-[8rem] opacity-30 group-hover:opacity-50 transition-opacity duration-300 select-none"
              style={{ filter: 'grayscale(0.3)' }}
            >
              {icon}
            </motion.span>
          ) : null}
        </div>

        {/* Subtle gradient overlay for better text readability */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isDark
            ? "bg-gradient-to-br from-white/5 to-transparent"
            : "bg-gradient-to-br from-coral/5 to-transparent"
        )} />
      </motion.a>
    );
};

export { LinkCard };
