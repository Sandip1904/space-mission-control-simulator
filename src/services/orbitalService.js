// Illustrative two-body Keplerian orbital mechanics & live planetary Earth-distance propagator
// Clearly distinguished from flight-certified trajectory propagation software
import { PLANETARY_DATA } from '../data/planetaryData';

export const GRAVITATIONAL_MU = {
  EARTH: 398600.4418, // km^3 / s^2
  MOON: 4902.8001,    // km^3 / s^2
};

export const BODY_RADIUS_KM = {
  EARTH: 6378.137,
  MOON: 1737.4,
};

const AU_IN_MILLION_KM = 149.5978707;
const SPEED_OF_LIGHT_MILLION_KM_PER_MIN = 17.98754748; // 299,792.458 km/s * 60 / 10^6

export function computeOrbitalMetrics(params) {
  const {
    centralBody = 'EARTH',
    semiMajorAxisKm = 42164,
    eccentricity = 0.32,
    inclinationDeg = 28.5,
    burnDeltaVMps = 0,
  } = params;

  const mu = GRAVITATIONAL_MU[centralBody] || GRAVITATIONAL_MU.EARTH;
  const bodyRadius = BODY_RADIUS_KM[centralBody] || BODY_RADIUS_KM.EARTH;

  const deltaAFactor = 1 + (burnDeltaVMps / 3200);
  const effectiveA = Math.max(bodyRadius + 300, semiMajorAxisKm * Math.max(0.4, deltaAFactor));
  const clampedE = Math.min(0.85, Math.max(0.0, Number(eccentricity) || 0));

  const periapsisRadiusKm = effectiveA * (1 - clampedE);
  const apoapsisRadiusKm = effectiveA * (1 + clampedE);
  const closestApproachAltitudeKm = Math.max(120, periapsisRadiusKm - bodyRadius);
  const apoapsisAltitudeKm = Math.max(150, apoapsisRadiusKm - bodyRadius);

  const periodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(effectiveA, 3) / mu);
  const periodMinutes = periodSeconds / 60;
  const periodHours = periodSeconds / 3600;

  const vPeriapsisKms = Math.sqrt(mu * (2 / periapsisRadiusKm - 1 / effectiveA));
  const vApoapsisKms = Math.sqrt(mu * (2 / apoapsisRadiusKm - 1 / effectiveA));
  const meanVelocityKms = Math.sqrt(mu / effectiveA);

  return {
    centralBody,
    effectiveSemiMajorAxisKm: effectiveA,
    eccentricity: clampedE,
    inclinationDeg,
    closestApproachAltitudeKm,
    apoapsisAltitudeKm,
    periapsisRadiusKm,
    apoapsisRadiusKm,
    periodMinutes,
    periodHours,
    vPeriapsisKms,
    vApoapsisKms,
    meanVelocityKms,
  };
}

