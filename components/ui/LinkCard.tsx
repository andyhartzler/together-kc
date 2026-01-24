'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LinkCardProps {
  title: string;
  description: string;
  icon?: string;
  href: string;
  buttonText?: string;
  className?: string;
}

const LinkCard: React.FC<LinkCardProps> = ({ className, title, description, icon, href, buttonText }) => {
  return (
    <motion.a
      href={href}
      className={cn(
        'group relative flex h-56 w-full flex-col justify-between overflow-hidden',
        'rounded-xl p-6 bg-white/10 backdrop-blur-sm border border-white/20',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -5 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Text content */}
      <div className="z-10">
        <h3 className="mb-2 text-xl font-semibold text-white">
          {title}
        </h3>
        <p className="max-w-[75%] text-sm text-white/70">
          {description}
        </p>
      </div>

      {/* Button */}
      {buttonText && (
        <div className="z-10">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-coral text-white group-hover:bg-coral/90 transition-all">
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

      {/* Icon in corner */}
      {icon && (
        <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
          <span className="text-[7rem] opacity-20 group-hover:opacity-40 transition-opacity duration-300 select-none">
            {icon}
          </span>
        </div>
      )}
    </motion.a>
  );
};

export { LinkCard };
