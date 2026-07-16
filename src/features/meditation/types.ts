export type BreathPhaseLabel = 'Breathe in' | 'Hold' | 'Breathe out' | 'Hold';

export interface BreathPhase {
  label: BreathPhaseLabel;
  durationMs: number;
  targetScale: number;
}

export interface MeditationDurationOption {
  minutes: number;
  label: string;
}
