import React from 'react';
import {
  Rocket,
  Compass,
  Gauge,
  BatteryCharging,
  Wind,
  Flame,
  Radio,
  AlertTriangle,
  CalendarClock,
  Activity,
  CheckCircle2,
  ArrowUpRight,
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
import { Globe } from 'lucide-react';
import { PLANETARY_DATA } from '../../data/planetaryData';
import { useMissionStore } from '../../store/missionStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatMET, formatNumber } from '../../utils/formatters';
import { MetricCard } from '../common/MetricCard';
import { PanelHeader } from '../common/PanelHeader';
import { StatusBadge } from '../common/StatusBadge';

export function MissionOverview({ onNavigate }) {
  const spacecraft = useMissionStore((s) => s.spacecraft);
  const missionPhase = useMissionStore((s) => s.missionPhase);
  const metSeconds = useMissionStore((s) => s.metSeconds);
  const telemetry = useMissionStore((s) => s.telemetry);
  const telemetryHistory = useMissionStore((s) => s.telemetryHistory);
  const alerts = useMissionStore((s) => s.alerts);
  const timelineEvents = useMissionStore((s) => s.timelineEvents);
  const activeEmergency = useMissionStore((s) => s.activeEmergency);
  const planetaryDistances = useMissionStore((s) => s.planetaryDistances);
  const setSelectedPlanetId = useMissionStore((s) => s.setSelectedPlanetId);
  const acknowledgeAlert = useMissionStore((s) => s.acknowledgeAlert);
  const resolveAlert = useMissionStore((s) => s.resolveAlert);

  const compactMode = useSettingsStore((s) => s.compactMode);
  const thresholds = useSettingsStore((s) => s.thresholds);

  const o2Status =
    telemetry.lifeSupport.o2LevelPct < thresholds.minO2Pct ? 'critical' : 'nominal';
  const battStatus =
    telemetry.power.batteryPct < thresholds.minBatteryPct ? 'critical' : 'nominal';
  const fuelStatus =
    telemetry.propulsion.fuelRemainingPct < thresholds.minFuelPct ? 'warning' : 'normal';
  const sigStatus = telemetry.comms.signalPct < 45 ? 'warning' : 'nominal';

  const activeAlerts = alerts.filter((a) => !a.resolved).slice(0, 4);
  const upcomingEvents = timelineEvents.filter((e) => e.status !== 'COMPLETED').slice(0, 4);

  return (
    <div className="space-y-4">
      {/* Emergency Banner if Active */}
      {activeEmergency && (
        <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-500/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 animate-bounce shrink-0" />
            <div>
              <div className="text-xs font-mono font-bold uppercase text-red-300">
                ACTIVE EMERGENCY SCENARIO // {activeEmergency.code} — {activeEmergency.name}
              </div>
              <div className="text-xs text-slate-200 mt-0.5">
                {activeEmergency.warningMessages[0]}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('simulation')}
            className="px-3 py-1.5 rounded text-xs font-mono font-bold bg-red-500 text-white hover:bg-red-400 transition-colors"
          >
            Open Emergency Console →
          </button>
        </div>
      )}

      {/* Mission Header Identity Banner */}
      <div className="mission-panel rounded-lg p-4 border border-sky-500/25 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
              {spacecraft.missionId}
            </span>
            <StatusBadge status={spacecraft.status} />
            <span className="text-xs font-mono text-slate-400">
              PHASE: <strong className="text-slate-100">{missionPhase}</strong>
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-mono font-bold text-white tracking-tight">
            {spacecraft.missionName} — {spacecraft.name}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded bg-slate-900/90 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">MISSION ELAPSED TIME</span>
            <span className="text-cyan-300 font-bold text-sm">{formatMET(metSeconds)}</span>
          </div>
          <div className="px-3 py-1.5 rounded bg-slate-900/90 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">SPACECRAFT POSITION (XYZ)</span>
            <span className="text-slate-200 font-semibold">
              {spacecraft.position.x.toLocaleString()}, {spacecraft.position.y.toLocaleString()},{' '}
              {spacecraft.position.z.toLocaleString()} km
            </span>
          </div>
        </div>
      </div>

      {/* 8 Primary KPI Telemetry Cards */}
      <div className={`grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 ${compactMode ? 'gap-2' : 'gap-3'}`}>
        <MetricCard
          compact={compactMode}
          label="Earth Distance"
          value={formatNumber(spacecraft.distanceFromEarthKm, 0)}
          unit="km"
          subValue={`Alt: ${spacecraft.altitudeKm.toLocaleString()} km`}
          icon={Compass}
        />
        <MetricCard
          compact={compactMode}
          label="Lunar Distance"
          value={formatNumber(spacecraft.distanceFromMoonKm, 0)}
          unit="km"
          subValue="Target: 130 km Perilune"
          icon={Rocket}
        />
        <MetricCard
          compact={compactMode}
          label="Orbital Velocity"
          value={spacecraft.orbitalVelocityKms.toFixed(2)}
          unit="km/s"
          subValue={`Heading: ${spacecraft.headingDeg}°`}
          icon={Gauge}
        />
        <MetricCard
          compact={compactMode}
          label="Spacecraft Alt"
          value={formatNumber(spacecraft.altitudeKm, 0)}
          unit="km"
          subValue={`Accel: ${spacecraft.accelerationG} G`}
          icon={Activity}
        />
        <MetricCard
          compact={compactMode}
          label="Fuel Remaining"
          value={telemetry.propulsion.fuelRemainingPct.toFixed(1)}
          unit="%"
          progressPct={telemetry.propulsion.fuelRemainingPct}
          status={fuelStatus}
          subValue={`${telemetry.propulsion.propellantPressurePsi.toFixed(0)} PSI`}
          icon={Flame}
        />
        <MetricCard
          compact={compactMode}
          label="Oxygen Level"
          value={telemetry.lifeSupport.o2LevelPct.toFixed(1)}
          unit="%"
          progressPct={telemetry.lifeSupport.o2LevelPct}
          status={o2Status}
          subValue={`${telemetry.lifeSupport.cabinPressureKpa.toFixed(1)} kPa`}
          icon={Wind}
        />
        <MetricCard
          compact={compactMode}
          label="Battery Charge"
          value={telemetry.power.batteryPct.toFixed(1)}
          unit="%"
          progressPct={telemetry.power.batteryPct}
          status={battStatus}
          subValue={`${telemetry.power.batteryVoltage.toFixed(1)}V • ${telemetry.power.solarOutputKw.toFixed(1)}kW`}
          icon={BatteryCharging}
        />
        <MetricCard
          compact={compactMode}
          label="Comm Signal"
          value={telemetry.comms.signalPct.toFixed(0)}
          unit="%"
          progressPct={telemetry.comms.signalPct}
          status={sigStatus}
          subValue={`${telemetry.comms.signalStrengthDbm} dBm`}
          icon={Radio}
        />
      </div>

      {/* Cislunar Trajectory Progress & Live Telemetry Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Cislunar Corridor Visualizer */}
        <div className="lg:col-span-5 mission-panel rounded-lg p-4 border border-sky-500/25 flex flex-col justify-between">
          <PanelHeader
            title="Cislunar Trajectory & Position"
            subtitle="Real-time translunar corridor progress (Earth -> Moon)"
            icon={Compass}
            rightContent={
              <button
                type="button"
                onClick={() => onNavigate('trajectory')}
                className="text-xs font-mono text-cyan-300 hover:underline inline-flex items-center gap-1"
              >
                3D Orbit Sim <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          />

          {/* Interactive SVG Cislunar Schematic */}
          <div className="relative bg-slate-950/90 rounded-lg p-4 border border-slate-800 my-2">
            <svg viewBox="0 0 420 140" className="w-full h-36">
              <defs>
                <linearGradient id="trajGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="65%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="70" x2="420" y2="70" stroke="rgba(56,189,248,0.12)" strokeDasharray="3 3" />

              {/* Outbound & Return figure-8 style arc */}
              <path
                d="M 48 70 Q 210 12 368 70"
                fill="none"
                stroke="url(#trajGrad)"
                strokeWidth="2.5"
              />
              <path
                d="M 368 70 Q 210 128 48 70"
                fill="none"
                stroke="rgba(148,163,184,0.28)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Earth Node */}
              <circle cx="48" cy="70" r="16" fill="#1d4ed8" stroke="#38bdf8" strokeWidth="2" />
              <text x="48" y="102" textAnchor="middle" className="fill-slate-300 text-[10px] font-mono">
                EARTH
              </text>

              {/* Moon Node */}
              <circle cx="368" cy="70" r="10" fill="#94a3b8" stroke="#e2e8f0" strokeWidth="1.5" />
              <text x="368" y="98" textAnchor="middle" className="fill-slate-300 text-[10px] font-mono">
                MOON
              </text>

              {/* Dynamic Spacecraft Marker along quadratic curve */}
              {(() => {
                const t = Math.min(0.96, Math.max(0.06, spacecraft.missionProgressPct / 100));
                const x = (1 - t) * (1 - t) * 48 + 2 * (1 - t) * t * 210 + t * t * 368;
                const y = (1 - t) * (1 - t) * 70 + 2 * (1 - t) * t * 12 + t * t * 70;
                return (
                  <g transform={`translate(${x}, ${y})`}>
                    <circle r="8" fill="rgba(34,211,238,0.25)" />
                    <circle r="4.5" fill="#22d3ee" stroke="#ffffff" strokeWidth="1.5" />
                    <text y="-12" textAnchor="middle" className="fill-cyan-300 text-[9px] font-mono font-bold">
                      ORION ({spacecraft.missionProgressPct}%)
                    </text>
                  </g>
                );
              })()}
            </svg>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
              <span>TRANSLUNAR CORRIDOR PROGRESS</span>
              <strong className="text-cyan-300">{spacecraft.missionProgressPct}% TO PERILUNE</strong>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">VEL VECTOR</div>
              <div className="text-slate-100 font-semibold mt-0.5">
                [{spacecraft.velocity.vx}, {spacecraft.velocity.vy}, {spacecraft.velocity.vz}]
              </div>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">ENGINE TEMP</div>
              <div className="text-cyan-300 font-semibold mt-0.5">
                {telemetry.propulsion.engineTempC.toFixed(1)} °C
              </div>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400">CABIN ENV</div>
              <div className="text-emerald-300 font-semibold mt-0.5">
                {telemetry.thermal.cabinTempC.toFixed(1)} °C / {telemetry.lifeSupport.co2Ppm} ppm
              </div>
            </div>
          </div>
        </div>

        {/* Recent Telemetry History Chart */}
        <div className="lg:col-span-7 mission-panel rounded-lg p-4 border border-sky-500/25">
          <PanelHeader
            title="Real-Time Multi-Subsystem Telemetry Stream"
            subtitle="Live Battery %, Oxygen %, and Comm Signal % across recent simulation frames"
            icon={Activity}
            rightContent={
              <button
                type="button"
                onClick={() => onNavigate('telemetry')}
                className="text-xs font-mono text-cyan-300 hover:underline inline-flex items-center gap-1"
              >
                Full Telemetry <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            }
          />

          <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetryHistory} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorO2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBatt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(56, 189, 248, 0.12)" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#060d1f',
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="o2LevelPct"
                  name="Oxygen (%)"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorO2)"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="batteryPct"
                  name="Battery (%)"
                  stroke="#06b6d4"
                  fillOpacity={1}
                  fill="url(#colorBatt)"
                  strokeWidth={2}
                  isAnimationActive={false}
                />
                <Area
                  type="monotone"
                  dataKey="signalPct"
                  name="Comm Link (%)"
                  stroke="#3b82f6"
                  fillOpacity={0}
                  strokeWidth={1.8}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Planetary & Dwarf Planet Distance from Earth Strip */}
      <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
        <PanelHeader
          title="Live Simulated Planetary & Dwarf Planet Distances from Earth"
          subtitle="Real-time heliocentric range (× 10⁶ km, AU & 1-way light time) — click any planet to open 3D Solar System vector"
          icon={Globe}
          rightContent={
            <button
              type="button"
              onClick={() => onNavigate('solar-system')}
              className="text-xs font-mono text-cyan-300 hover:underline inline-flex items-center gap-1"
            >
              Open 15-Body 3D Solar System <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 text-xs font-mono">
          {PLANETARY_DATA.filter((b) => b.id !== 'earth' && b.id !== 'sun').map((body) => {
            const live = planetaryDistances?.[body.id];
            return (
              <div
                key={body.id}
                onClick={() => {
                  setSelectedPlanetId(body.id);
                  onNavigate('solar-system');
                }}
                className="p-2.5 rounded bg-slate-900/90 border border-slate-800 hover:border-cyan-400/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-white truncate flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: body.colorPrimary }}
                    />
                    {body.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {body.bodyType === 'DWARF PLANET' ? 'DWARF' : body.bodyType === 'SATELLITE' ? 'MOON' : 'PLANET'}
                  </span>
                </div>
                <div className="text-emerald-300 font-bold mt-1 truncate">
                  {body.id === 'moon'
                    ? `${live?.liveDistanceEarthKm?.toLocaleString() || '384,400'} km`
                    : `${live?.liveDistanceEarthMillionKm?.toLocaleString() || body.distanceMillionKm}M km`}
                </div>
                <div className="text-[10px] text-cyan-300 flex items-center justify-between mt-0.5">
                  <span>{live?.liveDistanceEarthAU ?? '1.0'} AU</span>
                  <span className="text-amber-300">{live?.oneWayLightMinutes ?? '8.3'}m</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Row: Active Alerts & Upcoming Mission Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Alerts */}
        <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
          <PanelHeader
            title="Active Mission Alerts & Incidents"
            subtitle="Automated threshold and subsystem fault notifications"
            icon={AlertTriangle}
            rightContent={
              <button
                type="button"
                onClick={() => onNavigate('alerts')}
                className="text-xs font-mono text-cyan-300 hover:underline"
              >
                View All ({alerts.length}) →
              </button>
            }
          />

          <div className="space-y-2.5">
            {activeAlerts.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-emerald-300 bg-slate-900/60 rounded border border-emerald-500/20">
                All active alerts resolved. Spacecraft operating within nominal parameters.
              </div>
            ) : (
              activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={alert.severity} size="xs" />
                      <span className="text-[11px] font-mono text-cyan-400">{alert.subsystem}</span>
                      <span className="text-[10px] font-mono text-slate-500">MET {alert.met}</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-100 truncate">
                      {alert.title}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{alert.message}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {!alert.acknowledged && (
                      <button
                        type="button"
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-2 py-1 rounded text-[11px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30 hover:bg-sky-500/25"
                      >
                        Ack
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => resolveAlert(alert.id)}
                      className="px-2 py-1 rounded text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Resolve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Mission Events */}
        <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
          <PanelHeader
            title="Upcoming Mission Timeline Sequence"
            subtitle="Next scheduled flight milestones & burns"
            icon={CalendarClock}
            rightContent={
              <button
                type="button"
                onClick={() => onNavigate('timeline')}
                className="text-xs font-mono text-cyan-300 hover:underline"
              >
                Full Timeline →
              </button>
            }
          />

          <div className="space-y-2.5">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onNavigate('timeline')}
                className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 cursor-pointer flex items-center justify-between gap-3 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-cyan-400">
                      #{evt.sequence} {evt.name}
                    </span>
                    <StatusBadge status={evt.status} size="xs" />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {evt.description}
                  </div>
                </div>
                <div className="text-right font-mono shrink-0">
                  <div className="text-xs text-slate-200 font-semibold">{evt.scheduledTimeLabel}</div>
                  <div className="text-[10px] text-cyan-300">ΔV: {evt.deltaV}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
