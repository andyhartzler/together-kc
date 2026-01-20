'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { NAV_LINKS, VOTE_DATE } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Tagline */}
          <div className="space-y-4">
            <Image
              src="/images/together-kc footer logo.png"
              alt="Together KC"
              width={200}
              height={80}
              className="h-16 w-auto brightness-0 invert"
            />
            <p className="text-white/80 text-sm max-w-xs">
              Together, we can keep Kansas City strong. Vote YES to renew the earnings tax on {VOTE_DATE}.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://www.kcmo.gov/city-hall/elections"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Find Your Polling Place
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Get Involved</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/endorsements#endorse"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Add Your Endorsement
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@togetherkc.com"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <motion.a
                href="/endorsements#endorse"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-6 py-3 bg-coral text-white font-semibold rounded-full hover:bg-coral/90 transition-colors"
              >
                Vote YES on {VOTE_DATE}
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm text-center md:text-left">
              &copy; {currentYear} Together KC. All rights reserved.
            </p>
            <p className="text-white/60 text-xs text-center md:text-right max-w-md">
              Paid for by Together KC. Not authorized by any candidate or candidate committee.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
