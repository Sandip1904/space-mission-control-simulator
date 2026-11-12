import React from 'react';
import { ExternalLink, Globe, Compass, Thermometer, Clock, Orbit, Radio } from 'lucide-react';
import { PLANETARY_DATA } from '../../data/planetaryData';
import { useMissionStore } from '../../store/missionStore';

export function PlanetDetailPanel() {
  const selectedPlanetId = useMissionStore((s) => s.selectedPlanetId);
  const setSelectedPlanetId = useMissionStore((s) => s.setSelectedPlanetId);
  const planetaryDistances = useMissionStore((s) => s.planetaryDistances);

  const planet = PLANETARY_DATA.find((p) => p.id === selectedPlanetId) || PLANETARY_DATA[3];
  const liveEarthDist = planetaryDistances?.[planet.id];

  return (
    <div className="mission-panel rounded-lg p-4 border border-sky-500/25 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-sky-500/20">
          <div className="flex items-center gap-2.5">
            <span
              className="w-4 h-4 rounded-full border border-white/40 shrink-0"
              style={{ backgroundColor: planet.colorPrimary }}
            />
            <div>
              <h3 className="text-base font-mono font-bold text-white uppercase tracking-wider">
                {planet.name}
              </h3>
              <p className="text-[11px] font-mono text-cyan-300">{planet.category}</p>
            </div>
          </div>
          <a
            href={planet.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25"
          >
            {planet.sourceTitle} <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Dedicated Live Simulated Distance from Earth Telemetry Card */}
        <div className="p-3 rounded-lg bg-emerald-950/25 border border-emerald-500/40 mb-3 font-mono text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-300 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5" /> LIVE SIMULATED DISTANCE FROM EARTH
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              {liveEarthDist?.alignmentPhase || 'ORBITAL TRACK'}
            </span>
          </div>
          {planet.id === 'earth' ? (
            <div className="text-sm font-bold text-white">0 km — Geocentric Reference Origin</div>
          ) : (
            <>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-lg font-bold text-emerald-300">
                  {liveEarthDist
                    ? planet.id === 'moon'
                      ? `${liveEarthDist.liveDistanceEarthKm.toLocaleString()} km`
                      : `${liveEarthDist.liveDistanceEarthMillionKm.toLocaleString()} × 10⁶ km`
                    : planet.earthDistanceRangeLabel}
                </span>
                <span className="text-xs text-cyan-300 font-semibold">
                  {liveEarthDist ? `${liveEarthDist.liveDistanceEarthAU} AU` : ''}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>One-Way Light Time: <strong className="text-white">{liveEarthDist?.oneWayLightMinutes} min</strong></span>
                <span>Radial Vel: <strong className="text-amber-300">{liveEarthDist?.radialVelocityKms} km/s</strong></span>
              </div>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-emerald-500/20">
                NASA Min–Max Earth Range: {planet.earthDistanceRangeLabel}
              </div>
            </>
          )}
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-3">
          {planet.description}
        </p>

        {/* Required 6 Planetary Attributes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono mb-3">
          <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" /> DIAMETER
            </div>
            <div className="text-slate-100 font-semibold mt-0.5">{planet.diameterLabel}</div>
          </div>

          <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Orbit className="w-3 h-3 text-cyan-400" /> ORBITAL PERIOD
            </div>
            <div className="text-slate-100 font-semibold mt-0.5">{planet.orbitalPeriod}</div>
          </div>

          <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" /> ROTATION PERIOD
            </div>
            <div className="text-slate-100 font-semibold mt-0.5">{planet.rotationPeriod}</div>
          </div>

          <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" /> DISTANCE FROM SUN
            </div>
            <div className="text-slate-100 font-semibold mt-0.5">{planet.distanceFromSun}</div>
          </div>

          <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-cyan-400" /> SURFACE / MEAN TEMP
            </div>
            <div className="text-cyan-300 font-semibold mt-0.5">{planet.surfaceTemp}</div>
          </div>

          <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
            <div className="text-[10px] text-slate-400">GRAVITY / ESCAPE VEL</div>
            <div className="text-slate-100 font-semibold mt-0.5">
              {planet.gravityMs2} m/s² • {planet.escapeVelocityKms} km/s
            </div>
          </div>
        </div>
      </div>

      {/* Quick Planet & Dwarf Planet Selector Matrix (15 Bodies) */}
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
          SELECT PLANET OR DWARF PLANET (15 BODIES)
        </div>
        <div className="grid grid-cols-5 gap-1">
          {PLANETARY_DATA.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedPlanetId(item.id)}
              className={`px-1.5 py-1 rounded text-[10px] font-mono font-semibold truncate border transition-all ${
                selectedPlanetId === item.id
                  ? 'bg-cyan-500/25 text-cyan-200 border-cyan-400'
                  : item.bodyType === 'DWARF PLANET'
                  ? 'bg-indigo-950/50 text-indigo-300 border-indigo-500/30 hover:text-white'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {item.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
