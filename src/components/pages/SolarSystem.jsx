import React, { useState } from 'react';
import { Globe, RotateCcw, Rocket, Compass, Radio, ExternalLink } from 'lucide-react';
import { PLANETARY_DATA } from '../../data/planetaryData';
import { useMissionStore } from '../../store/missionStore';
import { SolarSystemCanvas } from '../solar-system/SolarSystemCanvas';
import { PlanetDetailPanel } from '../solar-system/PlanetDetailPanel';
import { PanelHeader } from '../common/PanelHeader';
import { StatusBadge } from '../common/StatusBadge';

export function SolarSystem() {
  const followSpacecraftCamera = useMissionStore((s) => s.followSpacecraftCamera);
  const setFollowSpacecraftCamera = useMissionStore((s) => s.setFollowSpacecraftCamera);
  const showEarthDistanceVector = useMissionStore((s) => s.showEarthDistanceVector);
  const setShowEarthDistanceVector = useMissionStore((s) => s.setShowEarthDistanceVector);
  const selectedPlanetId = useMissionStore((s) => s.selectedPlanetId);
  const setSelectedPlanetId = useMissionStore((s) => s.setSelectedPlanetId);
  const planetaryDistances = useMissionStore((s) => s.planetaryDistances);

  const [resetCounter, setResetCounter] = useState(0);
  const [bodyFilter, setBodyFilter] = useState('ALL');

  const filteredBodies = PLANETARY_DATA.filter((b) => {
    if (bodyFilter === 'ALL') return true;
    if (bodyFilter === 'PLANET') return b.bodyType === 'PLANET';
    if (bodyFilter === 'DWARF PLANET') return b.bodyType === 'DWARF PLANET';
    return b.bodyType === 'STAR' || b.bodyType === 'SATELLITE';
  });

  return (
    <div className="space-y-4">
      <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
        <PanelHeader
          title="3D Interactive Solar System, Dwarf Planets & Earth-Distance Telemetry"
          subtitle="Click any planet or dwarf planet to lock the 3D Earth-to-Body vector and inspect NASA parameters"
          icon={Globe}
          rightContent={
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowEarthDistanceVector(!showEarthDistanceVector)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold border transition-colors ${
                  showEarthDistanceVector
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-700'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                Earth Distance Vector: {showEarthDistanceVector ? 'ON' : 'OFF'}
              </button>

              <button
                type="button"
                onClick={() => setFollowSpacecraftCamera(!followSpacecraftCamera)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-semibold border transition-colors ${
                  followSpacecraftCamera
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                    : 'bg-slate-900 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/15'
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                {followSpacecraftCamera ? 'Following Orion MPCV-04' : 'Follow Spacecraft Camera'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFollowSpacecraftCamera(false);
                  setSelectedPlanetId('sun');
                  setResetCounter((c) => c + 1);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-400/50"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Camera
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          <div className="xl:col-span-8">
            <SolarSystemCanvas cameraResetTrigger={resetCounter} />
          </div>
          <div className="xl:col-span-4">
            <PlanetDetailPanel />
          </div>
        </div>
      </div>

      {/* Live Simulated Planetary Distance-from-Earth Telemetry Matrix */}
      <div className="mission-panel rounded-lg p-4 border border-sky-500/25">
        <PanelHeader
          title="Live Planetary & Dwarf Planet Distance-from-Earth Telemetry Matrix"
          subtitle="Real-time simulated heliocentric range from Earth, one-way light-time delay, and NASA min/max orbital envelope"
          icon={Radio}
          rightContent={
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'ALL', label: 'All Bodies (15)' },
                { id: 'PLANET', label: 'Major Planets (8)' },
                { id: 'DWARF PLANET', label: 'Dwarf Planets (5)' },
                { id: 'OTHER', label: 'Sun & Moon (2)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBodyFilter(tab.id)}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-semibold border transition-colors ${
                    bodyFilter === tab.id
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-sky-500/25 text-[10px] uppercase text-slate-400 bg-slate-900/70">
                <th className="py-2.5 px-3">Celestial Body</th>
                <th className="py-2.5 px-3">Class</th>
                <th className="py-2.5 px-3">Live Distance from Earth</th>
                <th className="py-2.5 px-3">Earth Range (AU)</th>
                <th className="py-2.5 px-3">1-Way Light Time</th>
                <th className="py-2.5 px-3">NASA Min–Max Earth Range</th>
                <th className="py-2.5 px-3">Mean Distance from Sun</th>
                <th className="py-2.5 px-3">Alignment Phase</th>
                <th className="py-2.5 px-3 text-right">3D Vector Lock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredBodies.map((body) => {
                const live = planetaryDistances?.[body.id];
                const isSelected = selectedPlanetId === body.id;
                return (
                  <tr
                    key={body.id}
                    onClick={() => setSelectedPlanetId(body.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/15 text-white'
                        : 'hover:bg-slate-900/70 text-slate-200'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: body.colorPrimary }}
                      />
                      <span>{body.name}</span>
                      <a
                        href={body.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-cyan-400 hover:text-cyan-200"
                        title={body.sourceTitle}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400">{body.bodyType}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-300">
                      {body.id === 'earth'
                        ? '0 km (Origin)'
                        : body.id === 'moon'
                        ? `${live?.liveDistanceEarthKm?.toLocaleString() || '384,400'} km`
                        : `${live?.liveDistanceEarthMillionKm?.toLocaleString() || body.distanceMillionKm} × 10⁶ km`}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300">
                      {body.id === 'earth' ? '0.000 AU' : `${live?.liveDistanceEarthAU ?? '1.000'} AU`}
                    </td>
                    <td className="py-2.5 px-3 text-amber-300">
                      {body.id === 'earth' ? '0.00 min' : `${live?.oneWayLightMinutes ?? '8.3'} min`}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-300">
                      {body.earthDistanceRangeLabel}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-400">
                      {body.distanceFromSun}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={live?.alignmentPhase || 'NOMINAL'} size="xs" />
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlanetId(body.id);
                          setShowEarthDistanceVector(true);
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                            : 'bg-slate-900 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
                        }`}
                      >
                        {isSelected ? 'Locked' : 'Track Vector'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
