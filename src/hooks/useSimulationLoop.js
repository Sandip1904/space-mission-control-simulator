// Custom React hook managing the single centralized telemetry simulation timer
import { useEffect } from 'react';
import { useMissionStore } from '../store/missionStore';
import { useSettingsStore } from '../store/settingsStore';

export function useSimulationLoop() {
  const tickSimulation = useMissionStore((s) => s.tickSimulation);
  const missionStatus = useMissionStore((s) => s.missionStatus);
  const refreshMs = useSettingsStore((s) => s.telemetryRefreshMs);

  useEffect(() => {
    if (missionStatus === 'PAUSED' || missionStatus === 'ABORTED') {
      return undefined;
    }
    const intervalId = window.setInterval(() => {
      tickSimulation();
    }, Math.max(250, Number(refreshMs) || 1000));

    return () => {
      window.clearInterval(intervalId);
    };
  }, [tickSimulation, missionStatus, refreshMs]);
}
