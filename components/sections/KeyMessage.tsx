'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { KEY_FACTS } from '@/lib/constants';

const Scene = dynamic(() => import('@/components/3d/Scene'), { ssr: false });
const AnimatedCoin = dynamic(() => import('@/components/3d/AnimatedCoin'), { ssr: false });

export default function KeyMessage() {
  return (
    <section className="section-padding bg-gradient-to-b from-light-gray to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 3D Coin */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[300px] md:h-[400px] order-2 md:order-1"
          >
            <Scene className="w-full h-full" camera={{ position: [0, 0, 4], fov: 45 }}>
              <AnimatedCoin position={[0, 0, 0]} scale={1.2} />
            </Scene>
            {/* Glow effect behind coin */}
            <div className="absolute inset-0 bg-golden/20 rounded-full blur-3xl -z-10 scale-75" />
          </motion.div>

          {/* Message */}
          <div className="order-1 md:order-2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-6 leading-tight">
                Renewing will{' '}
                <span className="text-coral">NOT</span> raise taxes
                <br />
                by a single penny
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                The 1% earnings tax has been funding essential Kansas City services since 1963.
                This is simply a renewal — the same rate we&#39;ve had for over 60 years. No increase.
                Just continued support for the city we love.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {KEY_FACTS.map((fact, index) => (
                <motion.div
                  key={fact.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-lg shadow-navy/5 border border-gray-100"
                >
                  <div className="text-3xl font-bold text-coral mb-1">{fact.value}</div>
                  <div className="text-sm text-gray-600">{fact.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
