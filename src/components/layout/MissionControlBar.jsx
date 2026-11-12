import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  OctagonAlert,
  ShieldCheck,
  Gauge,
  Flame,
  Eye,
} from 'lucide-react';
import { useMissionStore } from '../../store/missionStore';
import { useSoundEffects } from '../../hooks/useSoundEffects';

const SPEED_OPTIONS = [0.5, 1, 2, 5, 10, 20];

export function MissionControlBar({ onOpenSimulation }) {
  const missionStatus = useMissionStore((s) => s.missionStatus);
  const simSpeed = useMissionStore((s) => s.simSpeed);
  const autoMonitoring = useMissionStore((s) => s.autoMonitoring);
  const activeEmergency = useMissionStore((s) => s.activeEmergency);
  const recoveryInProgress = useMissionStore((s) => s.recoveryInProgress);
  const recoveryProgress = useMissionStore((s) => s.recoveryProgress);

  const startMission = useMissionStore((s) => s.startMission);
  const pauseMission = useMissionStore((s) => s.pauseMission);
  const resumeMission = useMissionStore((s) => s.resumeMission);
  const abortSimulation = useMissionStore((s) => s.abortSimulation);
  const resetMission = useMissionStore((s) => s.resetMission);
  const setSimSpeed = useMissionStore((s) => s.setSimSpeed);
  const toggleAutoMonitoring = useMissionStore((s) => s.toggleAutoMonitoring);
  const triggerScenario = useMissionStore((s) => s.triggerScenario);
  const executeRecovery = useMissionStore((s) => s.executeRecovery);
  const restoreNormalConditions = useMissionStore((s) => s.restoreNormalConditions);

  const { playTone } = useSoundEffects();

  return (
    <div className="mission-panel rounded-lg p-2.5 mb-4 border border-sky-500/25 flex flex-wrap items-center justify-between gap-2">
      {/* Left: Start / Pause / Resume / Reset / Abort */}
      <div className="flex flex-wrap items-center gap-1.5">
        {missionStatus === 'PAUSED' || missionStatus === 'ABORTED' ? (
          <button
            type="button"
            onClick={() => {
              playTone('click');
              resumeMission();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 transition-colors"
          >
            <Play className="w-3.5 h-3.5" /> Resume Mission
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              playTone('click');
              pauseMission();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30 transition-colors"
          >
            <Pause className="w-3.5 h-3.5" /> Pause Mission
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            playTone('click');
            startMission();
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 transition-colors"
        >
          <Play className="w-3.5 h-3.5" /> Start
        </button>

        <button
          type="button"
          onClick={() => {
            playTone('click');
            resetMission();
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-400/40 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Mission
        </button>

        <button
          type="button"
          onClick={() => {
            playTone('emergency');
            abortSimulation();
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono bg-red-500/15 text-red-300 border border-red-500/40 hover:bg-red-500/25 transition-colors"
        >
          <OctagonAlert className="w-3.5 h-3.5" /> Abort Sim
        </button>
      </div>

      {/* Center: Simulation Speed & Auto Monitoring */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-1 rounded border border-slate-800">
          <Gauge className="w-3.5 h-3.5 text-cyan-400 mr-1" />
          <span className="text-[10px] font-mono text-slate-400 mr-1">SPEED:</span>
          {SPEED_OPTIONS.map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => {
                playTone('click');
                setSimSpeed(spd);
              }}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors ${
                simSpeed === spd
                  ? 'bg-cyan-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            playTone('click');
            toggleAutoMonitoring();
          }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono border transition-colors ${
            autoMonitoring
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-700'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Auto-Monitor: {autoMonitoring ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Right: Emergency Trigger & Restore */}
      <div className="flex flex-wrap items-center gap-1.5">
        {activeEmergency ? (
          <>
            <button
              type="button"
              onClick={() => {
                playTone('recovery');
                executeRecovery();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {recoveryInProgress ? `Recovering (${recoveryProgress}%)` : 'Execute Recovery'}
            </button>
            <button
              type="button"
              onClick={() => {
                playTone('recovery');
                restoreNormalConditions();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30 transition-colors"
            >
              Restore Nominal
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              playTone('emergency');
              triggerScenario('SCEN-01');
              if (onOpenSimulation) onOpenSimulation();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30 transition-colors"
          >
            <Flame className="w-3.5 h-3.5" /> Trigger Emergency
          </button>
        )}
      </div>
    </div>
  );
}
