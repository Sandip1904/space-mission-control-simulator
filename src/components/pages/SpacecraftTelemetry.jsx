import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Flame,
  Thermometer,
  Radio,
  Compass,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useMissionStore } from '../../store/missionStore';
import { PanelHeader } from '../common/PanelHeader';
import { StatusBadge } from '../common/StatusBadge';

const TIME_FILTERS = [
  { label: 'Last 10 Frames', count: 10 },
  { label: 'Last 20 Frames', count: 20 },
  { label: 'Full Window (30)', count: 30 },
];

export function SpacecraftTelemetry() {
  const telemetry = useMissionStore((s) => s.telemetry);
  const spacecraft = useMissionStore((s) => s.spacecraft);
  const telemetryHistory = useMissionStore((s) => s.telemetryHistory);

  const [frameCount, setFrameCount] = useState(30);
  const [expandedPanels, setExpandedPanels] = useState({
    power: true,
    propulsion: true,
    thermal: true,
    comms: true,
    nav: true,
  });

  const togglePanel = (key) =>
    setExpandedPanels((prev) => ({ ...prev, [key]: !prev[key] }));

  const chartData = telemetryHistory.slice(-frameCount);

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="mission-panel rounded-lg p-3.5 border border-sky-500/25 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-sm font-mono font-bold uppercase text-white">
              Spacecraft Subsystem Telemetry Center
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              Continuous simulated sensor bus monitoring across Power, Propulsion, Thermal, Comm & Navigation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-slate-400 mr-1">TIME WINDOW:</span>
          {TIME_FILTERS.map((tf) => (
            <button
              key={tf.count}
              type="button"
              onClick={() => setFrameCount(tf.count)}
              className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border transition-colors ${
                frameCount === tf.count
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. POWER SYSTEM & 2. PROPULSION SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* POWER SYSTEM */}
        <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
          <PanelHeader
            title="Power System (EPS)"
            subtitle="Solar array wings, main bus voltage & Li-Ion battery packs"
            icon={Zap}
            rightContent={
              <div className="flex items-center gap-2">
                <StatusBadge status={telemetry.power.status} size="xs" />
                <button
                  type="button"
                  onClick={() => togglePanel('power')}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  {expandedPanels.power ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            }
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono mb-3">
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">BATTERY VOLTAGE</span>
              <strong className="text-cyan-300 text-sm">{telemetry.power.batteryVoltage.toFixed(1)} V</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">BATTERY CHARGE</span>
              <strong className="text-emerald-300 text-sm">{telemetry.power.batteryPct.toFixed(1)}%</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">SOLAR OUTPUT</span>
              <strong className="text-cyan-300 text-sm">{telemetry.power.solarOutputKw.toFixed(2)} kW</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">CONSUMPTION</span>
              <strong className="text-amber-300 text-sm">{telemetry.power.powerConsumptionKw.toFixed(2)} kW</strong>
            </div>
          </div>

          {expandedPanels.power && (
            <div className="relative h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 12, left: -18, bottom: 0 }}>
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
                  <Line type="monotone" dataKey="batteryPct" name="Battery (%)" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="solarOutputKw" name="Solar (kW)" stroke="#06b6d4" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="powerConsumptionKw" name="Load (kW)" stroke="#f59e0b" strokeWidth={1.8} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* PROPULSION SYSTEM */}
        <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
          <PanelHeader
            title="Propulsion System (OMS-E & RCS)"
            subtitle="Fuel remaining, chamber temperature, thrust & manifold pressure"
            icon={Flame}
            rightContent={
              <div className="flex items-center gap-2">
                <StatusBadge status={telemetry.propulsion.status} size="xs" />
                <button
                  type="button"
                  onClick={() => togglePanel('propulsion')}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  {expandedPanels.propulsion ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            }
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono mb-3">
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">FUEL REMAINING</span>
              <strong className="text-cyan-300 text-sm">{telemetry.propulsion.fuelRemainingPct.toFixed(1)}%</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">ENGINE TEMP</span>
              <strong className="text-amber-300 text-sm">{telemetry.propulsion.engineTempC.toFixed(1)} °C</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">THRUST LEVEL</span>
              <strong className="text-slate-100 text-sm">{telemetry.propulsion.thrustKn.toFixed(1)} kN</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">PROP PRESSURE</span>
              <strong className="text-emerald-300 text-sm">{telemetry.propulsion.propellantPressurePsi.toFixed(1)} PSI</strong>
            </div>
          </div>

          {expandedPanels.propulsion && (
            <div className="relative h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 12, left: -18, bottom: 0 }}>
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
                  <Line type="monotone" dataKey="engineTempC" name="Engine Temp (°C)" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="propellantPressurePsi" name="Pressure (PSI)" stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* 3. THERMAL & 4. COMMUNICATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* THERMAL SYSTEM */}
        <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
          <PanelHeader
            title="Thermal Control System (TCS)"
            subtitle="Cabin, external hull radiator & engine bay thermal loops"
            icon={Thermometer}
            rightContent={<StatusBadge status={telemetry.thermal.protectionStatus} size="xs" />}
          />

          <div className="grid grid-cols-3 gap-2.5 text-xs font-mono mb-3">
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">CABIN TEMP</span>
              <strong className="text-emerald-300 text-sm">{telemetry.thermal.cabinTempC.toFixed(1)} °C</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">EXTERNAL HULL</span>
              <strong className="text-cyan-300 text-sm">{telemetry.thermal.externalTempC.toFixed(1)} °C</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">ENGINE BAY</span>
              <strong className="text-amber-300 text-sm">{telemetry.thermal.engineTempC.toFixed(1)} °C</strong>
            </div>
          </div>

          <div className="relative h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 12, left: -18, bottom: 0 }}>
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
                <Line type="monotone" dataKey="cabinTempC" name="Cabin (°C)" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="externalTempC" name="External (°C)" stroke="#38bdf8" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COMMUNICATION SYSTEM */}
        <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
          <PanelHeader
            title="Deep Space Communication (Ka/S-Band)"
            subtitle="DSN link margin, downlink rate & round-trip light time latency"
            icon={Radio}
            rightContent={<StatusBadge status={telemetry.comms.antennaStatus} size="xs" />}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono mb-3">
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">SIGNAL STRENGTH</span>
              <strong className="text-cyan-300 text-sm">{telemetry.comms.signalStrengthDbm} dBm</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">TX UPLINK RATE</span>
              <strong className="text-slate-100 text-sm">{telemetry.comms.txRateMbps.toFixed(1)} Mbps</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">DOWNLINK SPEED</span>
              <strong className="text-emerald-300 text-sm">{telemetry.comms.downSpeedMbps.toFixed(1)} Mbps</strong>
            </div>
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">COMM LATENCY</span>
              <strong className="text-amber-300 text-sm">{telemetry.comms.latencyMs} ms</strong>
            </div>
          </div>

          <div className="relative h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 12, left: -18, bottom: 0 }}>
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
                <Line type="monotone" dataKey="downSpeedMbps" name="Downlink (Mbps)" stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="txRateMbps" name="TX Rate (Mbps)" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. NAVIGATION & GUIDANCE (GNC) */}
      <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
        <PanelHeader
          title="Guidance, Navigation & Control (GNC State Vectors)"
          subtitle="J2000 ECI Position (X, Y, Z), Velocity (Vx, Vy, Vz), Altitude, Heading & Acceleration"
          icon={Compass}
          rightContent={<StatusBadge status="KALMAN LOCK" size="xs" />}
        />

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">POSITION (X, Y, Z)</span>
            <strong className="text-cyan-300 block mt-1">
              X: {spacecraft.position.x.toLocaleString()} km
            </strong>
            <span className="text-slate-300 block">Y: {spacecraft.position.y.toLocaleString()} km</span>
            <span className="text-slate-300 block">Z: {spacecraft.position.z.toLocaleString()} km</span>
          </div>

          <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">VELOCITY (Vx, Vy, Vz)</span>
            <strong className="text-emerald-300 block mt-1">Vx: {spacecraft.velocity.vx} km/s</strong>
            <span className="text-slate-300 block">Vy: {spacecraft.velocity.vy} km/s</span>
            <span className="text-slate-300 block">Vz: {spacecraft.velocity.vz} km/s</span>
          </div>

          <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">ORBITAL ALTITUDE</span>
            <strong className="text-white text-base block mt-1">
              {spacecraft.altitudeKm.toLocaleString()} km
            </strong>
            <span className="text-[11px] text-slate-400">Cislunar Reference</span>
          </div>

          <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">SPACECRAFT HEADING</span>
            <strong className="text-cyan-300 text-base block mt-1">{spacecraft.headingDeg}°</strong>
            <span className="text-[11px] text-slate-400">Quaternion Nominally Aligned</span>
          </div>

          <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">NET ACCELERATION</span>
            <strong className="text-amber-300 text-base block mt-1">{spacecraft.accelerationG} G</strong>
            <span className="text-[11px] text-slate-400">Micro-gravity Coast</span>
          </div>
        </div>
      </div>
    </div>
  );
}
