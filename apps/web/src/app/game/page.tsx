'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { GameScreen } from '../../components/GameScreen';
import { useTutorialStore } from '@/store/tutorialStore';

export default function GamePage() {
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
