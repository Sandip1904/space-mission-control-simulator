// 10 Interactive Mission Emergency & Failure Scenarios

export const FAILURE_SCENARIOS = [
  {
    id: 'SCEN-01',
    code: 'ECLSS-O2-LEAK',
    name: 'Oxygen Leakage',
    subsystem: 'LIFE SUPPORT',
    severity: 'EMERGENCY',
    initialConditions: 'Micrometeoroid impact on Service Module umbilical bay Tank-B manifold valve.',
    description: 'Rapid depressurization of primary gaseous O₂ manifold causing continuous depletion of breathable cabin oxygen and reserve tank pressure.',
    systemImpact: [
      'O₂ concentration drops by ~1.2% per simulation tick toward hypoxic threshold (<88%).',
      'Cabin pressure decays below 92 kPa nominal floor.',
      'Crew environment shifts to EMERGENCY; automated ECLSS alarm triggered.'
    ],
    warningMessages: [
      'MASTER ALARM: O₂ MANIFOLD B DELTA-P EXCEEDS LIMIT (-0.42 kPa/s)',
      'ECLSS WARNING: CABIN PARTIAL PRESSURE O₂ APPROACHING HYPOXIA LIMIT'
    ],
    timeline: [
      { t: 'T+00s', event: 'Acoustic sensor detects hull valve micro-fracture in Bay 4.' },
      { t: 'T+15s', event: 'Primary O₂ tank pressure drops below 92% nominal threshold.' },
      { t: 'T+45s', event: 'Secondary N₂/O₂ mixing controller commands emergency flow boost.' },
      { t: 'T+90s', event: 'Isolation latch valve closure required to prevent full reserve exhaustion.' }
    ],
    recoveryOptions: [
      'Isolate Bay 4 O₂ Manifold B via pyro-latch valve closure.',
      'Switch crew umbilical supply to Tank-A redundant feed loop.',
      'Repressurize cabin atmosphere from High-Pressure Emergency O₂ Reserve.'
    ],
    telemetryDelta: {
      o2LevelPct: -14.5,
      cabinPressureKpa: -11.8
    }
  },
  {
    id: 'SCEN-02',
    code: 'PROP-OMS-FAIL',
    name: 'Engine Failure',
    subsystem: 'PROPULSION',
    severity: 'EMERGENCY',
    initialConditions: 'Turbopump cavitation and injector thermal spike during scheduled trajectory trim burn.',
    description: 'Main Orbital Maneuvering System (OMS-E) engine experiences chamber over-temperature and automatic thrust cut-off.',
    systemImpact: [
      'Engine temperature spikes above 920 °C critical limit.',
      'Main engine thrust drops to 0.0 kN; propellant feed pressure fluctuates wildly.',
      'Trajectory trim burn aborted; auxiliary RCS thrusters required for attitude hold.'
    ],
    warningMessages: [
      'PROPULSION CRITICAL: OMS-E COMBUSTION CHAMBER OVER-TEMP (>915 °C)',
      'FLIGHT CONTROL: AUTO-CUTOFF TRIGGERED ON PRIMARY THRUSTER BANK'
    ],
    timeline: [
      { t: 'T+00s', event: 'Injector nozzle B3 thermocouple spikes to 940 °C.' },
      { t: 'T+08s', event: 'Turbopump vibration exceeds 4.8g safety envelope.' },
      { t: 'T+12s', event: 'Flight computer commands emergency propellant cutoff.' },
      { t: 'T+60s', event: 'Helium purge sequence armed for auxiliary thruster failover.' }
    ],
    recoveryOptions: [
      'Close primary oxidizer/fuel main shutoff valves and initiate Helium purge.',
      'Enable radiative cooling loop across aft engine bell.',
      'Reconfigure Flight Control System to Auxiliary RCS Thruster Quad A/C.'
    ],
    telemetryDelta: {
      engineTempC: 615.0,
      thrustKn: 0,
      propellantPressurePsi: -95.0
    }
  },
  {
    id: 'SCEN-03',
    code: 'COMM-DSN-LOSS',
    name: 'Communication Loss',
    subsystem: 'COMMUNICATION',
    severity: 'CRITICAL',
    initialConditions: 'High-gain phased-array gimbal lock fault combined with X-band solar scintillation.',
    description: 'Loss of High-Gain Antenna (HGA) lock with Deep Space Network Goldstone 70m dish, dropping telemetry downlink to low-rate omni S-band.',
    systemImpact: [
      'Signal strength drops from -82 dBm to -126 dBm (18% link margin).',
      'Downlink speed collapses from 142 Mbps to 0.4 Mbps emergency beacon.',
      'Command latency spikes above 4,800 ms.'
    ],
    warningMessages: [
      'COMM ALERT: HIGH-GAIN ANTENNA GIMBAL AZIMUTH LOCK LOST',
      'DSN DOWNLINK: CARRIER LOCK DEGRADED — FALLBACK TO OMNI S-BAND'
    ],
    timeline: [
      { t: 'T+00s', event: 'HGA Boresight error exceeds 1.85° Ka-band beamwidth.' },
      { t: 'T+10s', event: 'High-rate science and video downlink buffer overflow.' },
      { t: 'T+30s', event: 'Transponder switches to Low-Gain Omni Antenna.' },
      { t: 'T+75s', event: 'Secondary gimbal motor driver warm-reset required.' }
    ],
    recoveryOptions: [
      'Switch RF routing matrix to Medium-Gain / Omni S-Band backup antenna.',
      'Power-cycle HGA Dual-Gimbal Motor Controller B.',
      'Execute automated DSN Canberra 70m handover sweep.'
    ],
    telemetryDelta: {
      signalStrengthDbm: -44.0,
      signalPct: -78.0,
      txRateMbps: -46.0,
      downSpeedMbps: -139.0,
      latencyMs: 3600
    }
  },
  {
    id: 'SCEN-04',
    code: 'EPS-BATT-CRIT',
    name: 'Battery Critical',
    subsystem: 'POWER',
    severity: 'EMERGENCY',
    initialConditions: 'Main Power Distribution Unit (PDU-2) bus short and Li-Ion Battery Pack 3 cell under-voltage.',
    description: 'Rapid discharge on Main Bus B drops spacecraft battery charge below critical 28% reserve threshold with bus voltage sag.',
    systemImpact: [
      'Battery state-of-charge plunges below 26%; bus voltage sags to 96.4 V.',
      'Power consumption exceeds solar generation by 5.8 kW.',
      'Non-essential payload heaters and science racks risk brownout.'
    ],
    warningMessages: [
      'EPS EMERGENCY: MAIN BUS B VOLTAGE SAG (<102.0 V)',
      'BATTERY CRITICAL: STATE OF CHARGE BELOW 28% SAFE FLOOR'
    ],
    timeline: [
      { t: 'T+00s', event: 'PDU-2 solid-state power controller detects 42A parasitic fault.' },
      { t: 'T+20s', event: 'Battery Pack 3 cell balancing circuit trips offline.' },
      { t: 'T+45s', event: 'Main bus voltage drops below 100V nominal regulation.' },
      { t: 'T+80s', event: 'Automated non-essential load shedding required.' }
    ],
    recoveryOptions: [
      'Trip SSPC breaker B-14 to isolate shorted PDU-2 load path.',
      'Execute Level-2 Non-Essential Load Shedding (science & galley buses).',
      'Cross-tie Solar Array Wing A directly to Essential Bus A/B.'
    ],
    telemetryDelta: {
      batteryPct: -68.0,
      batteryVoltage: -24.0,
      powerConsumptionKw: 6.4
    }
  },
  {
    id: 'SCEN-05',
    code: 'PROP-FUEL-LEAK',
    name: 'Fuel Leakage',
    subsystem: 'PROPULSION',
    severity: 'CRITICAL',
    initialConditions: 'Monomethylhydrazine (MMH) feedline check-valve seal degradation in Reaction Control Quad D.',
    description: 'Uncommanded propellant venting through RCS Quad D manifold reduces maneuvering delta-V margin and imparts minor attitude torque.',
    systemImpact: [
      'Fuel remaining drops steadily toward 24% reserve warning threshold.',
      'Propellant manifold pressure drops by 88 PSI.',
      'Attitude control system fires counter-thrusters to cancel parasitic torque.'
    ],
    warningMessages: [
      'PROPULSION WARNING: RCS QUAD-D FUEL MANIFOLD MASS IMBALANCE',
      'DELTA-V MARGIN ALERT: PROPELLANT RESERVE BELOW MISSION NOMINAL'
    ],
    timeline: [
      { t: 'T+00s', event: 'Optical plume sensor detects vapor trace near Quad D.' },
      { t: 'T+25s', event: 'MMH tank quantity gauge drops 18% below flight plan curve.' },
      { t: 'T+50s', event: 'Attitude control rate gyros register 0.14 deg/s drift.' },
      { t: 'T+90s', event: 'Quad D manifold isolation valve command queued.' }
    ],
    recoveryOptions: [
      'Close RCS Quad-D upstream propellant latch valve.',
      'Cross-feed remaining MMH propellant to primary tank reservoir.',
      'Update GNC thruster mixing table for 3-Quad control authority.'
    ],
    telemetryDelta: {
      fuelRemainingPct: -54.0,
      propellantPressurePsi: -88.0
    }
  },
  {
    id: 'SCEN-06',
    code: 'ECLSS-CABIN-DEPRESS',
    name: 'Cabin Pressure Drop',
    subsystem: 'LIFE SUPPORT',
    severity: 'EMERGENCY',
    initialConditions: 'Forward docking hatch perimeter seal thermal contraction leak.',
    description: 'Total cabin atmospheric pressure drops rapidly from 101.3 kPa toward 82.0 kPa, requiring immediate seal pressurization and N₂/O₂ makeup feed.',
    systemImpact: [
      'Cabin pressure falls below 84 kPa emergency threshold.',
      'Oxygen partial pressure drops concurrently.',
      'Crew suit-donning advisory triggered if pressure falls under 80 kPa.'
    ],
    warningMessages: [
      'MASTER ALARM: CABIN DEPRESSURIZATION DETECTED (83.2 kPa)',
      'ECLSS ACTION: ACTIVATE FORWARD HATCH SEAL REPRESSURIZATION'
    ],
    timeline: [
      { t: 'T+00s', event: 'Barometric transducers A/B/C vote rapid negative dP/dt.' },
      { t: 'T+15s', event: 'Cabin pressure crosses 90 kPa warning threshold.' },
      { t: 'T+40s', event: 'Emergency N₂/O₂ feed valves open at 50% duty cycle.' },
      { t: 'T+75s', event: 'Secondary bladder seal inflation required on forward hatch.' }
    ],
    recoveryOptions: [
      'Energize secondary pneumatic bladder seal on Forward Docking Hatch.',
      'Command High-Flow N₂/O₂ Repressurization Valve open to 101.3 kPa.',
      'Verify hull integrity across all 12 acoustic transducer zones.'
    ],
    telemetryDelta: {
      cabinPressureKpa: -18.5,
      o2LevelPct: -8.2
    }
  },
  {
    id: 'SCEN-07',
    code: 'TCS-LOOP-FAIL',
    name: 'Thermal System Failure',
    subsystem: 'THERMAL',
    severity: 'CRITICAL',
    initialConditions: 'Primary Glycol/Water Coolant Loop A circulation pump impeller seizure.',
    description: 'Loss of active fluid heat rejection causes avionics bay and crew cabin temperatures to climb rapidly above safe limits.',
    systemImpact: [
      'Cabin temperature rises from 21.4 °C to 32.8 °C.',
      'Avionics cold-plate and engine bay temperatures climb.',
      'Thermal protection status degrades to CRITICAL.'
    ],
    warningMessages: [
      'THERMAL CRITICAL: COOLANT LOOP A FLOW RATE ZERO (0.0 kg/min)',
      'CABIN ENVIRONMENT: TEMPERATURE EXCEEDS 28.0 °C COMFORT/SAFETY LIMIT'
    ],
    timeline: [
      { t: 'T+00s', event: 'Pump A tachometer drops to 0 RPM; differential pressure lost.' },
      { t: 'T+20s', event: 'Avionics cold-plate temperature rises +9.4 °C.' },
      { t: 'T+45s', event: 'Cabin air heat exchanger outlet exceeds 31 °C.' },
      { t: 'T+80s', event: 'Switchover to Redundant Coolant Loop B required.' }
    ],
    recoveryOptions: [
      'Engage Redundant Coolant Pump Loop B and open bypass mixing valves.',
      'Deploy supplemental ammonia flash evaporator for peak heat load.',
      'Re-orient spacecraft roll angle +35° to place radiator panels in deep-space shade.'
    ],
    telemetryDelta: {
      cabinTempC: 11.4,
      externalTempC: 42.0,
      engineTempC: 210.0
    }
  },
  {
    id: 'SCEN-08',
    code: 'GNC-IMU-DRIFT',
    name: 'Navigation System Failure',
    subsystem: 'NAVIGATION',
    severity: 'CRITICAL',
    initialConditions: 'Solar energetic particle (SEP) single-event upset in Inertial Measurement Unit #1 and Star Tracker A blinding.',
    description: 'Disagreement between IMU-1 and IMU-2 state vectors causes heading oscillation and attitude divergence from planned translunar corridor.',
    systemImpact: [
      'Spacecraft heading drifts off nominal 128.4° vector by +34°.',
      'Orbital velocity vector shows uncommanded cross-track deviation.',
      'Auto-pilot drops from Precision Lunar Corridor mode to Attitude Hold.'
    ],
    warningMessages: [
      'GNC CRITICAL: IMU-1 / IMU-2 KALMAN FILTER RESIDUAL EXCEEDED',
      'NAVIGATION: STAR TRACKER A OCCULTED / ATTITUDE VECTOR DIVERGENCE'
    ],
    timeline: [
      { t: 'T+00s', event: 'Proton flux spike triggers parity fault in IMU-1 ring laser gyro.' },
      { t: 'T+15s', event: 'Kalman navigation filter rejects Star Tracker A quaternion.' },
      { t: 'T+35s', event: 'Heading drifts 34° off translunar trajectory vector.' },
      { t: 'T+70s', event: 'Optical navigation realignment with IMU-3 required.' }
    ],
    recoveryOptions: [
      'Deselect faulted IMU-1 from Redundant Inertial Navigation set and promote IMU-3.',
      'Acquire optical star-fix using Star Tracker B and Horizon Sensor.',
      'Execute 1.2 m/s RCS attitude trim to restore nominal heading vector.'
    ],
    telemetryDelta: {
      headingDeg: 34.2,
      accelerationG: 0.048
    }
  },
  {
    id: 'SCEN-09',
    code: 'EPS-SAW-FAULT',
    name: 'Solar Panel Malfunction',
    subsystem: 'POWER',
    severity: 'WARNING',
    initialConditions: 'Solar Array Wing #2 beta-gimbal rotary joint actuator jam and string shunt regulator trip.',
    description: 'Solar Array Wing #2 fails to track solar incidence angle, cutting photovoltaic power generation by more than 62%.',
    systemImpact: [
      'Solar panel output drops from 11.4 kW to 4.1 kW.',
      'Net power balance turns negative (-4.1 kW deficit); batteries begin discharging.',
      'Electrical subsystem enters power conservation caution state.'
    ],
    warningMessages: [
      'EPS WARNING: SOLAR ARRAY WING 2 BETA GIMBAL DRIVE STALL',
      'POWER DEFICIT: SOLAR OUTPUT (4.1 kW) BELOW BUS LOAD (8.2 kW)'
    ],
    timeline: [
      { t: 'T+00s', event: 'SAW-2 gimbal motor current spikes to 8.5A stall limit.' },
      { t: 'T+20s', event: 'Sun incidence angle on Wing 2 degrades to 68° off-normal.' },
      { t: 'T+45s', event: 'Array output drops to 4.1 kW; battery discharge initiated.' },
      { t: 'T+90s', event: 'Secondary actuator drive clutch engagement required.' }
    ],
    recoveryOptions: [
      'Switch Solar Array Drive Assembly (SADA-2) to redundant motor winding B.',
      'Reset sequential shunt unit (SSU) strings 4 through 8.',
      'Command 0.4°/s sun-tracking slew to restore 90° solar incidence.'
    ],
    telemetryDelta: {
      solarOutputKw: -7.3,
      batteryPct: -18.0
    }
  },
  {
    id: 'SCEN-10',
    code: 'ORB-CONJ-WARN',
    name: 'Satellite Collision Warning',
    subsystem: 'NAVIGATION',
    severity: 'EMERGENCY',
    initialConditions: 'Tracked orbital debris fragment (DEBRIS-COSMOS-FRAG-44) enters 2.5 km conjunction red-box.',
    description: 'High-velocity conjunction trajectory detected with Probability of Collision (Pc) > 1.4 × 10⁻³, requiring immediate Debris Avoidance Maneuver (DAM).',
    systemImpact: [
      'Conjunction Red-Box alert triggered across Navigation and Satellite Tracking.',
      'Spacecraft status set to CRITICAL; automated collision avoidance burn armed.',
      'Relative closing velocity calculated at 11.4 km/s.'
    ],
    warningMessages: [
      'CONJUNCTION RED ALERT: DEBRIS-COSMOS-FRAG-44 MISS DISTANCE < 640m',
      'GNC ACTION REQUIRED: EXECUTE +2.8 m/s PROGRADE AVOIDANCE BURN'
    ],
    timeline: [
      { t: 'T+00s', event: 'Space Surveillance Network uploads conjunction data message (CDM).' },
      { t: 'T+15s', event: 'Onboard radar skin-track confirms radial closing rate 11.4 km/s.' },
      { t: 'T+40s', event: 'Crew secures cabin; thrusters armed for posigrade avoidance burn.' },
      { t: 'T+75s', event: 'Delta-V burn raises perigee by +4.8 km clear of debris corridor.' }
    ],
    recoveryOptions: [
      'orient spacecraft to Prograde Burn attitude and arm Aux Thrusters.',
      'Execute +2.8 m/s Debris Avoidance Maneuver (DAM) burn for 14 seconds.',
      'Verify post-burn ephemeris clearance (>15 km radial separation).'
    ],
    telemetryDelta: {
      accelerationG: 0.085,
      fuelRemainingPct: -4.2
    }
  }
];
