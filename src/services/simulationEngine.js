// Centralized real-time spacecraft & telemetry simulation engine
import { clamp, formatMET } from '../utils/formatters';

export function computeNextSimulationStep(state) {
  const {
    metSeconds,
    simSpeed,
    spacecraft,
    telemetry,
    activeEmergency,
    emergencyPaused,
    recoveryInProgress,
    recoveryProgress,
  } = state;

  const nextMet = metSeconds + Math.max(1, Math.round(simSpeed));
  const phaseAngle = nextMet * 0.05;
  const microJitter = () => (Math.random() - 0.5) * 0.18;

  // Clone subsystem objects
  const power = { ...telemetry.power };
  const propulsion = { ...telemetry.propulsion };
  const thermal = { ...telemetry.thermal };
  const comms = { ...telemetry.comms };
  const lifeSupport = { ...telemetry.lifeSupport };
  const sc = {
    ...spacecraft,
    position: { ...spacecraft.position },
    velocity: { ...spacecraft.velocity },
  };

  let nextRecoveryProgress = recoveryProgress;
  let nextRecoveryInProgress = recoveryInProgress;
  let nextActiveEmergency = activeEmergency;

  // Handle active emergency progression or automated recovery
  if (activeEmergency && !emergencyPaused) {
    if (recoveryInProgress) {
      nextRecoveryProgress = clamp(recoveryProgress + 20, 0, 100);
      // Gradually restore values toward nominal during recovery
      power.batteryPct = clamp(power.batteryPct + (94.2 - power.batteryPct) * 0.35, 15, 100);
      power.batteryVoltage = clamp(power.batteryVoltage + (120.4 - power.batteryVoltage) * 0.35, 90, 126);
      power.solarOutputKw = clamp(power.solarOutputKw + (11.4 - power.solarOutputKw) * 0.35, 0, 14);
      power.powerConsumptionKw = clamp(power.powerConsumptionKw + (8.2 - power.powerConsumptionKw) * 0.35, 4, 18);
      propulsion.engineTempC = clamp(propulsion.engineTempC + (312.0 - propulsion.engineTempC) * 0.35, 150, 1100);
      propulsion.propellantPressurePsi = clamp(propulsion.propellantPressurePsi + (315.4 - propulsion.propellantPressurePsi) * 0.35, 180, 360);
      thermal.cabinTempC = clamp(thermal.cabinTempC + (21.4 - thermal.cabinTempC) * 0.35, 15, 40);
      comms.signalPct = clamp(comms.signalPct + (96.0 - comms.signalPct) * 0.35, 5, 100);
      comms.signalStrengthDbm = clamp(comms.signalStrengthDbm + (-82.4 - comms.signalStrengthDbm) * 0.35, -135, -60);
      comms.downSpeedMbps = clamp(comms.downSpeedMbps + (142.0 - comms.downSpeedMbps) * 0.35, 0.2, 160);
      comms.latencyMs = Math.round(comms.latencyMs + (1280 - comms.latencyMs) * 0.35);
      lifeSupport.o2LevelPct = clamp(lifeSupport.o2LevelPct + (98.4 - lifeSupport.o2LevelPct) * 0.35, 70, 100);
      lifeSupport.cabinPressureKpa = clamp(lifeSupport.cabinPressureKpa + (101.3 - lifeSupport.cabinPressureKpa) * 0.35, 75, 105);
      lifeSupport.co2Ppm = Math.round(lifeSupport.co2Ppm + (412 - lifeSupport.co2Ppm) * 0.35);

      if (nextRecoveryProgress >= 100) {
        nextRecoveryInProgress = false;
        nextActiveEmergency = null;
        power.status = 'NOMINAL';
        propulsion.status = 'NOMINAL';
        thermal.protectionStatus = 'NOMINAL';
        comms.antennaStatus = 'LOCKED (DSN GOLDSTONE)';
        lifeSupport.crewStatus = 'NOMINAL (4 CREW)';
        lifeSupport.filtrationStatus = 'ACTIVE (99.4% EFF)';
      }
    } else {
      // Degrade affected subsystem slightly each tick while emergency is unrecovered
      const code = activeEmergency.code;
      if (code === 'ECLSS-O2-LEAK') {
        lifeSupport.o2LevelPct = clamp(lifeSupport.o2LevelPct - 0.45, 74.0, 100);
        lifeSupport.cabinPressureKpa = clamp(lifeSupport.cabinPressureKpa - 0.32, 80.0, 105);
        lifeSupport.crewStatus = 'EMERGENCY (O2 MASK)';
      } else if (code === 'PROP-OMS-FAIL') {
        propulsion.engineTempC = clamp(propulsion.engineTempC + 6.5, 300, 985);
        thermal.engineTempC = propulsion.engineTempC;
        propulsion.status = 'CRITICAL FAULT';
      } else if (code === 'COMM-DSN-LOSS') {
        comms.signalPct = clamp(comms.signalPct - 1.2, 12, 100);
        comms.downSpeedMbps = clamp(comms.downSpeedMbps - 2.0, 0.4, 150);
        comms.antennaStatus = 'FALLBACK OMNI S-BAND';
      } else if (code === 'EPS-BATT-CRIT') {
        power.batteryPct = clamp(power.batteryPct - 0.6, 18.0, 100);
        power.batteryVoltage = clamp(power.batteryVoltage - 0.25, 92.0, 125);
        power.status = 'CRITICAL BUS SAG';
      } else if (code === 'PROP-FUEL-LEAK') {
        propulsion.fuelRemainingPct = clamp(propulsion.fuelRemainingPct - 0.35, 19.0, 100);
        propulsion.propellantPressurePsi = clamp(propulsion.propellantPressurePsi - 0.8, 210, 350);
        propulsion.status = 'LEAK DETECTED';
      } else if (code === 'ECLSS-CABIN-DEPRESS') {
        lifeSupport.cabinPressureKpa = clamp(lifeSupport.cabinPressureKpa - 0.55, 78.5, 105);
        lifeSupport.co2Ppm = clamp(lifeSupport.co2Ppm + 18, 400, 1450);
        lifeSupport.crewStatus = 'SUIT PRESSURE PREP';
      } else if (code === 'TCS-LOOP-FAIL') {
        thermal.cabinTempC = clamp(thermal.cabinTempC + 0.35, 20, 36.5);
        lifeSupport.cabinTempC = thermal.cabinTempC;
        thermal.protectionStatus = 'LOOP A PUMP FAULT';
      } else if (code === 'GNC-IMU-DRIFT') {
        sc.headingDeg = Number(((sc.headingDeg + 1.4) % 360).toFixed(1));
        sc.accelerationG = Number((0.045 + Math.abs(microJitter()) * 0.04).toFixed(3));
      } else if (code === 'EPS-SAW-FAULT') {
        power.solarOutputKw = clamp(power.solarOutputKw - 0.15, 3.8, 12);
        power.batteryPct = clamp(power.batteryPct - 0.25, 30, 100);
        power.status = 'ARRAY WING 2 STALL';
      } else if (code === 'ORB-CONJ-WARN') {
        sc.accelerationG = Number((0.082 + Math.abs(microJitter()) * 0.03).toFixed(3));
      }
    }
  } else if (!activeEmergency) {
    // Nominal organic telemetry oscillation
    power.batteryPct = Number(clamp(94.2 + Math.sin(phaseAngle) * 0.35 + microJitter() * 0.1, 90, 99.5).toFixed(2));
    power.batteryVoltage = Number(clamp(120.4 + Math.cos(phaseAngle) * 0.25 + microJitter() * 0.1, 118, 122).toFixed(2));
    power.solarOutputKw = Number(clamp(11.4 + Math.sin(phaseAngle * 0.7) * 0.2 + microJitter() * 0.08, 10.5, 12.2).toFixed(2));
    power.powerConsumptionKw = Number(clamp(8.2 + Math.cos(phaseAngle * 0.9) * 0.18 + microJitter() * 0.08, 7.5, 9.1).toFixed(2));

    propulsion.engineTempC = Number(clamp(312.0 + Math.sin(phaseAngle * 0.5) * 2.8 + microJitter() * 0.8, 295, 330).toFixed(1));
    propulsion.propellantPressurePsi = Number(clamp(315.4 + Math.cos(phaseAngle * 0.6) * 1.4 + microJitter() * 0.5, 310, 322).toFixed(1));
    propulsion.fuelRemainingPct = Number(clamp(propulsion.fuelRemainingPct - 0.0005 * simSpeed, 10, 100).toFixed(2));

    thermal.cabinTempC = Number(clamp(21.4 + Math.sin(phaseAngle * 0.4) * 0.15 + microJitter() * 0.05, 20.8, 22.2).toFixed(2));
    thermal.externalTempC = Number(clamp(-118.5 + Math.cos(phaseAngle * 0.3) * 1.1 + microJitter() * 0.4, -125, -110).toFixed(1));
    thermal.engineTempC = propulsion.engineTempC;

    comms.signalStrengthDbm = Number(clamp(-82.4 + Math.sin(phaseAngle * 0.8) * 0.6 + microJitter() * 0.2, -86, -79).toFixed(1));
    comms.signalPct = Number(clamp(96.0 + Math.cos(phaseAngle * 0.8) * 0.9 + microJitter() * 0.3, 92, 99.8).toFixed(1));
    comms.txRateMbps = Number(clamp(48.5 + Math.sin(phaseAngle) * 1.2 + microJitter() * 0.4, 44, 53).toFixed(1));
    comms.downSpeedMbps = Number(clamp(142.0 + Math.cos(phaseAngle) * 2.1 + microJitter() * 0.6, 135, 149).toFixed(1));
    comms.latencyMs = Math.round(clamp(1280 + Math.sin(phaseAngle * 0.5) * 14, 1240, 1340));

    lifeSupport.o2LevelPct = Number(clamp(98.4 + Math.sin(phaseAngle * 0.3) * 0.12 + microJitter() * 0.04, 97.8, 99.2).toFixed(2));
    lifeSupport.cabinPressureKpa = Number(clamp(101.3 + Math.cos(phaseAngle * 0.4) * 0.08 + microJitter() * 0.03, 100.9, 101.7).toFixed(2));
    lifeSupport.cabinTempC = thermal.cabinTempC;
    lifeSupport.co2Ppm = Math.round(clamp(412 + Math.sin(phaseAngle * 0.6) * 7 + microJitter() * 4, 395, 435));
    lifeSupport.waterSupplyPct = Number(clamp(lifeSupport.waterSupplyPct - 0.0003 * simSpeed, 50, 100).toFixed(2));
  }

  // Update spacecraft trajectory position along translunar corridor
  const distIncrementKm = Number((sc.orbitalVelocityKms * simSpeed * 0.85).toFixed(2));
  sc.distanceFromEarthKm = Number(clamp(sc.distanceFromEarthKm + distIncrementKm, 185, 384000).toFixed(1));
  sc.distanceFromMoonKm = Number(clamp(384400 - sc.distanceFromEarthKm, 130, 384200).toFixed(1));
  sc.altitudeKm = Math.round(sc.distanceFromEarthKm - 6371);
  sc.orbitalVelocityKms = Number(clamp(1.48 + Math.sin(phaseAngle * 0.25) * 0.02 + (384400 - sc.distanceFromMoonKm) * 0.0000004, 1.02, 10.9).toFixed(3));
  sc.missionProgressPct = Number(clamp((sc.distanceFromEarthKm / 384400) * 100, 1.0, 99.9).toFixed(1));

  sc.position = {
    x: Math.round(sc.position.x + sc.velocity.vx * simSpeed * 1.2),
    y: Math.round(sc.position.y + sc.velocity.vy * simSpeed * 1.2),
    z: Math.round(sc.position.z + sc.velocity.vz * simSpeed * 1.2),
  };

  // Compute composite health score
  let healthPenalty = 0;
  if (nextActiveEmergency) {
    healthPenalty += nextActiveEmergency.severity === 'EMERGENCY' ? 32 : 18;
  }
  if (lifeSupport.o2LevelPct < 92) healthPenalty += 15;
  if (power.batteryPct < 40) healthPenalty += 15;
  if (propulsion.engineTempC > 600) healthPenalty += 15;

  sc.healthScore = clamp(100 - healthPenalty, 18, 100);
  sc.status = nextActiveEmergency
    ? (nextActiveEmergency.severity === 'EMERGENCY' ? 'CRITICAL' : 'WARNING')
    : 'NOMINAL';

  const snapshot = {
    time: formatMET(nextMet).slice(4),
    met: nextMet,
    batteryPct: power.batteryPct,
    batteryVoltage: power.batteryVoltage,
    solarOutputKw: power.solarOutputKw,
    powerConsumptionKw: power.powerConsumptionKw,
    fuelRemainingPct: propulsion.fuelRemainingPct,
    engineTempC: propulsion.engineTempC,
    propellantPressurePsi: propulsion.propellantPressurePsi,
    cabinTempC: thermal.cabinTempC,
    externalTempC: thermal.externalTempC,
    signalPct: comms.signalPct,
    txRateMbps: comms.txRateMbps,
    downSpeedMbps: comms.downSpeedMbps,
    latencyMs: comms.latencyMs,
    o2LevelPct: lifeSupport.o2LevelPct,
    cabinPressureKpa: lifeSupport.cabinPressureKpa,
    co2Ppm: lifeSupport.co2Ppm,
    waterSupplyPct: lifeSupport.waterSupplyPct,
    velocityKms: sc.orbitalVelocityKms,
    altitudeKm: sc.altitudeKm,
  };

  return {
    metSeconds: nextMet,
    spacecraft: sc,
    telemetry: { power, propulsion, thermal, comms, lifeSupport },
    snapshot,
    activeEmergency: nextActiveEmergency,
    recoveryInProgress: nextRecoveryInProgress,
    recoveryProgress: nextRecoveryProgress,
  };
}
