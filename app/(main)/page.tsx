import Hero from '@/components/sections/Hero';
import KeyMessage from '@/components/sections/KeyMessage';
import Services from '@/components/sections/Services';
import EndorsersPreview from '@/components/sections/EndorsersPreview';
import CallToAction from '@/components/sections/CallToAction';

export default function Home() {
  return (
    <>
      <Hero />
      <KeyMessage />
      <Services />
      <EndorsersPreview />
      <CallToAction />
    </>
  );
}
