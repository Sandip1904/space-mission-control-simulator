import React from 'react';
import { Wifi, Server, Clock, ShieldCheck, Activity } from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';

export function BottomStatusBar() {
  const missionStatus = useMissionStore((s) => s.missionStatus);
  const simSpeed = useMissionStore((s) => s.simSpeed);
  const comms = useMissionStore((s) => s.telemetry.comms);
  const lastTelemetryUpdateUtc = useMissionStore((s) => s.lastTelemetryUpdateUtc);
  const autoMonitoring = useMissionStore((s) => s.autoMonitoring);

  return (
    <footer className="sticky bottom-0 z-40 h-8 px-3 lg:px-5 bg-[#040915]/95 border-t border-sky-500/25 flex items-center justify-between text-[11px] font-mono text-slate-400 overflow-x-auto">
      <div className="flex items-center gap-4 shrink-0">
        <span className="flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span>GROUND STATION:</span>
          <strong className="text-slate-200">{comms.antennaStatus}</strong>
        </span>

        <span className="hidden sm:flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-cyan-400" />
          <span>DOWNLINK:</span>
          <strong className="text-cyan-300">{comms.downSpeedMbps.toFixed(1)} Mbps</strong>
          <span>({comms.latencyMs} ms)</span>
        </span>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="hidden md:flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>AUTO-MONITOR:</span>
          <strong className={autoMonitoring ? 'text-emerald-300' : 'text-amber-300'}>
            {autoMonitoring ? 'ENABLED' : 'MANUAL'}
          </strong>
        </span>

        <span className="hidden lg:flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>LAST FRAME:</span>
          <strong className="text-slate-200">{lastTelemetryUpdateUtc}</strong>
        </span>

        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>SIM STATE:</span>
          <strong
            className={
              missionStatus === 'EMERGENCY'
                ? 'text-red-400'
                : missionStatus === 'PAUSED'
                ? 'text-amber-300'
                : 'text-emerald-300'
            }
          >
            {missionStatus} ({simSpeed}x)
          </strong>
        </span>
      </div>
    </footer>
  );
}
