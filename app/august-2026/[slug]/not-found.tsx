import Link from 'next/link';
import Footer from '@/components/layout/Footer';

// Branded 404 for an unknown /august-2026/<slug>. Sends people back to the hub
// where all five real measures live.
export default function MeasureNotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy via-navy to-[#16314f] px-4 py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-coral/20 rounded-full blur-3xl animate-drift motion-reduce:animate-none" />
          <div className="absolute -bottom-1/4 right-0 w-1/2 h-2/3 bg-sky/20 rounded-full blur-3xl animate-drift motion-reduce:animate-none" style={{ animationDelay: '-9s' }} />
        </div>
        <div className="noise-overlay absolute inset-0 z-[1]" />

        <div className="relative z-10 text-center max-w-xl mx-auto">
          <p className="text-[0.7rem] sm:text-xs uppercase tracking-widest font-semibold text-coral mb-5">
            August 4, 2026 Kansas City Ballot
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-[1.02]">
            We could not find that measure.
          </h1>
          <p className="text-white/70 text-base sm:text-lg mt-5 leading-relaxed">
            There are five questions on the August ballot. Head back to see all of them, then vote
            YES on all five.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/august-2026"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-coral text-white font-semibold px-6 py-3 text-base hover:bg-coral/85 transition-colors"
            >
              See all five questions
            </Link>
            <Link
              href="/vote"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border-2 border-white/80 text-white font-semibold px-6 py-3 text-base hover:bg-white hover:text-navy transition-colors"
            >
              How to vote
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
