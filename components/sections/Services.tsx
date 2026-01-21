'use client';

import { motion } from 'framer-motion';
import { SERVICES } from '@/lib/constants';
import Card from '@/components/ui/Card';
import { FlipText } from '@/components/ui/FlipText';

const FUNDED_SERVICES = [
  'Firefighters',
  'EMTs',
  'Emergency Response',
  'Street Repairs',
  'Trash Pickup',
  'Bulky Item Pickup',
  'Recycling',
  'Illegal Dumping Cleanup',
  'Snow Removal',
  'Street Lighting',
  'Road Maintenance',
  'Infrastructure',
  'City Jobs',
  'Transportation',
  'Parks',
  'Recreation Centers',
  'City Programs',
  'Housing Services',
  'Water Services',
  'Public Works',
  'Municipal Court',
  'Economic Development',
  'City Planning',
  'Neighborhood Services',
  'Community Investment',
];

export default function Services() {
  return (
    <section id="services" className="section-padding bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-coral/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Animated Text Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-2">
            The E-Tax Funds
          </h2>
          <div className="flex justify-center">
            <FlipText
              words={FUNDED_SERVICES}
              duration={1500}
              className="text-3xl sm:text-4xl md:text-5xl text-coral"
            />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-6">
            Nearly half of all city services depend on the 1% earnings tax
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {SERVICES.map((service, index) => (
            <Card key={service.title} delay={index * 0.1}>
              <div className="text-3xl sm:text-5xl mb-2 sm:mb-4">{service.icon}</div>
              <h3 className="text-base sm:text-xl font-semibold text-navy mb-1 sm:mb-2">{service.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{service.description}</p>
            </Card>
          ))}
        </div>

        {/* Impact statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-navy via-sky to-navy p-[2px] rounded-2xl inline-block">
            <div className="bg-white rounded-2xl px-8 py-6">
              <p className="text-lg md:text-xl text-navy font-medium">
                Without the earnings tax, we would face{' '}
                <span className="text-coral font-bold">devastating cuts</span> to these essential services.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
