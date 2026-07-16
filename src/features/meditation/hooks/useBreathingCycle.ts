import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { BREATH_CYCLE, BREATH_CYCLE_TOTAL_MS } from '../constants';
import { BreathPhase } from '../types';

/**
 * Drives the breathing orb from a single JS ticker rather than two
 * separately-looped animations, so the phase label text and the orb's
 * scale never drift apart. Ticks at ~10fps, which is plenty smooth for
 * a slow multi-second breathing motion and cheap enough to run for a
 * full session.
 */
export function useBreathingCycle(active: boolean) {
  const [phase, setPhase] = useState<BreathPhase>(BREATH_CYCLE[0]);
  const [phaseProgress, setPhaseProgress] = useState(0); // 0-1 within current phase
  const scale = useRef(new Animated.Value(BREATH_CYCLE[0].targetScale * 0.9)).current;
  const glow = useRef(new Animated.Value(0.5)).current;

  const startedAtRef = useRef<number | null>(null);
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      if (rafRef.current) clearInterval(rafRef.current);
      startedAtRef.current = null;
      return;
    }

    startedAtRef.current = Date.now();

    rafRef.current = setInterval(() => {
      const elapsed = (Date.now() - (startedAtRef.current ?? Date.now())) % BREATH_CYCLE_TOTAL_MS;

      let acc = 0;
      let current = BREATH_CYCLE[0];
      let prevScale = BREATH_CYCLE[BREATH_CYCLE.length - 1].targetScale;
      let localProgress = 0;

      for (let i = 0; i < BREATH_CYCLE.length; i++) {
        const p = BREATH_CYCLE[i];
        if (elapsed < acc + p.durationMs) {
          current = p;
          localProgress = (elapsed - acc) / p.durationMs;
          prevScale = i === 0 ? BREATH_CYCLE[BREATH_CYCLE.length - 1].targetScale : BREATH_CYCLE[i - 1].targetScale;
          break;
        }
        acc += p.durationMs;
      }

      const eased = 1 - Math.pow(1 - localProgress, 2); // ease-out, gentler than linear
      const currentScale = prevScale + (current.targetScale - prevScale) * eased;

      scale.setValue(currentScale);
      glow.setValue(0.5 + eased * 0.4);
      setPhase(current);
      setPhaseProgress(localProgress);
    }, 100);

    return () => {
      if (rafRef.current) clearInterval(rafRef.current);
    };
  }, [active]);

  return { phase, phaseProgress, scale, glow };
}
