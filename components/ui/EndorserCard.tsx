'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface EndorserCardProps {
  name: string;
  logo: string;
  index?: number;
}

export function EndorserCard({ name, logo, index = 0 }: EndorserCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className="relative cursor-pointer"
    >
      <motion.div
        animate={{
          y: isHovered ? -6 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative bg-navy rounded-2xl overflow-hidden aspect-[4/3] shadow-lg"
        style={{
          boxShadow: isHovered
            ? '0 20px 40px rgba(30, 58, 95, 0.3), 0 10px 20px rgba(30, 58, 95, 0.2)'
            : '0 4px 12px rgba(30, 58, 95, 0.15)',
        }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-sky/40" />

        {/* Subtle animated glow on hover */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-sky/10"
        />

        {/* Logo */}
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="relative w-full h-full">
            <Image
              src={logo}
              alt={name}
              fill
              className="object-contain drop-shadow-lg"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </div>

        {/* Organization name that slides up on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy via-navy/95 to-transparent pt-12 pb-4 px-4"
            >
              <p className="text-white text-sm font-semibold text-center leading-tight">
                {name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Corner accent */}
        <motion.div
          animate={{
            scale: isHovered ? 1 : 0.8,
            opacity: isHovered ? 0.6 : 0.3,
          }}
          transition={{ duration: 0.3 }}
          className="absolute -top-8 -right-8 w-24 h-24 bg-coral rounded-full blur-2xl"
        />
      </motion.div>
    </motion.div>
  );
}
