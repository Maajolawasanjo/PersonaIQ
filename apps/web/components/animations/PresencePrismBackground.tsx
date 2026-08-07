'use client';

import React, { useEffect, useRef } from 'react';

interface FloatingShape {
  id: number;
  type: 'icosahedron' | 'cube' | 'octahedron';
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  strokeColor: string;
  fillColor: string;
  dotColor: string;
  dotRadius: number;
}

export default function PresencePrismBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - width / 2) * 0.03;
      mouseY = (e.clientY - rect.top - height / 2) * 0.03;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 1. Icosahedron Geometry
    const phi = (1 + Math.sqrt(5)) / 2;
    const icoVerts: [number, number, number][] = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map(([x, y, z]) => {
      const len = Math.hypot(x, y, z);
      return [x / len, y / len, z / len];
    });
    const icoFaces: [number, number, number][] = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];

    // 2. Cube Geometry
    const cubeVerts: [number, number, number][] = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ].map(([x, y, z]) => {
      const len = Math.hypot(x, y, z);
      return [x / len, y / len, z / len];
    });
    const cubeFaces: [number, number, number][] = [
      [0, 1, 2], [0, 2, 3],
      [4, 5, 6], [4, 6, 7],
      [0, 1, 5], [0, 5, 4],
      [2, 3, 7], [2, 7, 6],
      [0, 3, 7], [0, 7, 4],
      [1, 2, 6], [1, 6, 5]
    ];

    // 3. Octahedron Geometry
    const octaVerts: [number, number, number][] = [
      [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]
    ];
    const octaFaces: [number, number, number][] = [
      [0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4],
      [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]
    ];

    // Initialize 24 floating shapes uniformly distributed across the entire hero canvas space
    const initShapes = (): FloatingShape[] => {
      const items: FloatingShape[] = [];
      const count = 24;
      const types: ('icosahedron' | 'cube' | 'octahedron')[] = ['cube', 'icosahedron', 'octahedron'];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.25 + Math.random() * 0.35; // Smooth ambient drift
        const shapeType = types[i % types.length];

        // Determine scale: mix of prominent large structures, medium prisms, and tiny accent cubes
        let scale = 60 + Math.random() * 90;
        if (i % 5 === 0) scale = 140 + Math.random() * 60; // Large hero shapes
        if (i % 7 === 0) scale = 35 + Math.random() * 25;  // Small accent shapes

        // Uniform distribution across 100% of hero width and height
        const x = Math.random() * width;
        const y = Math.random() * height;

        const isCrimson = i % 2 === 0;

        items.push({
          id: i,
          type: shapeType,
          x,
          y,
          z: (Math.random() - 0.5) * 80,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          scale,
          rotX: Math.random() * Math.PI,
          rotY: Math.random() * Math.PI,
          rotZ: Math.random() * Math.PI,
          speedX: (Math.random() - 0.5) * 0.004,
          speedY: (Math.random() - 0.5) * 0.004,
          speedZ: (Math.random() - 0.5) * 0.003,
          strokeColor: isCrimson ? 'rgba(163, 31, 52, 0.40)' : 'rgba(100, 115, 130, 0.35)',
          fillColor: isCrimson ? 'rgba(163, 31, 52, 0.04)' : 'rgba(100, 115, 130, 0.025)',
          dotColor: isCrimson ? 'rgba(225, 29, 72, 0.65)' : 'rgba(100, 115, 130, 0.55)',
          dotRadius: scale > 100 ? 3.0 : 2.0,
        });
      }
      return items;
    };

    const shapes = initShapes();

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Track screen positions of centers for constellation link lines
      const positions: { id: number; x: number; y: number; color: string }[] = [];

      shapes.forEach((s, idx) => {
        // 1. Position update: continuous wrap-around screen drift (no hard boundary pushback)
        s.x += s.vx;
        s.y += s.vy;

        const margin = s.scale * 1.2;
        if (s.x < -margin) s.x = width + margin;
        if (s.x > width + margin) s.x = -margin;
        if (s.y < -margin) s.y = height + margin;
        if (s.y > height + margin) s.y = -margin;

        // 2. Rotation update
        s.rotX += s.speedX;
        s.rotY += s.speedY;
        s.rotZ += s.speedZ;

        // Gentle floating wave & mouse reaction
        const floatY = Math.sin(time * 0.0009 + idx * 1.3) * 10;
        const posX = s.x + mouseX * (idx + 1) * 0.15;
        const posY = s.y + floatY + mouseY * (idx + 1) * 0.15;

        positions.push({ id: s.id, x: posX, y: posY, color: s.strokeColor });

        let baseVerts = icoVerts;
        let baseFaces = icoFaces;
        if (s.type === 'cube') {
          baseVerts = cubeVerts;
          baseFaces = cubeFaces;
        } else if (s.type === 'octahedron') {
          baseVerts = octaVerts;
          baseFaces = octaFaces;
        }

        // 3. Transform 3D Vertices
        const transformed = baseVerts.map(([vx, vy, vz]) => {
          let y1 = vy * Math.cos(s.rotX) - vz * Math.sin(s.rotX);
          let z1 = vy * Math.sin(s.rotX) + vz * Math.cos(s.rotX);
          let x1 = vx;

          let x2 = x1 * Math.cos(s.rotY) + z1 * Math.sin(s.rotY);
          let z2 = -x1 * Math.sin(s.rotY) + z1 * Math.cos(s.rotY);
          let y2 = y1;

          let x3 = x2 * Math.cos(s.rotZ) - y2 * Math.sin(s.rotZ);
          let y3 = x2 * Math.sin(s.rotZ) + y2 * Math.cos(s.rotZ);

          const distance = 500;
          const fov = distance / (distance + z2 + s.z);
          const px = posX + x3 * s.scale * fov;
          const py = posY + y3 * s.scale * fov;

          return { px, py };
        });

        // 4. Render faces & wireframe edges
        baseFaces.forEach(([iA, iB, iC]) => {
          const pA = transformed[iA];
          const pB = transformed[iB];
          const pC = transformed[iC];

          ctx.beginPath();
          ctx.moveTo(pA.px, pA.py);
          ctx.lineTo(pB.px, pB.py);
          ctx.lineTo(pC.px, pC.py);
          ctx.closePath();

          ctx.fillStyle = s.fillColor;
          ctx.fill();

          ctx.strokeStyle = s.strokeColor;
          ctx.lineWidth = s.scale > 100 ? 1.2 : 0.8;
          ctx.stroke();
        });

        // 5. Render glowing vertex dots
        transformed.forEach(({ px, py }) => {
          ctx.beginPath();
          ctx.arc(px, py, s.dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = s.dotColor;
          ctx.fill();
        });
      });

      // 6. Draw ambient connecting constellation lines between nearby shapes
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 260) {
            const alpha = (1 - dist / 260) * 0.15;
            ctx.beginPath();
            ctx.moveTo(positions[i].x, positions[i].y);
            ctx.lineTo(positions[j].x, positions[j].y);
            ctx.strokeStyle = `rgba(163, 31, 52, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
}
