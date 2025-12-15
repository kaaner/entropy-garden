'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { GameScreen } from '../../components/GameScreen';
import { useTutorialStore } from '@/store/tutorialStore';

function GamePageContent() {
  const searchParams = useSearchParams();
  const { startTutorial, active } = useTutorialStore();

  useEffect(() => {
    // Check for tutorial query param
    const tutorialParam = searchParams.get('tutorial');
    
    if (tutorialParam === 'true' && !active) {
      // Start tutorial if not already active
      startTutorial();
    }
  }, [searchParams, startTutorial, active]);

  return <GameScreen />;
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <GamePageContent />
    </Suspense>
  );
}
