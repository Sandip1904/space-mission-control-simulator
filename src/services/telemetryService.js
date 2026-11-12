// Initial telemetry baseline and historical time-series generator
import { formatMET } from '../utils/formatters';

export function getInitialTelemetry() {
  return {
    power: {
      batteryVoltage: 120.4,
      batteryPct: 94.2,
      solarOutputKw: 11.4,
      powerConsumptionKw: 8.2,
      status: 'NOMINAL'
    },
    propulsion: {
      fuelRemainingPct: 78.6,
      engineTempC: 312.0,
      thrustKn: 0.0,
      propellantPressurePsi: 315.4,
      status: 'NOMINAL'
    },
    thermal: {
      cabinTempC: 21.4,
      externalTempC: -118.5,
      engineTempC: 312.0,
      protectionStatus: 'NOMINAL'
    },
    comms: {
      signalStrengthDbm: -82.4,
      signalPct: 96.0,
      txRateMbps: 48.5,
      downSpeedMbps: 142.0,
      latencyMs: 1280,
      antennaStatus: 'LOCKED (DSN GOLDSTONE)'
    },
    lifeSupport: {
      o2LevelPct: 98.4,
      cabinPressureKpa: 101.3,
      cabinTempC: 21.4,
      co2Ppm: 412,
      waterSupplyPct: 89.5,
      crewStatus: 'NOMINAL (4 CREW)',
      filtrationStatus: 'ACTIVE (99.4% EFF)',
      emergencyReserveHours: 168
    }
  };
}

export function generateInitialTelemetryHistory(startMet = 148320) {
  const history = [];
  for (let i = 29; i >= 0; i--) {
    const met = startMet - i * 5;
    const wave = Math.sin(i * 0.35);
    const cosWave = Math.cos(i * 0.28);
    history.push({
      time: formatMET(met).slice(4),
      met,
      batteryPct: Number((94.0 + wave * 0.4).toFixed(2)),
      batteryVoltage: Number((120.2 + wave * 0.3).toFixed(2)),
      solarOutputKw: Number((11.4 + cosWave * 0.25).toFixed(2)),
      powerConsumptionKw: Number((8.2 + wave * 0.2).toFixed(2)),
      fuelRemainingPct: Number((78.6 + i * 0.002).toFixed(2)),
      engineTempC: Number((312.0 + wave * 3.5).toFixed(1)),
      propellantPressurePsi: Number((315.4 + cosWave * 1.8).toFixed(1)),
      cabinTempC: Number((21.4 + wave * 0.15).toFixed(2)),
      externalTempC: Number((-118.5 + cosWave * 1.2).toFixed(1)),
      signalPct: Number((96.0 + wave * 0.8).toFixed(1)),
      txRateMbps: Number((48.5 + cosWave * 1.4).toFixed(1)),
      downSpeedMbps: Number((142.0 + wave * 2.5).toFixed(1)),
      latencyMs: Math.round(1280 + cosWave * 18),
      o2LevelPct: Number((98.4 + wave * 0.1).toFixed(2)),
      cabinPressureKpa: Number((101.3 + cosWave * 0.08).toFixed(2)),
      co2Ppm: Math.round(412 + wave * 6),
      waterSupplyPct: Number((89.5 + i * 0.001).toFixed(2)),
      velocityKms: Number((1.48 + wave * 0.01).toFixed(3)),
      altitudeKm: Math.round(240469 - i * 7),
    });
  }
  return history;
}
