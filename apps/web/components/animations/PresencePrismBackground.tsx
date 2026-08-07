'use client';

import React, { useEffect, useRef } from 'react';

export default function PresencePrismBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    let animationFrameId: number;
    let cleanupFunction: (() => void) | null = null;

    const initThree = () => {
      if (!isMounted || !container) return;

      const THREE = (window as Record<string, unknown>).THREE as {
        Scene: new () => unknown;
        PerspectiveCamera: new (fov: number, aspect: number, near: number, far: number) => { position: { z: number }; aspect: number; updateProjectionMatrix: () => void };
        WebGLRenderer: new (options: { alpha: boolean; antialias: boolean }) => { setSize: (w: number, h: number) => void; setPixelRatio: (r: number) => void; domElement: HTMLCanvasElement; render: (scene: unknown, camera: unknown) => void; dispose: () => void };
        AmbientLight: new (color: number, intensity: number) => unknown;
        PointLight: new (color: number, intensity: number) => { position: { set: (x: number, y: number, z: number) => void } };
        DirectionalLight: new (color: number, intensity: number) => { position: { set: (x: number, y: number, z: number) => void } };
        Group: new () => { add: (item: unknown) => void; rotation: { x: number; y: number }; position: { x: number; y: number } };
        IcosahedronGeometry: new (radius: number, detail: number) => unknown;
        MeshPhysicalMaterial: new (options: Record<string, unknown>) => unknown;
        Mesh: new (geometry: unknown, material: unknown) => { position: { set: (x: number, y: number, z: number) => void; y: number }; rotation: { set: (x: number, y: number, z: number) => void }; add: (item: unknown) => void; rotateOnAxis: (axis: unknown, speed: number) => void };
        LineSegments: new (geometry: unknown, material: unknown) => unknown;
        WireframeGeometry: new (geometry: unknown) => unknown;
        LineBasicMaterial: new (options: Record<string, unknown>) => unknown;
        Vector3: new (x: number, y: number, z: number) => { normalize: () => unknown };
      };

      if (!THREE) return;

      container.innerHTML = '';

      const scene = new THREE.Scene();
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 5;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0x750013, 2.5);
      pointLight.position.set(5, 5, 5);
      scene.add(pointLight);

      const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
      topLight.position.set(0, 10, 0);
      scene.add(topLight);

      const group = new THREE.Group();
      const count = 10;
      const prisms: { mesh: InstanceType<typeof THREE.Mesh>; speed: number; axis: unknown }[] = [];

      for (let i = 0; i < count; i++) {
        const geometry = new THREE.IcosahedronGeometry(Math.random() * 0.8 + 0.4, 0);
        const material = new THREE.MeshPhysicalMaterial({
          color: i % 2 === 0 ? 0x750013 : 0xffffff,
          metalness: 0.1,
          roughness: 0.05,
          transmission: 0.9,
          thickness: 0.5,
          transparent: true,
          opacity: 0.6,
        });

        const prism = new THREE.Mesh(geometry, material);
        prism.position.set(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 4.5,
          (Math.random() - 0.5) * 2
        );
        prism.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

        const wireframe = new THREE.LineSegments(
          new THREE.WireframeGeometry(geometry),
          new THREE.LineBasicMaterial({ color: 0x750013, transparent: true, opacity: 0.25 })
        );
        prism.add(wireframe);

        group.add(prism);
        prisms.push({
          mesh: prism,
          speed: Math.random() * 0.008 + 0.004,
          axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
        });
      }
      scene.add(group);

      let mouseX = 0;
      let mouseY = 0;
      const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', handleMouseMove);

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', handleResize);

      const animate = (t: number) => {
        animationFrameId = requestAnimationFrame(animate);

        group.rotation.y += 0.002;
        group.rotation.x += 0.001;

        prisms.forEach((p, i) => {
          p.mesh.rotateOnAxis(p.axis, p.speed);
          p.mesh.position.y += Math.sin(t * 0.001 + i) * 0.002;
        });

        group.position.x += (mouseX * 0.5 - group.position.x) * 0.05;
        group.position.y += (-mouseY * 0.5 - group.position.y) * 0.05;

        renderer.render(scene, camera);
      };

      animate(0);

      cleanupFunction = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    };

    if ((window as Record<string, unknown>).THREE) {
      initThree();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.async = true;
      script.onload = () => {
        initThree();
      };
      document.body.appendChild(script);
    }

    return () => {
      isMounted = false;
      if (cleanupFunction) cleanupFunction();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
}
