'use client';

import React, { useEffect, useRef } from 'react';

interface FloatingShape {
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
      mouseX = (e.clientX - rect.left - width / 2) * 0.02;
      mouseY = (e.clientY - rect.top - height / 2) * 0.02;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 1. Icosahedron
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

    // 2. Cube
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

    // 3. Octahedron
    const octaVerts: [number, number, number][] = [
      [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]
    ];
    const octaFaces: [number, number, number][] = [
      [0, 2, 4], [2, 1, 4], [1, 3, 4], [3, 0, 4],
      [2, 0, 5], [1, 2, 5], [3, 1, 5], [0, 3, 5]
    ];

    // Initialize 10 floating shapes spread across the entire width and height of hero canvas
    const initShapes = (): FloatingShape[] => {
      const items: FloatingShape[] = [];
      const types: ('icosahedron' | 'cube' | 'octahedron')[] = ['cube', 'icosahedron', 'octahedron', 'cube', 'icosahedron', 'cube', 'octahedron', 'icosahedron', 'cube', 'octahedron'];
      
      const grid = [
        { xRatio: 0.12, yRatio: 0.20, scale: 95 },  // Top Left
        { xRatio: 0.85, yRatio: 0.18, scale: 110 }, // Top Right
        { xRatio: 0.25, yRatio: 0.78, scale: 130 }, // Bottom Left
        { xRatio: 0.80, yRatio: 0.82, scale: 100 }, // Bottom Right
        { xRatio: 0.50, yRatio: 0.25, scale: 140 }, // Center Top
        { xRatio: 0.08, yRatio: 0.55, scale: 80 },  // Far Left
        { xRatio: 0.92, yRatio: 0.50, scale: 85 },  // Far Right
        { xRatio: 0.38, yRatio: 0.85, scale: 75 },  // Center Bottom Left
        { xRatio: 0.65, yRatio: 0.75, scale: 120 }, // Center Bottom Right
        { xRatio: 0.30, yRatio: 0.35, scale: 65 },  // Inner Mid Left
      ];

      grid.forEach((g, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 0.25; // Gentle, smooth drifting speed
        const t = types[i % types.length];

        items.push({
          type: t,
          x: width * g.xRatio,
          y: height * g.yRatio,
          z: (Math.random() - 0.5) * 60,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          scale: g.scale,
          rotX: Math.random() * Math.PI,
          rotY: Math.random() * Math.PI,
          rotZ: Math.random() * Math.PI,
          speedX: (Math.random() - 0.5) * 0.003,
          speedY: (Math.random() - 0.5) * 0.003,
          speedZ: (Math.random() - 0.5) * 0.002,
          strokeColor: i % 2 === 0 ? 'rgba(163, 31, 52, 0.35)' : 'rgba(120, 135, 150, 0.3)',
          fillColor: i % 2 === 0 ? 'rgba(163, 31, 52, 0.03)' : 'rgba(120, 135, 150, 0.02)',
          dotColor: i % 2 === 0 ? 'rgba(163, 31, 52, 0.6)' : 'rgba(120, 135, 150, 0.5)',
          dotRadius: i % 2 === 0 ? 2.5 : 2.0,
        });
      });
      return items;
    };

    const shapes = initShapes();

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      shapes.forEach((s, idx) => {
        // 1. Move position across hero section
        s.x += s.vx;
        s.y += s.vy;

        // Bounce gently at canvas edges
        const padding = s.scale * 0.8;
        if (s.x < padding) {
          s.x = padding;
          s.vx *= -1;
        } else if (s.x > width - padding) {
          s.x = width - padding;
          s.vx *= -1;
        }

        if (s.y < padding) {
          s.y = padding;
          s.vy *= -1;
        } else if (s.y > height - padding) {
          s.y = height - padding;
          s.vy *= -1;
        }

        // 2. Rotate 3D shape
        s.rotX += s.speedX;
        s.rotY += s.speedY;
        s.rotZ += s.speedZ;

        // Mouse influence & gentle floating wave
        const floatY = Math.sin(time * 0.0008 + idx * 1.5) * 8;
        const posX = s.x + mouseX * (idx + 1) * 0.2;
        const posY = s.y + floatY + mouseY * (idx + 1) * 0.2;

        let baseVerts = icoVerts;
        let baseFaces = icoFaces;
        if (s.type === 'cube') {
          baseVerts = cubeVerts;
          baseFaces = cubeFaces;
        } else if (s.type === 'octahedron') {
          baseVerts = octaVerts;
          baseFaces = octaFaces;
        }

        // 3. Transform 3D vertices
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

        // 4. Render faces & wireframes
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
          ctx.lineWidth = 1.0;
          ctx.stroke();
        });

        // 5. Render vertex nodes
        transformed.forEach(({ px, py }) => {
          ctx.beginPath();
          ctx.arc(px, py, s.dotRadius, 0, Math.PI * 2);
          ctx.fillStyle = s.dotColor;
          ctx.fill();
        });
      });

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
