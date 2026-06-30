import Image from 'next/image';

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-navy flex flex-col items-center justify-center">
      <Image
        src="/images/together-kc-footer.png"
        alt="Together KC"
        width={300}
        height={90}
        className="h-14 w-auto mb-6 animate-pulse"
        priority
      />
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}
