import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PLANETARY_DATA } from '../../data/planetaryData';
import { useMissionStore } from '../../store/missionStore';

function createPlanetTexture(planet) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, planet.colorPrimary);
  grad.addColorStop(0.5, planet.colorSecondary);
  grad.addColorStop(1, planet.colorPrimary);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  if (planet.id === 'earth') {
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = '#15803d';
    const blobs = [
      [90, 75, 55, 40],
      [130, 155, 38, 52],
      [255, 65, 48, 35],
      [270, 130, 42, 55],
      [355, 80, 75, 45],
      [410, 175, 36, 26],
    ];
    blobs.forEach(([x, y, rx, ry]) => {
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, 0.2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = 'rgba(248, 250, 252, 0.85)';
    ctx.fillRect(0, 0, 512, 16);
    ctx.fillRect(0, 240, 512, 16);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 18; i++) {
      ctx.fillRect((i * 47) % 480, (i * 29) % 230, 55, 6);
    }
  } else if (planet.id === 'jupiter' || planet.id === 'saturn') {
    for (let y = 0; y < 256; y += 12) {
      ctx.fillStyle = y % 24 === 0 ? planet.colorPrimary : planet.colorSecondary;
      ctx.globalAlpha = 0.65;
      ctx.fillRect(0, y, 512, 10);
    }
    ctx.globalAlpha = 1.0;
    if (planet.id === 'jupiter') {
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.ellipse(320, 155, 28, 16, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (planet.id === 'sun') {
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(254, 240, 138, 0.35)' : 'rgba(234, 88, 12, 0.35)';
      ctx.beginPath();
      ctx.arc((i * 73) % 512, (i * 41) % 256, 8 + (i % 14), 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (planet.id === 'pluto') {
    // Heart-shaped Tombaugh Regio氮 glacier feature
    ctx.fillStyle = '#f5f5f4';
    ctx.beginPath();
    ctx.ellipse(256, 132, 42, 34, -0.2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    for (let i = 0; i < 45; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(15, 23, 42, 0.22)' : 'rgba(255, 255, 255, 0.14)';
      ctx.beginPath();
      ctx.arc((i * 67) % 512, (i * 53) % 256, 4 + (i % 12), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function SolarSystemCanvas({ cameraResetTrigger }) {
  const mountRef = useRef(null);
  const selectedPlanetId = useMissionStore((s) => s.selectedPlanetId);
  const setSelectedPlanetId = useMissionStore((s) => s.setSelectedPlanetId);
  const followSpacecraft = useMissionStore((s) => s.followSpacecraftCamera);
  const showEarthDistanceVector = useMissionStore((s) => s.showEarthDistanceVector);
  const planetaryDistances = useMissionStore((s) => s.planetaryDistances);
  const simSpeed = useMissionStore((s) => s.simSpeed);
  const missionStatus = useMissionStore((s) => s.missionStatus);

  const [hoveredBody, setHoveredBody] = useState(null);

  const stateRef = useRef({
    selectedPlanetId,
    followSpacecraft,
    showEarthDistanceVector,
    planetaryDistances,
    simSpeed,
    missionStatus,
  });

  useEffect(() => {
    stateRef.current = {
      selectedPlanetId,
      followSpacecraft,
      showEarthDistanceVector,
      planetaryDistances,
      simSpeed,
      missionStatus,
    };
  }, [selectedPlanetId, followSpacecraft, showEarthDistanceVector, planetaryDistances, simSpeed, missionStatus]);

  const cameraSphericalRef = useRef({
    radius: 62,
    theta: 0.65,
    phi: 1.05,
    target: new THREE.Vector3(0, 0, 0),
  });

  useEffect(() => {
    cameraSphericalRef.current = {
      radius: 62,
      theta: 0.65,
      phi: 1.05,
      target: new THREE.Vector3(0, 0, 0),
    };
  }, [cameraResetTrigger]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#02050d');

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1800);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x94a3b8, 0.9);
    scene.add(ambientLight);
    const sunLight = new THREE.PointLight(0xfffbeb, 3.4, 500, 0.35);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Starfield background
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2400;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 210 + Math.random() * 320;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(p) * Math.cos(t);
      starPositions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      starPositions[i * 3 + 2] = r * Math.cos(p);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xe2e8f0, size: 0.65, transparent: true, opacity: 0.85 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const disposables = [starGeo, starMat];
    const bodyMeshes = {};
    const clickableMeshes = [];

    // Create all 15 Celestial Bodies (Major Planets, Dwarf Planets, Sun & Moon)
    PLANETARY_DATA.forEach((p) => {
      const tex = createPlanetTexture(p);
      disposables.push(tex);
      const geo = new THREE.SphereGeometry(p.visualRadius, 32, 32);
      const mat = p.id === 'sun'
        ? new THREE.MeshBasicMaterial({ map: tex })
        : new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.68,
            metalness: 0.12,
          });
      disposables.push(geo, mat);

      const mesh = new THREE.Mesh(geo, mat);
      if (p.id === 'haumea') {
        mesh.scale.set(1.35, 0.85, 0.95); // triaxial ellipsoid shape
      }
      mesh.userData = { bodyId: p.id, bodyName: p.name, bodyData: p };
      scene.add(mesh);
      clickableMeshes.push(mesh);

      if (p.id === 'sun' || p.id === 'earth') {
        const glowGeo = new THREE.SphereGeometry(p.visualRadius * (p.id === 'sun' ? 1.24 : 1.16), 24, 24);
        const glowMat = new THREE.MeshBasicMaterial({
          color: p.id === 'sun' ? 0xf59e0b : 0x38bdf8,
          transparent: true,
          opacity: p.id === 'sun' ? 0.24 : 0.22,
          side: THREE.BackSide,
        });
        disposables.push(glowGeo, glowMat);
        mesh.add(new THREE.Mesh(glowGeo, glowMat));
      }

      if (p.id === 'saturn' || p.id === 'haumea') {
        const ringGeo = new THREE.RingGeometry(p.ringInnerRadius || 1.2, p.ringOuterRadius || 2.0, 64);
        const ringMat = new THREE.MeshBasicMaterial({
          color: p.id === 'saturn' ? 0xfde047 : 0xe2e8f0,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: p.id === 'saturn' ? 0.65 : 0.45,
        });
        disposables.push(ringGeo, ringMat);
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.2;
        mesh.add(ringMesh);
      }

      if (p.visualOrbitRadius > 0 && !p.isMoonOf) {
        const orbitPts = [];
        for (let i = 0; i <= 128; i++) {
          const a = (i / 128) * Math.PI * 2;
          orbitPts.push(new THREE.Vector3(Math.cos(a) * p.visualOrbitRadius, 0, Math.sin(a) * p.visualOrbitRadius));
        }
        const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPts);
        const isDwarf = p.bodyType === 'DWARF PLANET';
        const orbitMat = new THREE.LineBasicMaterial({
          color: p.id === 'earth' ? 0x22d3ee : isDwarf ? 0x6366f1 : 0x1e3a8a,
          transparent: true,
          opacity: p.id === 'earth' ? 0.7 : isDwarf ? 0.32 : 0.38,
        });
        disposables.push(orbitGeo, orbitMat);
        scene.add(new THREE.LineLoop(orbitGeo, orbitMat));
      }

      bodyMeshes[p.id] = {
        mesh,
        data: p,
        angle: p.initialOrbitAngleRad || 0,
      };
    });

    // Live 3D Earth-to-Selected-Planet Distance Vector Line
    const earthVectorGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(1, 0, 1),
    ]);
    const earthVectorMat = new THREE.LineDashedMaterial({
      color: 0x10b981,
      dashSize: 0.9,
      gapSize: 0.45,
    });
    const earthVectorLine = new THREE.Line(earthVectorGeo, earthVectorMat);
    scene.add(earthVectorLine);
    disposables.push(earthVectorGeo, earthVectorMat);

    // Orion Spacecraft Marker
    const scGroup = new THREE.Group();
    const scBodyGeo = new THREE.ConeGeometry(0.28, 0.7, 16);
    const scBodyMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x0891b2, emissiveIntensity: 0.6 });
    const scWingGeo = new THREE.BoxGeometry(1.15, 0.04, 0.22);
    const scWingMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x1d4ed8, emissiveIntensity: 0.4 });
    disposables.push(scBodyGeo, scBodyMat, scWingGeo, scWingMat);

    const scCone = new THREE.Mesh(scBodyGeo, scBodyMat);
    scCone.rotation.x = Math.PI / 2;
    const scWings = new THREE.Mesh(scWingGeo, scWingMat);
    scGroup.add(scCone);
    scGroup.add(scWings);
    scene.add(scGroup);

    let isDragging = false;
    let prevPos = { x: 0, y: 0 };
    let downPos = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onPointerDown = (e) => {
      isDragging = true;
      prevPos = { x: e.clientX, y: e.clientY };
      downPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const dx = e.clientX - prevPos.x;
        const dy = e.clientY - prevPos.y;
        prevPos = { x: e.clientX, y: e.clientY };
        cameraSphericalRef.current.theta -= dx * 0.006;
        cameraSphericalRef.current.phi = Math.max(0.2, Math.min(Math.PI - 0.2, cameraSphericalRef.current.phi - dy * 0.006));
        return;
      }

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickableMeshes, false);
      if (hits.length > 0) {
        const b = hits[0].object.userData.bodyData;
        const liveInfo = stateRef.current.planetaryDistances?.[b.id];
        setHoveredBody({
          id: b.id,
          name: b.name,
          category: b.category,
          distanceSun: b.distanceFromSun,
          distanceEarthMillionKm: liveInfo ? liveInfo.liveDistanceEarthMillionKm : 0,
          distanceEarthAU: liveInfo ? liveInfo.liveDistanceEarthAU : 0,
          lightMinutes: liveInfo ? liveInfo.oneWayLightMinutes : 0,
          temp: b.surfaceTemp,
        });
        renderer.domElement.style.cursor = 'pointer';
      } else {
        setHoveredBody(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const onPointerUp = (e) => {
      isDragging = false;
      const moveDist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (moveDist < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(clickableMeshes, false);
        if (hits.length > 0) {
          const hitId = hits[0].object.userData.bodyId;
          if (hitId) setSelectedPlanetId(hitId);
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      cameraSphericalRef.current.radius = Math.max(8, Math.min(180, cameraSphericalRef.current.radius + e.deltaY * 0.04));
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let reqId;
    let clockTime = 0;

    const animate = () => {
      reqId = window.requestAnimationFrame(animate);
      const {
        simSpeed: spd,
        missionStatus: status,
        followSpacecraft: followSc,
        selectedPlanetId: selId,
        showEarthDistanceVector: showVec,
        planetaryDistances: pDist,
      } = stateRef.current;

      const dt = status === 'PAUSED' || status === 'ABORTED' ? 0 : 0.004 * Math.min(spd, 10);
      clockTime += dt;

      // Update planets using synchronized angles from planetaryDistances when available
      Object.values(bodyMeshes).forEach((entry) => {
        const { mesh, data } = entry;
        mesh.rotation.y += 0.008;

        if (data.id === 'sun') {
          mesh.position.set(0, 0, 0);
        } else if (data.isMoonOf === 'earth') {
          const earthPos = bodyMeshes.earth.mesh.position;
          entry.angle += dt * data.orbitalSpeedMultiplier * 0.6;
          mesh.position.set(
            earthPos.x + Math.cos(entry.angle) * data.visualOrbitRadius,
            0.25 * Math.sin(entry.angle),
            earthPos.z + Math.sin(entry.angle) * data.visualOrbitRadius
          );
        } else {
          const storeAngle = pDist?.[data.id]?.angleRad;
          entry.angle = typeof storeAngle === 'number'
            ? storeAngle + clockTime * data.orbitalSpeedMultiplier * 0.25
            : entry.angle + dt * data.orbitalSpeedMultiplier * 0.35;
          mesh.position.set(
            Math.cos(entry.angle) * data.visualOrbitRadius,
            0,
            Math.sin(entry.angle) * data.visualOrbitRadius
          );
        }
      });

      // Update Earth-to-Selected-Planet 3D Telemetry Vector Line
      if (showVec && selId && selId !== 'earth' && bodyMeshes.earth && bodyMeshes[selId]) {
        earthVectorLine.visible = true;
        const ePos = bodyMeshes.earth.mesh.position;
        const tPos = bodyMeshes[selId].mesh.position;
        earthVectorGeo.setFromPoints([ePos.clone(), tPos.clone()]);
        earthVectorLine.computeLineDistances();
      } else {
        earthVectorLine.visible = false;
      }

      // Position Orion Spacecraft between Earth and Moon
      if (bodyMeshes.earth && bodyMeshes.moon) {
        const ePos = bodyMeshes.earth.mesh.position;
        const mPos = bodyMeshes.moon.mesh.position;
        const t = 0.64 + 0.18 * Math.sin(clockTime * 3.0);
        scGroup.position.lerpVectors(ePos, mPos, t);
        scGroup.position.y += 0.35;
        scGroup.lookAt(mPos);
      }

      const sph = cameraSphericalRef.current;
      if (followSc) {
        sph.target.lerp(scGroup.position, 0.08);
      } else if (selId && bodyMeshes[selId]) {
        sph.target.lerp(bodyMeshes[selId].mesh.position, 0.08);
      }

      const camX = sph.target.x + sph.radius * Math.sin(sph.phi) * Math.cos(sph.theta);
      const camY = sph.target.y + sph.radius * Math.cos(sph.phi);
      const camZ = sph.target.z + sph.radius * Math.sin(sph.phi) * Math.sin(sph.theta);
      camera.position.set(camX, camY, camZ);
      camera.lookAt(sph.target);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(reqId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElem.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
      disposables.forEach((d) => {
        if (d && typeof d.dispose === 'function') d.dispose();
      });
      renderer.dispose();
    };
  }, [setSelectedPlanetId]);

  const selectedPlanet = PLANETARY_DATA.find((p) => p.id === selectedPlanetId) || PLANETARY_DATA[3];
  const selectedDistInfo = planetaryDistances?.[selectedPlanet.id];

  return (
    <div className="relative w-full h-[460px] lg:h-[560px] rounded-lg overflow-hidden border border-sky-500/25 bg-[#02050d]">
      <div ref={mountRef} className="w-full h-full" />

      {/* Top-Left Overlay HUD */}
      <div className="absolute top-3 left-3 pointer-events-none space-y-1 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded border border-cyan-500/30 text-[11px] font-mono">
        <div className="text-cyan-300 font-bold">
          HELIOCENTRIC 15-BODY EPHEMERIS & EARTH-DISTANCE VECTOR
        </div>
        <div className="text-slate-300">
          8 Major Planets • 5 Dwarf Planets (Ceres, Pluto, Haumea, Makemake, Eris) • Sun & Moon
        </div>
        {selectedDistInfo && selectedPlanet.id !== 'earth' && (
          <div className="text-emerald-300 font-semibold pt-0.5 border-t border-slate-800">
            EARTH → {selectedPlanet.name.toUpperCase()}:{' '}
            {selectedDistInfo.liveDistanceEarthMillionKm.toLocaleString()} × 10⁶ km (
            {selectedDistInfo.liveDistanceEarthAU} AU • {selectedDistInfo.oneWayLightMinutes} light-min)
          </div>
        )}
        <div className="text-[10px] text-amber-300/90">
          Note: Visual body & orbit radii use logarithmic compression; telemetry displays verified NASA Fact Sheet distances.
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredBody && (
        <div className="absolute bottom-3 left-3 pointer-events-none bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded border border-cyan-400/50 text-xs font-mono space-y-0.5">
          <div className="text-cyan-300 font-bold">{hoveredBody.name}</div>
          <div className="text-slate-400 text-[11px]">{hoveredBody.category}</div>
          <div className="text-emerald-300 text-[11px] font-semibold">
            Live Distance from Earth:{' '}
            {hoveredBody.id === 'earth'
              ? '0 km (Origin)'
              : `${hoveredBody.distanceEarthMillionKm.toLocaleString()} × 10⁶ km (${hoveredBody.distanceEarthAU} AU • ${hoveredBody.lightMinutes} light-min)`}
          </div>
          <div className="text-slate-200 text-[11px]">
            Sun Dist: {hoveredBody.distanceSun} • Temp: {hoveredBody.temp}
          </div>
        </div>
      )}
    </div>
  );
}
