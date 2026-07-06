import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// AugustFooter: the PAPER TRAIL footer for the August 2026 ballot pages.
// Replaces the skyline logo lockup in components/layout/Footer.tsx, which
// stays untouched for the /etax archive: the spec's graphic vocabulary bans
// skyline, cityscape, and building illustrations everywhere on the August
// pages, so the footer stands on the text-only boxed TOGETHER KC wordmark.
// Static and animation-free on purpose; it must print with or without JS.

const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com/TogetherKC/', icon: '/images/social/facebook.png' },
  { name: 'X', href: 'https://x.com/TogetherKCMO', icon: '/images/social/x.png' },
  { name: 'Instagram', href: 'https://www.instagram.com/togetherkcmo/', icon: '/images/social/instagram.png' },
  { name: 'Threads', href: 'https://www.threads.com/@togetherkcmo', icon: '/images/social/threads.png' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@togetherkcmo', icon: '/images/social/tiktok.png' },
];

export function AugustFooter({ className }: { className?: string }) {
  return (
    <footer className={cn('bg-navy px-4 pb-6 pt-12 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        {/* Text-only boxed wordmark. NO skyline art anywhere on these pages. */}
        <Link
          href="/"
          aria-label="Together KC home"
          className="inline-block border-2 border-paper px-5 py-2.5 transition-colors hover:border-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
        >
          {/* -mr compensates the tracking after the final glyph so the box reads centered. */}
          <span className="-mr-[0.28em] block whitespace-nowrap text-lg font-black uppercase leading-none tracking-[0.28em] text-paper sm:text-xl">
            Together&nbsp;KC
          </span>
        </Link>

        {/* Social links */}
        <div className="mt-6 flex flex-wrap justify-center gap-5">
          {SOCIAL_LINKS.map((social) => (
            <Link
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
              aria-label={`Follow us on ${social.name}`}
            >
              <Image
                src={social.icon}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 max-w-full object-contain"
              />
            </Link>
          ))}
        </div>

        {/* Disclaimer: must wrap freely so it can never widen the page. */}
        <p className="mt-5 max-w-full text-center text-xs leading-relaxed text-paper/70">
          Paid for by Together KC, Dan Kopp, Treasurer.
          <br />
          Not authorized by any candidate or candidate committee.
        </p>
      </div>
    </footer>
  );
}

export default AugustFooter;
