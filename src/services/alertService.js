// Automated threshold monitoring and incident generation service
import { formatMET } from '../utils/formatters';

export const INITIAL_ALERTS = [
  {
    id: 'ALT-1001',
    timestamp: '14:18:05 UTC',
    met: '041:08:12',
    severity: 'INFORMATIONAL',
    category: 'COMMUNICATION',
    subsystem: 'DSN GOLDSTONE',
    title: 'Ka-Band High-Rate Downlink Handover Complete',
    message: 'Deep Space Network Goldstone DSS-14 70m antenna locked at 142.0 Mbps nominal telemetry stream.',
    acknowledged: true,
    resolved: true,
    details: 'Carrier-to-noise density ratio 44.8 dB-Hz; Doppler residual within 0.02 Hz nominal band.',
    recommendedAction: 'Continue automated link margin monitoring.'
  },
  {
    id: 'ALT-1002',
    timestamp: '14:21:40 UTC',
    met: '041:11:04',
    severity: 'WARNING',
    category: 'SPACE WEATHER',
    subsystem: 'RADIATION SENSOR',
    title: 'Minor Solar Proton Flux Elevation Detected',
    message: 'GOES-18 & onboard Cherenkov dosimeter report +14% solar proton flux in >10 MeV channel.',
    acknowledged: false,
    resolved: false,
    details: 'Flux remains well below crew shelter threshold; IMU parity checks running every 500 ms.',
    recommendedAction: 'Monitor IMU Kalman filter residuals and maintain normal attitude hold.'
  },
  {
    id: 'ALT-1003',
    timestamp: '14:22:55 UTC',
    met: '041:11:50',
    severity: 'WARNING',
    category: 'ORBITAL TRACKING',
    subsystem: 'CONJUNCTION MONITOR',
    title: 'Cataloged Debris Object in Secondary Watch Corridor',
    message: 'DEBRIS-COSMOS-FRAG-44 tracked in LEO catalog; cislunar spacecraft trajectory unaffected unless LEO test mode selected.',
    acknowledged: false,
    resolved: false,
    details: 'NORAD ID 60418-SIM tracked via S-Band radar fence.',
    recommendedAction: 'Keep automated collision avoidance telemetry active.'
  }
];

