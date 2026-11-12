import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useMissionStore } from '../../store/missionStore';

export function EarthSatelliteCanvas() {
  const mountRef = useRef(null);
  const satellites = useMissionStore((s) => s.satellites);
  const selectedSatelliteId = useMissionStore((s) => s.selectedSatelliteId);
  const setSelectedSatelliteId = useMissionStore((s) => s.setSelectedSatelliteId);
  const trackingCameraLocked = useMissionStore((s) => s.trackingCameraLocked);
  const simSpeed = useMissionStore((s) => s.simSpeed);
  const missionStatus = useMissionStore((s) => s.missionStatus);

  const stateRef = useRef({
    satellites,
    selectedSatelliteId,
    trackingCameraLocked,
    simSpeed,
    missionStatus,
  });

  useEffect(() => {
    stateRef.current = {
      satellites,
      selectedSatelliteId,
      trackingCameraLocked,
      simSpeed,
      missionStatus,
    };
  }, [satellites, selectedSatelliteId, trackingCameraLocked, simSpeed, missionStatus]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return undefined;

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020612');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x94a3b8, 1.1);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(15, 10, 12);
    scene.add(dirLight);

    const disposables = [];

    // Procedural Earth Texture
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 512;
    earthCanvas.height = 256;
    const ctx = earthCanvas.getContext('2d');
    ctx.fillStyle = '#0f2952';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
    for (let y = 0; y < 256; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    ctx.fillStyle = '#1e5b45';
    [[95, 80, 50, 35], [140, 155, 35, 45], [260, 70, 45, 32], [275, 135, 40, 48], [360, 85, 70, 42]].forEach(
      ([x, y, rx, ry]) => {
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, 0.15, 0, Math.PI * 2);
        ctx.fill();
      }
    );
    const earthTex = new THREE.CanvasTexture(earthCanvas);
    const earthGeo = new THREE.SphereGeometry(2.5, 40, 40);
    const earthMat = new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.65, metalness: 0.15 });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    const atmoGeo = new THREE.SphereGeometry(2.68, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide,
    });
    scene.add(new THREE.Mesh(atmoGeo, atmoMat));
    disposables.push(earthTex, earthGeo, earthMat, atmoGeo, atmoMat);

    // Satellite markers & orbital paths
    const satObjects = {};
    const clickableSats = [];

    stateRef.current.satellites.forEach((sat) => {
      const incRad = (sat.inclinationDeg * Math.PI) / 180;
      const raanRad = (sat.raanDeg * Math.PI) / 180;

      const orbitGroup = new THREE.Group();
      orbitGroup.rotation.y = raanRad;
      orbitGroup.rotation.x = incRad;
      scene.add(orbitGroup);

      const pts = [];
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * sat.orbitRadiusVisual, 0, Math.sin(a) * sat.orbitRadiusVisual));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const lineMat = new THREE.LineBasicMaterial({
        color: sat.color,
        transparent: true,
        opacity: 0.45,
      });
      orbitGroup.add(new THREE.LineLoop(lineGeo, lineMat));

      const markerGeo = new THREE.OctahedronGeometry(0.18, 1);
      const markerMat = new THREE.MeshBasicMaterial({ color: sat.color });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.userData = { satId: sat.id };
      orbitGroup.add(markerMesh);
      clickableSats.push(markerMesh);

      disposables.push(lineGeo, lineMat, markerGeo, markerMat);
      satObjects[sat.id] = {
        orbitGroup,
        markerMesh,
        radius: sat.orbitRadiusVisual,
        angle: sat.phaseOffset,
        periodMin: sat.periodMin,
      };
    });

    // Camera orbit controls
    const camSpherical = { radius: 13.5, theta: 0.8, phi: 1.15 };
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
      if (!isDragging) return;
      const dx = e.clientX - prevPos.x;
      const dy = e.clientY - prevPos.y;
      prevPos = { x: e.clientX, y: e.clientY };
      camSpherical.theta -= dx * 0.006;
      camSpherical.phi = Math.max(0.2, Math.min(Math.PI - 0.2, camSpherical.phi - dy * 0.006));
    };

    const onPointerUp = (e) => {
      isDragging = false;
      if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) < 6) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(clickableSats, false);
        if (hits.length > 0 && hits[0].object.userData.satId) {
          setSelectedSatelliteId(hits[0].object.userData.satId);
        }
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      camSpherical.radius = Math.max(5.5, Math.min(26, camSpherical.radius + e.deltaY * 0.015));
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 720;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    let reqId;
    const targetVec = new THREE.Vector3();

    const animate = () => {
      reqId = window.requestAnimationFrame(animate);
      const { selectedSatelliteId: selId, trackingCameraLocked: locked, simSpeed: spd, missionStatus: status } =
        stateRef.current;
      const dt = status === 'PAUSED' || status === 'ABORTED' ? 0 : 0.01 * Math.min(spd, 10);

      earthMesh.rotation.y += dt * 0.18;

      Object.entries(satObjects).forEach(([id, obj]) => {
        const rate = 90 / Math.max(60, obj.periodMin);
        obj.angle += dt * rate;
        obj.markerMesh.position.set(
          Math.cos(obj.angle) * obj.radius,
          0,
          Math.sin(obj.angle) * obj.radius
        );
        const scale = id === selId ? 1.65 : 1.0;
        obj.markerMesh.scale.set(scale, scale, scale);
      });

      if (locked && selId && satObjects[selId]) {
        satObjects[selId].markerMesh.getWorldPosition(targetVec);
      } else {
        targetVec.set(0, 0, 0);
      }

      camera.position.set(
        targetVec.x + camSpherical.radius * Math.sin(camSpherical.phi) * Math.cos(camSpherical.theta),
        targetVec.y + camSpherical.radius * Math.cos(camSpherical.phi),
        targetVec.z + camSpherical.radius * Math.sin(camSpherical.phi) * Math.sin(camSpherical.theta)
      );
      camera.lookAt(targetVec);

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
      disposables.forEach((d) => {
        if (d && typeof d.dispose === 'function') d.dispose();
      });
      renderer.dispose();
    };
  }, [setSelectedSatelliteId]);

  return (
    <div className="relative w-full h-[430px] lg:h-[510px] rounded-lg overflow-hidden border border-sky-500/25 bg-[#020612]">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-3 left-3 pointer-events-none bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded border border-cyan-500/30 text-[11px] font-mono">
        <div className="text-cyan-300 font-bold">3D ORBITAL CONSTELLATION RADAR</div>
        <div className="text-slate-400">Click any orbital marker to inspect • Toggle Tracking Lock in panel</div>
      </div>
    </div>
  );
}
