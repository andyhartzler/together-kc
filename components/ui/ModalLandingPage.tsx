'use client';

import { useRouter } from 'next/navigation';
import { VoteYesModal } from '@/components/ui/VoteYesModal';

type ModalView = 'main' | 'findPolling' | 'countyResult' | 'endorse' | 'yardSign' | 'yardSignSuccess';

export default function ModalLandingPage({ view }: { view: ModalView }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy/95 to-sky/80">
      <VoteYesModal
        isOpen={true}
        onClose={() => router.push('/etax')}
        initialView={view}
      />
    </div>
  );
}
