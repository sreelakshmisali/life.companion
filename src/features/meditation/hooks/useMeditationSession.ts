import { useEffect, useRef, useState } from 'react';
import { DEFAULT_MEDITATION_MINUTES } from '../constants';

export type SessionStatus = 'setup' | 'running' | 'paused' | 'complete';

export function useMeditationSession() {
  const [minutes, setMinutes] = useState(DEFAULT_MEDITATION_MINUTES);
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_MEDITATION_MINUTES * 60);
  const [status, setStatus] = useState<SessionStatus>('setup');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status !== 'running') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((s) => {
        if (s <= 1) {
          setStatus('complete');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  const selectMinutes = (m: number) => {
    if (status === 'running') return;
    setMinutes(m);
    setRemainingSeconds(m * 60);
    setStatus('setup');
  };

  const start = () => setStatus('running');
  const pause = () => setStatus('paused');
  const resume = () => setStatus('running');
  const reset = () => {
    setStatus('setup');
    setRemainingSeconds(minutes * 60);
  };

  const totalSeconds = minutes * 60;
  const elapsedSeconds = totalSeconds - remainingSeconds;
  const progress = totalSeconds > 0 ? elapsedSeconds / totalSeconds : 0;

  return {
    minutes,
    remainingSeconds,
    status,
    progress,
    selectMinutes,
    start,
    pause,
    resume,
    reset,
    isActive: status === 'running',
  };
}
