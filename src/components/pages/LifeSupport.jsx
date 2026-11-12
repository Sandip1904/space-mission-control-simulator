import React from 'react';
import {
  HeartPulse,
  Wind,
  Gauge,
  Thermometer,
  Droplets,
  ShieldCheck,
  Users,
  Filter,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useMissionStore } from '../../store/missionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { PanelHeader } from '../common/PanelHeader';
import { StatusBadge } from '../common/StatusBadge';

export function LifeSupport() {
  const lifeSupport = useMissionStore((s) => s.telemetry.lifeSupport);
  const telemetryHistory = useMissionStore((s) => s.telemetryHistory);
  const boostOxygenSupply = useMissionStore((s) => s.boostOxygenSupply);
  const purgeCo2Scrubber = useMissionStore((s) => s.purgeCo2Scrubber);
  const thresholds = useSettingsStore((s) => s.thresholds);

  const gauges = [
    {
      label: 'Oxygen Concentration (O₂)',
      value: `${lifeSupport.o2LevelPct.toFixed(1)}%`,
      pct: lifeSupport.o2LevelPct,
      safeRange: `Safe: ${thresholds.minO2Pct}% – 100%`,
      warnThreshold: `Warning < ${thresholds.minO2Pct}%`,
      status: lifeSupport.o2LevelPct < thresholds.minO2Pct ? 'CRITICAL' : 'NOMINAL',
      icon: Wind,
    },
    {
      label: 'Cabin Atmospheric Pressure',
      value: `${lifeSupport.cabinPressureKpa.toFixed(1)} kPa`,
      pct: (lifeSupport.cabinPressureKpa / 105) * 100,
      safeRange: 'Safe: 94.0 – 102.5 kPa',
      warnThreshold: `Warning < ${thresholds.minCabinPressureKpa} kPa`,
      status: lifeSupport.cabinPressureKpa < thresholds.minCabinPressureKpa ? 'CRITICAL' : 'NOMINAL',
      icon: Gauge,
    },
    {
      label: 'Cabin Air Temperature',
      value: `${lifeSupport.cabinTempC.toFixed(1)} °C`,
      pct: (lifeSupport.cabinTempC / 40) * 100,
      safeRange: 'Safe: 18.5 – 26.5 °C',
      warnThreshold: `Warning > ${thresholds.maxCabinTempC} °C`,
      status: lifeSupport.cabinTempC > thresholds.maxCabinTempC ? 'WARNING' : 'NOMINAL',
      icon: Thermometer,
    },
    {
      label: 'CO₂ Partial Concentration',
      value: `${lifeSupport.co2Ppm} ppm`,
      pct: Math.min(100, (lifeSupport.co2Ppm / 1500) * 100),
      safeRange: 'Safe: 350 – 800 ppm',
      warnThreshold: `Warning > ${thresholds.maxCo2Ppm} ppm`,
      status: lifeSupport.co2Ppm > thresholds.maxCo2Ppm ? 'WARNING' : 'NOMINAL',
      icon: Filter,
    },
    {
      label: 'Potable Water Supply',
      value: `${lifeSupport.waterSupplyPct.toFixed(1)}%`,
      pct: lifeSupport.waterSupplyPct,
      safeRange: 'Safe: 50% – 100% (540 L)',
      warnThreshold: 'Warning < 35%',
      status: lifeSupport.waterSupplyPct < 35 ? 'WARNING' : 'NOMINAL',
      icon: Droplets,
    },
    {
      label: 'Emergency O₂/N₂ Reserve',
      value: `${lifeSupport.emergencyReserveHours} hrs`,
      pct: (lifeSupport.emergencyReserveHours / 168) * 100,
      safeRange: 'Nominal Reserve: 168 Hours (7 Days)',
      warnThreshold: 'Critical < 72 Hours',
      status: 'NOMINAL',
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top ECLSS Command Bar */}
      <div className="mission-panel rounded-lg p-4 border border-sky-500/25 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <HeartPulse className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-sm font-mono font-bold uppercase text-white">
              Environmental Control & Life Support System (ECLSS)
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              Crew Cabin Atmosphere, Amine Swing-Bed CO₂ Scrubbers & Potable Water Reclamation Loop
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={boostOxygenSupply}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 transition-colors"
          >
            <Wind className="w-3.5 h-3.5" /> Inject Reserve O₂ (+3.5%)
          </button>

          <button
            type="button"
            onClick={purgeCo2Scrubber}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" /> Cycle CO₂ Amine Scrubber
          </button>
        </div>
      </div>

      {/* Crew Environment & Air Filtration Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mission-panel rounded-lg p-4 border border-sky-500/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400">CREW CABIN ENVIRONMENT</div>
              <div className="text-base font-mono font-bold text-white">{lifeSupport.crewStatus}</div>
              <div className="text-[11px] font-mono text-slate-400">
                Mean Heart Rate: 66 BPM • Dosimetry: 0.42 mSv/day
              </div>
            </div>
          </div>
          <StatusBadge status={lifeSupport.crewStatus} />
        </div>

        <div className="mission-panel rounded-lg p-4 border border-sky-500/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-slate-400">HEPA & AMINE AIR FILTRATION</div>
              <div className="text-base font-mono font-bold text-white">{lifeSupport.filtrationStatus}</div>
              <div className="text-[11px] font-mono text-slate-400">
                Trace Contaminant Control Subassembly (TCCS) Online
              </div>
            </div>
          </div>
          <StatusBadge status={lifeSupport.filtrationStatus} />
        </div>
      </div>

      {/* 6 Monitored Parameter Cards with Safe Operating Ranges */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {gauges.map((g) => {
          const Icon = g.icon;
          const isAlert = g.status !== 'NOMINAL';
          return (
            <div
              key={g.label}
              className={`mission-panel rounded-lg p-4 border ${
                isAlert ? 'border-red-500/60 bg-red-950/20' : 'border-sky-500/25'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-cyan-400" /> {g.label}
                </span>
                <StatusBadge status={g.status} size="xs" />
              </div>

              <div className="text-2xl font-mono font-bold text-cyan-300 my-1">{g.value}</div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden my-2.5">
                <div
                  className={`h-full transition-all duration-300 ${
                    isAlert ? 'bg-red-500' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, g.pct))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{g.safeRange}</span>
                <span className="text-amber-300">{g.warnThreshold}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Historical ECLSS Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
          <PanelHeader
            title="Oxygen (%) & Cabin Pressure (kPa) History"
            subtitle="Continuous atmospheric regulation trend"
            icon={Wind}
          />
          <div className="relative h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory} margin={{ top: 5, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.12)" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis domain={[70, 105]} stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#060d1f',
                    borderColor: 'rgba(56,189,248,0.4)',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Area type="monotone" dataKey="o2LevelPct" name="Oxygen (%)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} isAnimationActive={false} />
                <Area type="monotone" dataKey="cabinPressureKpa" name="Pressure (kPa)" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
          <PanelHeader
            title="CO₂ Concentration (ppm) & Water Reserve (%)"
            subtitle="Amine swing-bed scrubber performance & potable water loop"
            icon={Droplets}
          />
          <div className="relative h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory} margin={{ top: 5, right: 12, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.12)" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#060d1f',
                    borderColor: 'rgba(56,189,248,0.4)',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Area type="monotone" dataKey="co2Ppm" name="CO₂ (ppm)" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} strokeWidth={2} isAnimationActive={false} />
                <Area type="monotone" dataKey="waterSupplyPct" name="Water (%)" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
