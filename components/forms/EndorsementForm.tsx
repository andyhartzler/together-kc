'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { cn } from '@/lib/utils';

interface EndorsementFormProps {
  onSuccess?: () => void;
  compact?: boolean;
}

export default function EndorsementForm({ onSuccess, compact = false }: EndorsementFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    type: 'individual',
    why: '',
    consent: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [showWhyField, setShowWhyField] = useState(false);

  // Show "why" field when email contains @ sign
  useEffect(() => {
    if (formData.email.includes('@') && !showWhyField) {
      const timer = setTimeout(() => setShowWhyField(true), 300);
      return () => clearTimeout(timer);
    }
  }, [formData.email, showWhyField]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consent) return;
    // Form submission is visual only for MVP
    setSubmitted(true);
    onSuccess?.();
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "bg-white rounded-2xl p-8 text-center",
          !compact && "shadow-xl"
        )}
      >
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-navy mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-6">
          Your endorsement has been received. Together, we&#39;ll keep Kansas City strong!
        </p>
        <Button onClick={() => {
          setSubmitted(false);
          setFormData({
            name: '',
            email: '',
            organization: '',
            type: 'individual',
            why: '',
            consent: false,
          });
          setShowWhyField(false);
        }} variant="outline">
          Submit Another
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className={cn(
        "bg-white rounded-2xl p-8",
        !compact && "shadow-xl shadow-navy/10 border border-gray-100"
      )}
    >
      {!compact && (
        <h3 className="text-2xl font-bold text-navy mb-6">Add Your Endorsement</h3>
      )}

      <div className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-navy mb-3">
            I am endorsing as a(n):
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="type"
                value="individual"
                checked={formData.type === 'individual'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-4 h-4 text-coral border-gray-300 focus:ring-coral cursor-pointer"
              />
              <span className="ml-2 text-gray-700">Individual</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="type"
                value="organization"
                checked={formData.type === 'organization'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-4 h-4 text-coral border-gray-300 focus:ring-coral cursor-pointer"
              />
              <span className="ml-2 text-gray-700">Organization</span>
            </label>
          </div>
        </div>

        {/* Name - Floating Label */}
        <FloatingInput
          label={formData.type === 'individual' ? 'Your Name *' : 'Contact Name *'}
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        {/* Organization (if applicable) */}
        <AnimatePresence>
          {formData.type === 'organization' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FloatingInput
                label="Organization Name *"
                type="text"
                required={formData.type === 'organization'}
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email - Floating Label */}
        <FloatingInput
          label="Email Address *"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        {/* Why do you support - appears after name/email filled */}
        <AnimatePresence>
          {showWhyField && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <textarea
                  value={formData.why}
                  onChange={(e) => setFormData({ ...formData, why: e.target.value })}
                  placeholder="What City Services are most important to you? (optional)"
                  rows={3}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border border-gray-200 bg-white',
                    'text-base text-navy placeholder:text-gray-400',
                    'transition-all duration-200 resize-none',
                    'focus:outline-none focus:border-sky focus:ring-2 focus:ring-sky/20'
                  )}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Consent Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.consent}
              onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
              className="w-5 h-5 mt-0.5 text-coral border-gray-300 rounded focus:ring-coral focus:ring-2 cursor-pointer"
            />
            <span className="text-sm text-gray-600 leading-tight">
              I consent to having my name displayed publicly as an endorser of the Kansas City Earnings Tax
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className={cn(
              "w-full",
              !formData.consent && "opacity-50 cursor-not-allowed"
            )}
            disabled={!formData.consent}
          >
            Submit Endorsement
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Your email will not be shared or displayed publicly.
        </p>
      </div>
    </motion.form>
  );
}
