'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function EndorsementForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    type: 'individual',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission is visual only for MVP
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 shadow-xl text-center"
      >
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-navy mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-6">
          Your endorsement has been received. Together, we&#39;ll keep Kansas City strong!
        </p>
        <Button onClick={() => setSubmitted(false)} variant="outline">
          Submit Another
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl p-8 shadow-xl shadow-navy/10 border border-gray-100"
    >
      <h3 className="text-2xl font-bold text-navy mb-6">Add Your Endorsement</h3>

      <div className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-navy mb-2">
            I am endorsing as a(n):
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="individual"
                checked={formData.type === 'individual'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-4 h-4 text-coral border-gray-300 focus:ring-coral"
              />
              <span className="ml-2 text-gray-700">Individual</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="type"
                value="organization"
                checked={formData.type === 'organization'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-4 h-4 text-coral border-gray-300 focus:ring-coral"
              />
              <span className="ml-2 text-gray-700">Organization</span>
            </label>
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-navy mb-2">
            {formData.type === 'individual' ? 'Your Name' : 'Contact Name'} *
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none transition-all"
            placeholder="Enter your name"
          />
        </div>

        {/* Organization (if applicable) */}
        {formData.type === 'organization' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <label htmlFor="organization" className="block text-sm font-medium text-navy mb-2">
              Organization Name *
            </label>
            <input
              type="text"
              id="organization"
              required={formData.type === 'organization'}
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none transition-all"
              placeholder="Enter organization name"
            />
          </motion.div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-sky focus:ring-2 focus:ring-sky/20 outline-none transition-all"
            placeholder="your@email.com"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button type="submit" className="w-full">
            Submit Endorsement
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you agree to have your name listed as a supporter.
        </p>
      </div>
    </motion.form>
  );
}
