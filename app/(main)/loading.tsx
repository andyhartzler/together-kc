import Image from 'next/image';

export default function Loading() {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center">
      <Image
        src="/images/renew-kc-logo-white.png"
        alt="Together KC"
        width={200}
        height={67}
        className="h-14 w-auto mb-6 animate-pulse"
        priority
      />
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}
