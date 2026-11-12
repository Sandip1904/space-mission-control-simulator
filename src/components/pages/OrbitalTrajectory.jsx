import React from 'react';
import {
  Orbit,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Minus,
  Grid,
  Eye,
  Video,
} from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';
import { computeOrbitalMetrics } from '../../services/orbitalService';
import { OrbitalTrajectoryCanvas } from '../spacecraft/OrbitalTrajectoryCanvas';
import { PanelHeader } from '../common/PanelHeader';

export function OrbitalTrajectory() {
  const orbitalParams = useMissionStore((s) => s.orbitalParams);
  const updateOrbitalParam = useMissionStore((s) => s.updateOrbitalParam);
  const resetOrbitalParams = useMissionStore((s) => s.resetOrbitalParams);
  const missionStatus = useMissionStore((s) => s.missionStatus);
  const startMission = useMissionStore((s) => s.startMission);
  const pauseMission = useMissionStore((s) => s.pauseMission);
  const resumeMission = useMissionStore((s) => s.resumeMission);
  const simSpeed = useMissionStore((s) => s.simSpeed);
  const setSimSpeed = useMissionStore((s) => s.setSimSpeed);

  const metrics = computeOrbitalMetrics(orbitalParams);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: 3D Orbital Trajectory Visualizer + Simulation Toolbar */}
        <div className="xl:col-span-8 space-y-4">
          <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
            <PanelHeader
              title="3D Orbital Trajectory & Maneuver Propagator"
              subtitle="Interactive Earth-centered & Moon-centered Keplerian trajectory sandbox"
              icon={Orbit}
              rightContent={
                <div className="flex flex-wrap items-center gap-1.5">
                  {missionStatus === 'PAUSED' ? (
                    <button
                      type="button"
                      onClick={resumeMission}
                      className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" /> Resume
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={pauseMission}
                      className="px-2.5 py-1 rounded text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1"
                    >
                      <Pause className="w-3.5 h-3.5" /> Pause
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={startMission}
                    className="px-2.5 py-1 rounded text-xs font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                  >
                    Start
                  </button>

                  <button
                    type="button"
                    onClick={() => setSimSpeed(Math.max(0.5, simSpeed / 2))}
                    className="p-1.5 rounded bg-slate-900 text-slate-300 border border-slate-700 hover:border-cyan-400"
                    title="Decrease Simulation Speed"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-mono text-cyan-300 px-1">{simSpeed}x</span>
                  <button
                    type="button"
                    onClick={() => setSimSpeed(Math.min(20, simSpeed * 2))}
                    className="p-1.5 rounded bg-slate-900 text-slate-300 border border-slate-700 hover:border-cyan-400"
                    title="Increase Simulation Speed"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={resetOrbitalParams}
                    className="px-2.5 py-1 rounded text-xs font-mono bg-slate-800 text-slate-200 border border-slate-700 inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Orbit
                  </button>
                </div>
              }
            />

            <OrbitalTrajectoryCanvas />

            {/* Camera Angle & Overlay Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 mr-1">
                  <Video className="w-3.5 h-3.5 text-cyan-400" /> CAMERA ANGLE:
                </span>
                {['FREE', 'TOP', 'SIDE', 'FOLLOW'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => updateOrbitalParam('cameraMode', mode)}
                    className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border ${
                      orbitalParams.cameraMode === mode
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-900 text-slate-300 border-slate-800'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateOrbitalParam('showGrid', !orbitalParams.showGrid)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono border ${
                    orbitalParams.showGrid
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" /> Grid: {orbitalParams.showGrid ? 'ON' : 'OFF'}
                </button>

                <button
                  type="button"
                  onClick={() => updateOrbitalParam('showPredictedPath', !orbitalParams.showPredictedPath)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono border ${
                    orbitalParams.showPredictedPath
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Trajectory: {orbitalParams.showPredictedPath ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Orbital Parameter Sliders & Computed Ephemeris */}
        <div className="xl:col-span-4 space-y-4">
          <div className="mission-panel rounded-lg p-4 border border-sky-500/25 space-y-4">
            <PanelHeader
              title="Orbital Elements & Burn Controls"
              subtitle="Modify Keplerian parameters in real time"
              icon={Orbit}
            />

            {/* Reference Body Toggle */}
            <div>
              <label className="text-[11px] font-mono uppercase text-slate-400 block mb-1.5">
                Central Gravity Body Reference Frame
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['EARTH', 'MOON'].map((body) => (
                  <button
                    key={body}
                    type="button"
                    onClick={() => updateOrbitalParam('centralBody', body)}
                    className={`py-2 rounded text-xs font-mono font-bold border transition-colors ${
                      orbitalParams.centralBody === body
                        ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {body}-CENTERED ORBIT
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3 text-xs font-mono">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">SEMI-MAJOR AXIS (a)</span>
                  <strong className="text-cyan-300">{orbitalParams.semiMajorAxisKm.toLocaleString()} km</strong>
                </div>
                <input
                  type="range"
                  min="12000"
                  max="85000"
                  step="500"
                  value={orbitalParams.semiMajorAxisKm}
                  onChange={(e) => updateOrbitalParam('semiMajorAxisKm', Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">ORBITAL ECCENTRICITY (e)</span>
                  <strong className="text-cyan-300">{orbitalParams.eccentricity.toFixed(2)}</strong>
                </div>
                <input
                  type="range"
                  min="0.00"
                  max="0.75"
                  step="0.01"
                  value={orbitalParams.eccentricity}
                  onChange={(e) => updateOrbitalParam('eccentricity', Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">INCLINATION (i)</span>
                  <strong className="text-cyan-300">{orbitalParams.inclinationDeg.toFixed(1)}°</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="0.5"
                  value={orbitalParams.inclinationDeg}
                  onChange={(e) => updateOrbitalParam('inclinationDeg', Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">ARGUMENT OF PERIGEE (ω)</span>
                  <strong className="text-cyan-300">{orbitalParams.argPerigeeDeg.toFixed(0)}°</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={orbitalParams.argPerigeeDeg}
                  onChange={(e) => updateOrbitalParam('argPerigeeDeg', Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-amber-300">PREDICTED MANEUVER ΔV BURN</span>
                  <strong className="text-amber-300">
                    {orbitalParams.burnDeltaVMps >= 0 ? '+' : ''}
                    {orbitalParams.burnDeltaVMps} m/s
                  </strong>
                </div>
                <input
                  type="range"
                  min="-800"
                  max="1200"
                  step="25"
                  value={orbitalParams.burnDeltaVMps}
                  onChange={(e) => updateOrbitalParam('burnDeltaVMps', Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>
            </div>

            {/* Computed Orbital Metrics Readout */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">CLOSEST APPROACH (PERIAPSIS)</span>
                <strong className="text-emerald-300 text-sm">
                  {Math.round(metrics.closestApproachAltitudeKm).toLocaleString()} km
                </strong>
              </div>
              <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">APOAPSIS ALTITUDE</span>
                <strong className="text-cyan-300 text-sm">
                  {Math.round(metrics.apoapsisAltitudeKm).toLocaleString()} km
                </strong>
              </div>
              <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">PERIAPSIS VELOCITY</span>
                <strong className="text-slate-100 text-sm">{metrics.vPeriapsisKms.toFixed(2)} km/s</strong>
              </div>
              <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">ORBITAL PERIOD</span>
                <strong className="text-slate-100 text-sm">{metrics.periodHours.toFixed(2)} hrs</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
