'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  delay?: number;
}

export default function Card({
  children,
  className,
  glass = false,
  hover = true,
  delay = 0,
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -5, scale: 1.02 } : undefined}
      className={cn(
        'rounded-2xl p-4 sm:p-6',
        glass
          ? 'glass'
          : 'bg-white shadow-xl shadow-navy/5 border border-gray-100',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
