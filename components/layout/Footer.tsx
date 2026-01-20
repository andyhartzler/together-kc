'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-navy relative">
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
