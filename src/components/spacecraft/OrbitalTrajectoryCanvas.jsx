import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useMissionStore } from '../../store/missionStore';

export function OrbitalTrajectoryCanvas() {
  const mountRef = useRef(null);
  const orbitalParams = useMissionStore((s) => s.orbitalParams);
  const simSpeed = useMissionStore((s) => s.simSpeed);
  const missionStatus = useMissionStore((s) => s.missionStatus);

  const stateRef = useRef({ orbitalParams, simSpeed, missionStatus });
  useEffect(() => {
    stateRef.current = { orbitalParams, simSpeed, missionStatus };
  }, [orbitalParams, simSpeed, missionStatus]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const width = container.clientWidth || 760;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020612');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 600);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x94a3b8, 1.1);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(16, 12, 10);
    scene.add(dirLight);

    // Reference Grid Helper
    const gridHelper = new THREE.GridHelper(28, 28, 0x0284c7, 0x1e293b);
    scene.add(gridHelper);

    // Central Body Mesh (Earth or Moon)
    const centralGeo = new THREE.SphereGeometry(2.1, 36, 36);
    const centralMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.65,
      metalness: 0.15,
    });
    const centralMesh = new THREE.Mesh(centralGeo, centralMat);
    scene.add(centralMesh);

    // Orbit Plane Group
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    // Nominal Orbit Line & Predicted Post-Burn Line
    const nominalLineGeo = new THREE.BufferGeometry();
    const nominalLineMat = new THREE.LineBasicMaterial({ color: 0x22d3ee });
    const nominalLine = new THREE.LineLoop(nominalLineGeo, nominalLineMat);
    orbitGroup.add(nominalLine);

    const predictedLineGeo = new THREE.BufferGeometry();
    const predictedLineMat = new THREE.LineDashedMaterial({
      color: 0xf59e0b,
      dashSize: 0.35,
      gapSize: 0.2,
    });
    const predictedLine = new THREE.LineLoop(predictedLineGeo, predictedLineMat);
    orbitGroup.add(predictedLine);

    // Spacecraft Cone Marker + Velocity Vector Arrow
    const scGeo = new THREE.ConeGeometry(0.25, 0.65, 16);
    const scMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x06b6d4, emissiveIntensity: 0.7 });
    const scMesh = new THREE.Mesh(scGeo, scMat);
    orbitGroup.add(scMesh);

    const velocityArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      1.6,
      0x10b981,
      0.32,
      0.2
    );
    orbitGroup.add(velocityArrow);

    // Periapsis Marker
    const periGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const periMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const periMesh = new THREE.Mesh(periGeo, periMat);
    orbitGroup.add(periMesh);

    const camSpherical = { radius: 18, theta: 0.75, phi: 1.05 };
    let isDragging = false;
    let prevPos = { x: 0, y: 0 };

    const onPointerDown = (e) => {
      isDragging = true;
      prevPos = { x: e.clientX, y: e.clientY };
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevPos.x;
      const dy = e.clientY - prevPos.y;
      prevPos = { x: e.clientX, y: e.clientY };
      camSpherical.theta -= dx * 0.006;
      camSpherical.phi = Math.max(0.15, Math.min(Math.PI - 0.15, camSpherical.phi - dy * 0.006));
    };
    const onPointerUp = () => {
      isDragging = false;
    };
    const onWheel = (e) => {
      e.preventDefault();
      camSpherical.radius = Math.max(7, Math.min(36, camSpherical.radius + e.deltaY * 0.02));
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 760;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let reqId;
    let trueAnomaly = 0;

    const animate = () => {
      reqId = window.requestAnimationFrame(animate);
      const { orbitalParams: p, simSpeed: spd, missionStatus: status } = stateRef.current;

      gridHelper.visible = Boolean(p.showGrid);
      nominalLine.visible = Boolean(p.showPredictedPath);
      predictedLine.visible = Boolean(p.showPredictedPath && Math.abs(p.burnDeltaVMps) > 5);

      centralMat.color.setHex(p.centralBody === 'MOON' ? 0x94a3b8 : 0x2563eb);
      const bodyScale = p.centralBody === 'MOON' ? 0.72 : 1.0;
      centralMesh.scale.set(bodyScale, bodyScale, bodyScale);

      // Visual semi-major axis & eccentricity
      const aVisual = Math.max(3.6, Math.min(11.5, (p.semiMajorAxisKm / 42164) * 6.5));
      const e = Math.min(0.8, Math.max(0, Number(p.eccentricity) || 0));
      const bVisual = aVisual * Math.sqrt(1 - e * e);
      const cFocus = aVisual * e;

      // Update nominal orbit curve points
      const pts = [];
      for (let i = 0; i <= 96; i++) {
        const ang = (i / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(ang) * aVisual - cFocus, 0, Math.sin(ang) * bVisual));
      }
      nominalLineGeo.setFromPoints(pts);

      // Update predicted post-burn ellipse
      const burnFactor = Math.max(0.55, 1 + p.burnDeltaVMps / 2400);
      const aPred = aVisual * burnFactor;
      const bPred = aPred * Math.sqrt(1 - e * e);
      const cPred = aPred * e;
      const predPts = [];
      for (let i = 0; i <= 96; i++) {
        const ang = (i / 96) * Math.PI * 2;
        predPts.push(new THREE.Vector3(Math.cos(ang) * aPred - cPred, 0, Math.sin(ang) * bPred));
      }
      predictedLineGeo.setFromPoints(predPts);
      predictedLine.computeLineDistances();

      // Rotate orbital plane by inclination & argument of perigee
      orbitGroup.rotation.x = (p.inclinationDeg * Math.PI) / 180;
      orbitGroup.rotation.y = (p.argPerigeeDeg * Math.PI) / 180;

      // Advance spacecraft along ellipse (faster near periapsis)
      const dt = status === 'PAUSED' || status === 'ABORTED' ? 0 : 0.012 * Math.min(spd, 12);
      const rCurrent = Math.max(1.5, aVisual * (1 - e * Math.cos(trueAnomaly)));
      trueAnomaly = (trueAnomaly + dt * (5.5 / rCurrent)) % (Math.PI * 2);

      const scX = Math.cos(trueAnomaly) * aPred - cPred;
      const scZ = Math.sin(trueAnomaly) * bPred;
      scMesh.position.set(scX, 0, scZ);

      // Tangent velocity vector
      const tangent = new THREE.Vector3(-Math.sin(trueAnomaly) * aPred, 0, Math.cos(trueAnomaly) * bPred).normalize();
      velocityArrow.position.set(scX, 0, scZ);
      velocityArrow.setDirection(tangent);

      // Periapsis point (ang = 0)
      periMesh.position.set(aPred - cPred, 0, 0);

      // Camera positioning based on cameraMode
      if (p.cameraMode === 'TOP') {
        camera.position.set(0, 22, 0.01);
        camera.lookAt(0, 0, 0);
      } else if (p.cameraMode === 'SIDE') {
        camera.position.set(0, 1.5, 22);
        camera.lookAt(0, 0, 0);
      } else if (p.cameraMode === 'FOLLOW') {
        const worldSc = new THREE.Vector3();
        scMesh.getWorldPosition(worldSc);
        camera.position.set(worldSc.x + 5, worldSc.y + 4, worldSc.z + 5);
        camera.lookAt(worldSc);
      } else {
        camera.position.set(
          camSpherical.radius * Math.sin(camSpherical.phi) * Math.cos(camSpherical.theta),
          camSpherical.radius * Math.cos(camSpherical.phi),
          camSpherical.radius * Math.sin(camSpherical.phi) * Math.sin(camSpherical.theta)
        );
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(reqId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      [centralGeo, centralMat, nominalLineGeo, nominalLineMat, predictedLineGeo, predictedLineMat, scGeo, scMat, periGeo, periMat].forEach(
        (d) => d.dispose()
      );
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[430px] lg:h-[500px] rounded-lg overflow-hidden border border-sky-500/25 bg-[#020612]">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-3 left-3 pointer-events-none bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded border border-cyan-500/30 text-[11px] font-mono space-y-0.5">
        <div className="text-cyan-300 font-bold">
          KEPLERIAN TWO-BODY ORBITAL PROPAGATOR ({orbitalParams.centralBody}-CENTERED)
        </div>
        <div className="text-slate-400">
          Cyan: Baseline Orbit • Amber Dashed: Post-Burn Trajectory • Green Vector: Velocity Direction
        </div>
        <div className="text-[10px] text-amber-300/90">
          Illustrative Keplerian Conic Approximation — Not Flight-Certified N-Body Ephemeris Software
        </div>
      </div>
    </div>
  );
}