// Compute live simulated heliocentric coordinates and instantaneous distance from Earth for all 15 bodies
export function computePlanetaryDistancesFromEarth(metSeconds = 148320) {
  // Accelerated orbital simulation phase so users can see distances evolve smoothly
  const simPhase = (Number(metSeconds) || 0) * 0.0025;
  const earthBody = PLANETARY_DATA.find((b) => b.id === 'earth');
  const earthAngle = (earthBody?.initialOrbitAngleRad || 0) + simPhase * (earthBody?.orbitalSpeedMultiplier || 1.0);
  const rEarth = earthBody?.distanceMillionKm || 149.6;
  const earthX = Math.cos(earthAngle) * rEarth;
  const earthZ = Math.sin(earthAngle) * rEarth;

  const map = {};
  PLANETARY_DATA.forEach((body) => {
    if (body.id === 'earth') {
      map[body.id] = {
        id: body.id,
        angleRad: earthAngle,
        liveDistanceEarthMillionKm: 0,
        liveDistanceEarthKm: 0,
        liveDistanceEarthAU: 0,
        oneWayLightMinutes: 0,
        radialVelocityKms: 0,
        alignmentPhase: 'ORIGIN REFERENCE',
      };
      return;
    }

    if (body.id === 'sun') {
      const distMillionKm = Number((149.6 + 2.5 * Math.cos(earthAngle)).toFixed(2));
      const distAU = Number((distMillionKm / AU_IN_MILLION_KM).toFixed(4));
      const lightMin = Number((distMillionKm / SPEED_OF_LIGHT_MILLION_KM_PER_MIN).toFixed(2));
      map[body.id] = {
        id: body.id,
        angleRad: 0,
        liveDistanceEarthMillionKm: distMillionKm,
        liveDistanceEarthKm: Math.round(distMillionKm * 1e6),
        liveDistanceEarthAU: distAU,
        oneWayLightMinutes: lightMin,
        radialVelocityKms: Number((0.49 * Math.sin(earthAngle)).toFixed(2)),
        alignmentPhase: 'HELIOCENTRIC CENTER',
      };
      return;
    }

    if (body.id === 'moon') {
      const moonAngle = body.initialOrbitAngleRad + simPhase * body.orbitalSpeedMultiplier;
      const distMillionKm = Number((0.3844 - 0.0211 * Math.cos(moonAngle)).toFixed(4));
      const distKm = Math.round(distMillionKm * 1e6);
      const distAU = Number((distMillionKm / AU_IN_MILLION_KM).toFixed(5));
      const lightMin = Number((distMillionKm / SPEED_OF_LIGHT_MILLION_KM_PER_MIN).toFixed(4));
      map[body.id] = {
        id: body.id,
        angleRad: moonAngle,
        liveDistanceEarthMillionKm: distMillionKm,
        liveDistanceEarthKm: distKm,
        liveDistanceEarthAU: distAU,
        oneWayLightMinutes: lightMin,
        radialVelocityKms: Number((0.08 * Math.sin(moonAngle)).toFixed(3)),
        alignmentPhase: distKm < 375000 ? 'PERIGEE CORRIDOR' : 'CISLUNAR ORBIT',
      };
      return;
    }

    const bodyAngle = body.initialOrbitAngleRad + simPhase * body.orbitalSpeedMultiplier;
    const rBody = body.distanceMillionKm;
    const bx = Math.cos(bodyAngle) * rBody;
    const bz = Math.sin(bodyAngle) * rBody;

    const dx = bx - earthX;
    const dz = bz - earthZ;
    const rawDistMillionKm = Math.hypot(dx, dz);
    const clampedDistMillionKm = Number(
      Math.max(body.earthDistanceMinMillionKm, Math.min(body.earthDistanceMaxMillionKm, rawDistMillionKm)).toFixed(2)
    );
    const distAU = Number((clampedDistMillionKm / AU_IN_MILLION_KM).toFixed(3));
    const lightMin = Number((clampedDistMillionKm / SPEED_OF_LIGHT_MILLION_KM_PER_MIN).toFixed(1));

    const synodicAngleDiff = Math.abs(Math.atan2(Math.sin(bodyAngle - earthAngle), Math.cos(bodyAngle - earthAngle)));
    let alignmentPhase = 'QUADRATURE TRANSIT';
    if (synodicAngleDiff < 0.45) {
      alignmentPhase = 'CLOSEST APPROACH (OPPOSITION)';
    } else if (synodicAngleDiff > 2.65) {
      alignmentPhase = 'SOLAR CONJUNCTION (FAR SIDE)';
    }

    const radialVel = Number((Math.sin(bodyAngle - earthAngle) * 14.2).toFixed(2));

    map[body.id] = {
      id: body.id,
      angleRad: bodyAngle,
      liveDistanceEarthMillionKm: clampedDistMillionKm,
      liveDistanceEarthKm: Math.round(clampedDistMillionKm * 1e6),
      liveDistanceEarthAU: distAU,
      oneWayLightMinutes: lightMin,
      radialVelocityKms: radialVel,
      alignmentPhase,
    };
  });

  return map;
}
