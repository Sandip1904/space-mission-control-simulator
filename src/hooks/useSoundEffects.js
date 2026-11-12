// Synthesized Web Audio API aerospace telemetry feedback (no external audio files required)
import { useCallback } from 'react';
import { useSettingsStore } from '../store/settingsStore';

export function useSoundEffects() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  const playTone = useCallback(
    (type = 'click') => {
      if (!soundEnabled) return;
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        if (type === 'emergency') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(620, now);
          osc.frequency.linearRampToValueAtTime(880, now + 0.18);
          osc.frequency.linearRampToValueAtTime(540, now + 0.35);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
          osc.start(now);
          osc.stop(now + 0.38);
        } else if (type === 'recovery') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(980, now);
          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.06);
        }
      } catch {
        // Ignore audio policy restrictions before user gesture
      }
    },
    [soundEnabled]
  );

  return { playTone };
}
