'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { markVisited, hasVisitedBefore, shouldShowTutorial } from '@/lib/onboarding';

export default function LandingPage() {
  const router = useRouter();
  const isReturningUser = hasVisitedBefore();

  useEffect(() => {
    markVisited();
  }, []);

  const handleStartTutorial = () => {
    router.push('/game?tutorial=true');
  };

  const handlePlayNow = () => {
    router.push('/game');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
      </div>

      {/* Main content */}
      <Card className="relative z-10 max-w-2xl w-full bg-slate-900/90 border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
        <CardContent className="p-8 md:p-12 space-y-8">
          {/* Hero section */}
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4 animate-pulse">🌱</div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Entropy Garden
            </h1>
            <p className="text-xl text-emerald-300 font-medium">
              Strategic Evolution • Cellular Conquest
            </p>
          </div>

          {/* Description */}
          <div className="space-y-4 text-slate-300">
            <p className="text-lg leading-relaxed">
              Command organisms in a strategic battle of evolution. Seed species, manipulate the environment, 
              and outmaneuver your opponent in this turn-based cellular strategy game.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 py-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-emerald-500/20">
                <div className="text-3xl mb-2">🌱</div>
                <p className="text-sm font-semibold text-emerald-400">Plant & Grow</p>
                <p className="text-xs text-slate-400 mt-1">Seed organisms strategically</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-emerald-500/20">
                <div className="text-3xl mb-2">🌍</div>
                <p className="text-sm font-semibold text-emerald-400">Shape Environment</p>
                <p className="text-xs text-slate-400 mt-1">Control nutrients & moisture</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-emerald-500/20">
                <div className="text-3xl mb-2">🧬</div>
                <p className="text-sm font-semibold text-emerald-400">Evolve & Adapt</p>
                <p className="text-xs text-slate-400 mt-1">Mutate for advantage</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {shouldShowTutorial() && !isReturningUser ? (
              <>
                <Button
                  onClick={handleStartTutorial}
                  size="lg"
                  className="flex-1 h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30"
                >
                  🎓 Start Tutorial
                </Button>
                <Button
                  onClick={handlePlayNow}
                  size="lg"
                  variant="outline"
                  className="flex-1 h-14 text-lg border-emerald-500/50 hover:bg-emerald-500/10"
                >
                  🎮 Skip to Game
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handlePlayNow}
                  size="lg"
                  className="flex-1 h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/30"
                >
                  {isReturningUser ? '🎮 Continue Playing' : '🎮 Play Now'}
                </Button>
                {isReturningUser && (
                  <Button
                    onClick={handleStartTutorial}
                    size="lg"
                    variant="outline"
                    className="flex-1 h-14 text-lg border-emerald-500/50 hover:bg-emerald-500/10"
                  >
                    🎓 Replay Tutorial
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Footer hint */}
          <p className="text-center text-xs text-slate-500 pt-4">
            {isReturningUser ? 'Welcome back!' : 'New to the game? We recommend starting with the tutorial.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
