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
            alt="Together KC - Vote YES to renew the earnings tax"
            width={300}
            height={90}
            className="max-w-[175px] sm:max-w-[215px] md:max-w-[250px] h-auto w-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* Find Your Polling Place Link */}
      <div className="flex justify-center pt-4">
        <Link
          href="/vote"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Find Your Polling Place
        </Link>
      </div>

      {/* Social Links */}
      <div className="flex justify-center gap-5 pt-4 pb-2">
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

      {/* Bottom disclaimer - centered */}
      <div className="px-4 sm:px-6 lg:px-8 pb-4 pt-2">
        <p className="text-white/60 text-xs text-center leading-tight">
          <span className="whitespace-nowrap">Paid for by Together KC, Dan Kopp, Treasurer.</span>
          <br />
          Not authorized by any candidate or candidate committee.
        </p>
      </div>
    </footer>
  );
}
