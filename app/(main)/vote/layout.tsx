import AugustNav from '@/components/august/AugustNav';

// The /vote polling tool is part of the August 2026 front door, not the live
// e-tax site. This layout swaps in the August nav (the e-tax Navigation and
// YardSignBanner mounted by the (main) layout return null on /vote). AugustNav
// is the client piece; this wrapper stays a thin server component. AugustNav is
// fixed-position and transparent over the dark hero, turning solid on scroll;
// the vote page content (SmartBanner) already pads the top to clear it.
export default function VoteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AugustNav />
      {children}
    </>
  );
}
