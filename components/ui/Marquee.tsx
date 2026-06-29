'use client';

export interface MarqueeProps {
  items: readonly string[];
  className?: string;
}

// Coral marquee band. Duplicated track behind animate-marquee with a
// motion-reduce guard. Shared so the hub band and any detail reuse stay in sync.
export function Marquee({ items, className }: MarqueeProps) {
  return (
    <div className={`relative flex overflow-hidden ${className ?? ''}`}>
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((dup) => (
          <div
            key={dup}
            className="flex shrink-0 items-center"
            aria-hidden={dup === 1 ? true : undefined}
          >
            {items.map((t, i) => (
              <div key={i} className="flex items-center">
                <span className="text-base sm:text-xl font-extrabold uppercase tracking-tight whitespace-nowrap">
                  {t}
                </span>
                <svg
                  className="mx-5 sm:mx-7 w-3.5 h-3.5 shrink-0 opacity-70"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.8 5 21.4l1.4-6.8L1.3 9.9l6.9-.8z" />
                </svg>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
