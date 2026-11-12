import React from 'react';
import {
  Flame,
  Play,
  Pause,
  ShieldCheck,
  RotateCcw,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Activity,
} from 'lucide-react';
import { FAILURE_SCENARIOS } from '../../data/failureScenarios';
import { useMissionStore } from '../../store/missionStore';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { PanelHeader } from '../common/PanelHeader';
import { StatusBadge } from '../common/StatusBadge';

export function MissionSimulation() {
  const selectedScenarioId = useMissionStore((s) => s.selectedScenarioId);
  const setSelectedScenarioId = useMissionStore((s) => s.setSelectedScenarioId);
  const activeEmergency = useMissionStore((s) => s.activeEmergency);
  const emergencyPaused = useMissionStore((s) => s.emergencyPaused);
  const recoveryInProgress = useMissionStore((s) => s.recoveryInProgress);
  const recoveryProgress = useMissionStore((s) => s.recoveryProgress);

  const triggerScenario = useMissionStore((s) => s.triggerScenario);
  const pauseEmergency = useMissionStore((s) => s.pauseEmergency);
  const executeRecovery = useMissionStore((s) => s.executeRecovery);
  const restoreNormalConditions = useMissionStore((s) => s.restoreNormalConditions);

  const { playTone } = useSoundEffects();

  const scenario =
    FAILURE_SCENARIOS.find((s) => s.id === selectedScenarioId) || FAILURE_SCENARIOS[0];

  const isThisScenarioActive = activeEmergency && activeEmergency.id === scenario.id;

  return (
    <div className="space-y-4">
      {/* Top Emergency Status Banner */}
      <div
        className={`mission-panel rounded-lg p-4 border flex flex-wrap items-center justify-between gap-4 ${
          activeEmergency
            ? 'border-red-500/70 bg-red-950/30'
            : 'border-sky-500/25'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-lg border ${
              activeEmergency
                ? 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse'
                : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
            }`}
          >
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-mono font-bold uppercase text-white">
                Mission Failure & Emergency Recovery Simulator
              </h2>
              <StatusBadge
                status={
                  activeEmergency
                    ? recoveryInProgress
                      ? `RECOVERING (${recoveryProgress}%)`
                      : `ACTIVE: ${activeEmergency.name}`
                    : 'STANDBY // NOMINAL'
                }
              />
            </div>
            <p className="text-[11px] font-mono text-slate-400">
               Reversible fault-injection testbed — triggers live telemetry anomalies, alerts, and automated recovery procedures
            </p>
          </div>
        </div>

        {/* 4 Required Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playTone('emergency');
              triggerScenario(scenario.id);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold bg-red-500 text-white hover:bg-red-400 transition-colors"
          >
            <Play className="w-3.5 h-3.5" /> Trigger Scenario
          </button>

          <button
            type="button"
            onClick={() => {
              playTone('click');
              pauseEmergency();
            }}
            disabled={!activeEmergency}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold border transition-colors ${
              activeEmergency
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
          >
            <Pause className="w-3.5 h-3.5" />
            {emergencyPaused ? 'Resume Emergency' : 'Pause Emergency'}
          </button>

          <button
            type="button"
            onClick={() => {
              playTone('recovery');
              executeRecovery();
            }}
            disabled={!activeEmergency}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold border transition-colors ${
              activeEmergency
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400'
                : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Execute Recovery
          </button>

          <button
            type="button"
            onClick={() => {
              playTone('recovery');
              restoreNormalConditions();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-400/50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Scenario
          </button>
        </div>
      </div>

      {/* Recovery Progress Bar when Recovery is Active */}
      {recoveryInProgress && (
        <div className="mission-panel rounded-lg p-3.5 border border-emerald-500/50 bg-emerald-950/20">
          <div className="flex items-center justify-between text-xs font-mono mb-1.5">
            <span className="text-emerald-300 font-bold">
              AUTOMATED FAULT ISOLATION & SUBSYSTEM RECOVERY IN PROGRESS...
            </span>
            <span className="text-white font-bold">{recoveryProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${recoveryProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left: 10 Selectable Scenarios Catalog */}
        <div className="xl:col-span-5 mission-panel rounded-lg p-4 border border-sky-500/25 space-y-2.5">
          <PanelHeader
            title="10 Emergency Failure Scenarios"
            subtitle="Select a scenario to inspect or inject fault"
            icon={AlertOctagon}
          />

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {FAILURE_SCENARIOS.map((item, idx) => {
              const isSelected = item.id === scenario.id;
              const isCurrentlyRunning = activeEmergency && activeEmergency.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedScenarioId(item.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isCurrentlyRunning
                      ? 'bg-red-950/40 border-red-500'
                      : isSelected
                      ? 'bg-cyan-500/15 border-cyan-400'
                      : 'bg-slate-900/80 border-slate-800 hover:border-sky-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400 font-bold">
                        {String(idx + 1).padStart(2, '0')}.
                      </span>
                      <span className="text-xs font-mono font-bold text-white">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isCurrentlyRunning && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-red-500 text-white">
                          ACTIVE
                        </span>
                      )}
                      <StatusBadge status={item.severity} size="xs" />
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    {item.code} • Subsystem: <span className="text-cyan-300">{item.subsystem}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Scenario Briefing, Impact, Timeline & Recovery Steps */}
        <div className="xl:col-span-7 mission-panel rounded-lg p-4 border border-sky-500/25 space-y-4">
          <PanelHeader
            title={`${scenario.code} // ${scenario.name}`}
            subtitle={`Affected Subsystem: ${scenario.subsystem}`}
            icon={Activity}
            rightContent={
              <div className="flex items-center gap-2">
                <StatusBadge status={scenario.severity} />
                {isThisScenarioActive && <StatusBadge status="FAULT ACTIVE" />}
              </div>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-cyan-400 font-bold mb-1">
                SCENARIO DESCRIPTION
              </div>
              <p className="text-slate-200 leading-relaxed">{scenario.description}</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-amber-300 font-bold mb-1">
                INITIAL FAULT CONDITIONS
              </div>
              <p className="text-slate-200 leading-relaxed">{scenario.initialConditions}</p>
            </div>
          </div>

          {/* Warning Messages */}
          <div className="p-3.5 rounded-lg bg-red-950/25 border border-red-500/40 space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-red-300 font-bold">
              GENERATED FLIGHT DECK WARNING MESSAGES
            </div>
            {scenario.warningMessages.map((msg) => (
              <div key={msg} className="text-xs font-mono text-red-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {msg}
              </div>
            ))}
          </div>

          {/* System Impact & Simulation Progression Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
                SYSTEM & TELEMETRY IMPACT
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {scenario.systemImpact.map((imp) => (
                  <li key={imp} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="text-[10px] font-mono uppercase text-cyan-300 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> SIMULATION PROGRESSION TIMELINE
              </div>
              <div className="space-y-1.5 text-xs font-mono">
                {scenario.timeline.map((step) => (
                  <div key={step.t} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold shrink-0">{step.t}:</span>
                    <span className="text-slate-300 font-sans">{step.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recovery Options */}
          <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/40 space-y-2">
            <div className="text-[10px] font-mono uppercase text-emerald-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> AUTOMATED & FLIGHT DIRECTOR RECOVERY SEQUENCE
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {scenario.recoveryOptions.map((rec, i) => (
                <div key={rec} className="p-2.5 rounded bg-slate-900/90 border border-emerald-500/25 text-xs">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-0.5">
                    STEP 0{i + 1}
                  </span>
                  <span className="text-slate-200">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
