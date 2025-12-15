import { useEffect, useRef, useState } from 'react';

interface UseTurnTimerOptions {
  duration: number; // seconds
  onTimeout: () => void;
  enabled: boolean;
}

export function useTurnTimer({ duration, onTimeout, enabled }: UseTurnTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      setTimeRemaining(duration);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setTimeRemaining(duration);

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [duration, enabled, onTimeout]);

  return { timeRemaining };
}