export function evaluateTelemetryThresholds(telemetry, thresholds, existingAlerts, metSeconds) {
  const newAlerts = [];
  const nowUtc = new Date().toISOString().slice(11, 19) + ' UTC';
  const metStr = formatMET(metSeconds);

  const hasActiveUnresolved = (codePrefix) =>
    existingAlerts.some((a) => a.id.startsWith(codePrefix) && !a.resolved);

  if (telemetry.lifeSupport.o2LevelPct < thresholds.minO2Pct && !hasActiveUnresolved('THRESH-O2')) {
    newAlerts.push({
      id: `THRESH-O2-${Date.now()}`,
      timestamp: nowUtc,
      met: metStr,
      severity: telemetry.lifeSupport.o2LevelPct < 86 ? 'EMERGENCY' : 'CRITICAL',
      category: 'LIFE SUPPORT',
      subsystem: 'ECLSS O2 LOOP',
      title: `Cabin Oxygen Below Threshold (${telemetry.lifeSupport.o2LevelPct.toFixed(1)}%)`,
      message: `Cabin O₂ concentration dropped below configured ${thresholds.minO2Pct}% safety floor.`,
      acknowledged: false,
      resolved: false,
      details: `Measured O₂: ${telemetry.lifeSupport.o2LevelPct.toFixed(1)}% | Cabin Pressure: ${telemetry.lifeSupport.cabinPressureKpa.toFixed(1)} kPa.`,
      recommendedAction: 'Inspect O₂ manifold valves and engage High-Pressure O₂ Reserve feed.'
    });
  }

  if (telemetry.power.batteryPct < thresholds.minBatteryPct && !hasActiveUnresolved('THRESH-BATT')) {
    newAlerts.push({
      id: `THRESH-BATT-${Date.now()}`,
      timestamp: nowUtc,
      met: metStr,
      severity: telemetry.power.batteryPct < 25 ? 'EMERGENCY' : 'CRITICAL',
      category: 'POWER SYSTEM',
      subsystem: 'EPS MAIN BUS',
      title: `Battery State of Charge Low (${telemetry.power.batteryPct.toFixed(1)}%)`,
      message: `Main battery capacity fell below configured ${thresholds.minBatteryPct}% threshold.`,
      acknowledged: false,
      resolved: false,
      details: `Bus Voltage: ${telemetry.power.batteryVoltage.toFixed(1)}V | Solar Output: ${telemetry.power.solarOutputKw.toFixed(1)} kW.`,
      recommendedAction: 'Shed non-essential payload loads and verify solar array sun-tracking gimbal.'
    });
  }

  if (telemetry.thermal.cabinTempC > thresholds.maxCabinTempC && !hasActiveUnresolved('THRESH-TEMP')) {
    newAlerts.push({
      id: `THRESH-TEMP-${Date.now()}`,
      timestamp: nowUtc,
      met: metStr,
      severity: telemetry.thermal.cabinTempC > 31 ? 'CRITICAL' : 'WARNING',
      category: 'THERMAL CONTROL',
      subsystem: 'TCS GLYCOL LOOP',
      title: `Cabin Temperature High (${telemetry.thermal.cabinTempC.toFixed(1)} °C)`,
      message: `Crew module cabin temperature exceeded ${thresholds.maxCabinTempC} °C threshold.`,
      acknowledged: false,
      resolved: false,
      details: `Cabin Temp: ${telemetry.thermal.cabinTempC.toFixed(1)} °C | External Temp: ${telemetry.thermal.externalTempC.toFixed(1)} °C.`,
      recommendedAction: 'Engage redundant coolant pump loop B and verify radiator louver position.'
    });
  }

  if (telemetry.propulsion.engineTempC > thresholds.maxEngineTempC && !hasActiveUnresolved('THRESH-ENG')) {
    newAlerts.push({
      id: `THRESH-ENG-${Date.now()}`,
      timestamp: nowUtc,
      met: metStr,
      severity: 'EMERGENCY',
      category: 'PROPULSION',
      subsystem: 'OMS-E ENGINE',
      title: `Engine Chamber Over-Temperature (${telemetry.propulsion.engineTempC.toFixed(0)} °C)`,
      message: `Main engine temperature crossed ${thresholds.maxEngineTempC} °C safety limit.`,
      acknowledged: false,
      resolved: false,
      details: `Engine Temp: ${telemetry.propulsion.engineTempC.toFixed(0)} °C | Manifold Pressure: ${telemetry.propulsion.propellantPressurePsi.toFixed(1)} PSI.`,
      recommendedAction: 'Command immediate propellant shutoff and initiate Helium purge sequence.'
    });
  }

  if (telemetry.propulsion.fuelRemainingPct < thresholds.minFuelPct && !hasActiveUnresolved('THRESH-FUEL')) {
    newAlerts.push({
      id: `THRESH-FUEL-${Date.now()}`,
      timestamp: nowUtc,
      met: metStr,
      severity: 'WARNING',
      category: 'PROPULSION',
      subsystem: 'MMH/NTO TANKS',
      title: `Propellant Reserve Low (${telemetry.propulsion.fuelRemainingPct.toFixed(1)}%)`,
      message: `Usable propellant dropped below ${thresholds.minFuelPct}% mission reserve floor.`,
      acknowledged: false,
      resolved: false,
      details: `Remaining Fuel: ${telemetry.propulsion.fuelRemainingPct.toFixed(1)}% | Pressure: ${telemetry.propulsion.propellantPressurePsi.toFixed(1)} PSI.`,
      recommendedAction: 'Isolate suspect RCS manifold and inhibit non-critical attitude burns.'
    });
  }

  return newAlerts;
}
