import React from 'react';
import { Radar, Lock, Unlock, Compass, Gauge, Radio, Orbit } from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';
import { StatusBadge } from '../common/StatusBadge';

export function SatelliteDetailPanel() {
  const satellites = useMissionStore((s) => s.satellites);
  const selectedSatelliteId = useMissionStore((s) => s.selectedSatelliteId);
  const trackingCameraLocked = useMissionStore((s) => s.trackingCameraLocked);
  const setTrackingCameraLocked = useMissionStore((s) => s.setTrackingCameraLocked);

  const sat = satellites.find((s) => s.id === selectedSatelliteId) || satellites[0];

  return (
    <div className="mission-panel rounded-lg p-4 border border-sky-500/25 space-y-3.5">
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-sky-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
            <Radar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-mono font-bold text-white">{sat.name}</h3>
              <StatusBadge status={sat.status} size="xs" />
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              NORAD: {sat.noradId} • {sat.category} ({sat.regime})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setTrackingCameraLocked(!trackingCameraLocked)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono font-semibold border transition-colors ${
            trackingCameraLocked
              ? 'bg-cyan-500 text-slate-950 border-cyan-400'
              : 'bg-slate-900 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/15'
          }`}
        >
          {trackingCameraLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          {trackingCameraLocked ? 'Camera Locked' : 'Lock Camera'}
        </button>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed">{sat.missionRole}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Orbit className="w-3 h-3 text-cyan-400" /> ORBITAL ALTITUDE
          </div>
          <div className="text-cyan-300 font-bold mt-0.5">{sat.altitudeKm.toLocaleString()} km</div>
        </div>

        <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Gauge className="w-3 h-3 text-cyan-400" /> ORBITAL VELOCITY
          </div>
          <div className="text-slate-100 font-bold mt-0.5">{sat.velocityKms.toFixed(2)} km/s</div>
        </div>

        <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-400">INCLINATION / PERIOD</div>
          <div className="text-slate-100 font-bold mt-0.5">
            {sat.inclinationDeg}° • {sat.periodMin} min
          </div>
        </div>

        <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400" /> SUB-SAT COORDINATES
          </div>
          <div className="text-emerald-300 font-bold mt-0.5">
            {sat.lat.toFixed(2)}°, {sat.lon.toFixed(2)}°
          </div>
        </div>

        <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Radio className="w-3 h-3 text-cyan-400" /> SIGNAL STRENGTH
          </div>
          <div className="text-cyan-300 font-bold mt-0.5">
            {sat.signalDbm} dBm ({sat.signalQualityPct}%)
          </div>
        </div>

        <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
          <div className="text-[10px] text-slate-400">TRACKING STATUS</div>
          <div className="text-slate-100 font-bold mt-0.5">
            {trackingCameraLocked ? 'ACTIVE LOCK' : 'PASSIVE SWEEP'}
          </div>
        </div>
      </div>
    </div>
  );
}
