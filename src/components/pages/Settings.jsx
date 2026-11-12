import React from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Volume2,
  Sparkles,
  RotateCcw,
  Sliders,
  LayoutGrid,
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useMissionStore } from '../../store/missionStore';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { PanelHeader } from '../common/PanelHeader';

export function Settings() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const compactMode = useSettingsStore((s) => s.compactMode);
  const setCompactMode = useSettingsStore((s) => s.setCompactMode);
  const telemetryRefreshMs = useSettingsStore((s) => s.telemetryRefreshMs);
  const setTelemetryRefreshMs = useSettingsStore((s) => s.setTelemetryRefreshMs);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const animationsEnabled = useSettingsStore((s) => s.animationsEnabled);
  const setAnimationsEnabled = useSettingsStore((s) => s.setAnimationsEnabled);
  const thresholds = useSettingsStore((s) => s.thresholds);
  const updateThreshold = useSettingsStore((s) => s.updateThreshold);
  const resetSettings = useSettingsStore((s) => s.resetSettings);

  const simSpeed = useMissionStore((s) => s.simSpeed);
  const setSimSpeed = useMissionStore((s) => s.setSimSpeed);

  const { playTone } = useSoundEffects();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Display, Audio & Simulation Cadence Preferences */}
        <div className="mission-panel rounded-lg p-4 border border-sky-500/25 space-y-4">
          <PanelHeader
            title="Console Display & Simulation Preferences"
            subtitle="Persisted automatically in browser localStorage"
            icon={SettingsIcon}
            rightContent={
              <button
                type="button"
                onClick={resetSettings}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-400"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
              </button>
            }
          />

          {/* Theme Mode */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-bold text-white">Interface Color Theme</div>
              <div className="text-[11px] text-slate-400">
                Switch between Deep-Space Dark Mode and High-Contrast Daylight Mode
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono font-semibold border ${
                  theme === 'dark'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-mono font-semibold border ${
                  theme === 'light'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
            </div>
          </div>

          {/* Compact Dashboard Mode */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-mono font-bold text-white">Compact Telemetry Density</div>
                <div className="text-[11px] text-slate-400">
                  Reduces card padding for high-density multi-panel flight consoles
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCompactMode(!compactMode)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold border ${
                compactMode
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-950 text-slate-400 border-slate-700'
              }`}
            >
              {compactMode ? 'COMPACT ON' : 'STANDARD'}
            </button>
          </div>

          {/* Telemetry Refresh Cadence */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">
                Telemetry Bus Refresh Interval
              </span>
              <span className="text-xs font-mono text-cyan-300">{telemetryRefreshMs} ms</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[500, 1000, 2000, 5000].map((ms) => (
                <button
                  key={ms}
                  type="button"
                  onClick={() => setTelemetryRefreshMs(ms)}
                  className={`py-1.5 rounded text-xs font-mono font-semibold border ${
                    telemetryRefreshMs === ms
                      ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {ms} ms
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Speed Multiplier */}
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">
                Active Simulation Speed Multiplier
              </span>
              <span className="text-xs font-mono text-cyan-300">{simSpeed}x</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {[0.5, 1, 2, 5, 10, 20].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setSimSpeed(spd)}
                  className={`py-1.5 rounded text-xs font-mono font-semibold border ${
                    simSpeed === spd
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Animation Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-xs font-mono font-bold text-white">Audio Synthesizer</div>
                  <div className="text-[10px] text-slate-400">Web Audio alert tones</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => playTone('recovery')}
                  className="px-2 py-1 rounded text-[10px] font-mono bg-slate-800 text-cyan-300 border border-slate-700"
                >
                  Test
                </button>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
                    soundEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {soundEnabled ? 'ON' : 'MUTED'}
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="text-xs font-mono font-bold text-white">UI Motion Effects</div>
                  <div className="text-[10px] text-slate-400">Smooth panel transitions</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAnimationsEnabled(!animationsEnabled)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
                  animationsEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {animationsEnabled ? 'ENABLED' : 'REDUCED'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Automated Alert Threshold Configuration */}
        <div className="mission-panel rounded-lg p-4 border border-sky-500/25 space-y-4">
          <PanelHeader
            title="Automated Telemetry Alert Thresholds"
            subtitle="Configure trigger limits for automatic incident generation"
            icon={Sliders}
          />

          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">MINIMUM CABIN OXYGEN (%)</span>
                <strong className="text-cyan-300">{thresholds.minO2Pct}%</strong>
              </div>
              <input
                type="range"
                min="80"
                max="97"
                step="1"
                value={thresholds.minO2Pct}
                onChange={(e) => updateThreshold('minO2Pct', e.target.value)}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">MINIMUM BATTERY STATE OF CHARGE (%)</span>
                <strong className="text-cyan-300">{thresholds.minBatteryPct}%</strong>
              </div>
              <input
                type="range"
                min="15"
                max="80"
                step="1"
                value={thresholds.minBatteryPct}
                onChange={(e) => updateThreshold('minBatteryPct', e.target.value)}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">MAXIMUM CABIN TEMPERATURE (°C)</span>
                <strong className="text-amber-300">{thresholds.maxCabinTempC} °C</strong>
              </div>
              <input
                type="range"
                min="23"
                max="35"
                step="0.5"
                value={thresholds.maxCabinTempC}
                onChange={(e) => updateThreshold('maxCabinTempC', e.target.value)}
                className="w-full accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">MAXIMUM ENGINE CHAMBER TEMPERATURE (°C)</span>
                <strong className="text-amber-300">{thresholds.maxEngineTempC} °C</strong>
              </div>
              <input
                type="range"
                min="400"
                max="950"
                step="10"
                value={thresholds.maxEngineTempC}
                onChange={(e) => updateThreshold('maxEngineTempC', e.target.value)}
                className="w-full accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">MAXIMUM CO₂ CONCENTRATION (ppm)</span>
                <strong className="text-amber-300">{thresholds.maxCo2Ppm} ppm</strong>
              </div>
              <input
                type="range"
                min="500"
                max="1400"
                step="25"
                value={thresholds.maxCo2Ppm}
                onChange={(e) => updateThreshold('maxCo2Ppm', e.target.value)}
                className="w-full accent-amber-400"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">MINIMUM PROPELLANT RESERVE (%)</span>
                <strong className="text-cyan-300">{thresholds.minFuelPct}%</strong>
              </div>
              <input
                type="range"
                min="15"
                max="65"
                step="1"
                value={thresholds.minFuelPct}
                onChange={(e) => updateThreshold('minFuelPct', e.target.value)}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
