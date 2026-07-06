'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com/TogetherKC/', icon: '/images/social/facebook.png' },
  { name: 'X', href: 'https://x.com/TogetherKCMO', icon: '/images/social/x.png' },
  { name: 'Instagram', href: 'https://www.instagram.com/togetherkcmo/', icon: '/images/social/instagram.png' },
  { name: 'Threads', href: 'https://www.threads.com/@togetherkcmo', icon: '/images/social/threads.png' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@togetherkcmo', icon: '/images/social/tiktok.png' },
];

// The won April 2026 e-tax campaign lives on under /etax; this is its home in
// the footer, so the August pages stay focused on the five questions.
const ETAX_LINKS = [
  { label: 'Victory', href: '/etax/victory' },
  { label: 'Home', href: '/etax' },
  { label: 'FAQs', href: '/etax/faqs' },
  { label: 'Endorsements', href: '/etax/endorsements' },
  { label: 'Donate', href: '/etax/donate' },
];

export default function Footer() {
  const pathname = usePathname();
  const isVotePage = pathname === '/vote' || pathname.startsWith('/vote?');

  return (
    <footer className={`${isVotePage ? 'bg-transparent' : 'bg-navy'} relative -mt-px`}>
      {/* Centered Footer Image - sits on the border line */}
      <div className="flex justify-center px-4">
        <div className="-mt-12 relative z-10">
          <Image
            src="/images/together-kc-footer.png"
            alt="Together KC"
            width={300}
            height={90}
            className="max-w-[175px] sm:max-w-[215px] md:max-w-[250px] h-auto w-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* E-tax archive (left) + social links (right) */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
          <nav aria-label="Kansas City Earnings Tax campaign" className="text-center sm:text-left">
            <p className="text-white/80 text-xs font-semibold uppercase tracking-[0.18em]">
              Kansas City Earnings Tax
            </p>
            <div className="mt-2 h-px w-full bg-gradient-to-r from-coral via-golden to-sky opacity-80" />
            <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1.5 sm:justify-start">
              {ETAX_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex gap-5">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-70 hover:opacity-100 transition-opacity"
                aria-label={`Follow us on ${social.name}`}
              >
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom disclaimer - centered */}
      <div className="px-4 sm:px-6 lg:px-8 pb-4 pt-3">
        <div className="max-w-5xl mx-auto border-t border-white/10 pt-3">
          <p className="text-white/60 text-xs text-center leading-tight">
            <span className="whitespace-nowrap">Paid for by Together KC, Dan Kopp, Treasurer.</span>
            <br />
            Not authorized by any candidate or candidate committee.
          </p>
        </div>
      </div>
    </footer>
  );
}
