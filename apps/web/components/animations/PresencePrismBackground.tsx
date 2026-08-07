'use client';

import React, { useEffect, useRef } from 'react';

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
      mouseX = (e.clientX - rect.left - width / 2) * 0.04;
      mouseY = (e.clientY - rect.top - height / 2) * 0.04;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Icosahedron geometry calculation
    const phi = (1 + Math.sqrt(5)) / 2;
    const baseVertices: [number, number, number][] = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [x / len, y / len, z / len];
    });

    const faces: [number, number, number][] = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];

    // Build central master polyhedron + floating satellites
    const structures = [
      // 1. Large Central Polyhedron Structure (Behind badge & headline)
      {
        offsetX: 0,
        offsetY: -20,
        z: 0,
        scale: 240,
        rotX: 0.2,
        rotY: 0.1,
        rotZ: 0,
        speedX: 0.0015,
        speedY: 0.002,
        speedZ: 0.0005,
        strokeColor: 'rgba(117, 0, 19, 0.35)',
        fillColor: 'rgba(117, 0, 19, 0.03)',
        dotColor: 'rgba(255, 19, 35, 0.5)',
        dotRadius: 2.5,
      },
      // 2. Secondary Large Wireframe Mesh
      {
        offsetX: 0,
        offsetY: 20,
        z: 50,
        scale: 180,
        rotX: -0.4,
        rotY: 0.5,
        rotZ: 0.2,
        speedX: -0.002,
        speedY: 0.001,
        speedZ: 0.001,
        strokeColor: 'rgba(255, 19, 35, 0.25)',
        fillColor: 'rgba(255, 117, 116, 0.02)',
        dotColor: 'rgba(117, 0, 19, 0.4)',
        dotRadius: 2.0,
      },
      // 3. Top Floating Satellite Prism
      {
        offsetX: 140,
        offsetY: -160,
        z: -30,
        scale: 75,
        rotX: 0.8,
        rotY: -0.3,
        rotZ: 0.1,
        speedX: 0.003,
        speedY: 0.002,
        speedZ: 0.001,
        strokeColor: 'rgba(117, 0, 19, 0.4)',
        fillColor: 'rgba(117, 0, 19, 0.06)',
        dotColor: 'rgba(117, 0, 19, 0.6)',
        dotRadius: 2,
      },
      // 4. Bottom Left Floating Satellite Prism
      {
        offsetX: -180,
        offsetY: 120,
        z: -20,
        scale: 90,
        rotX: -0.2,
        rotY: 0.7,
        rotZ: 0.4,
        speedX: -0.0015,
        speedY: -0.0025,
        speedZ: 0.001,
        strokeColor: 'rgba(117, 0, 19, 0.3)',
        fillColor: 'rgba(117, 0, 19, 0.04)',
        dotColor: 'rgba(255, 19, 35, 0.5)',
        dotRadius: 2,
      },
      // 5. Right Floating Satellite Prism
      {
        offsetX: 220,
        offsetY: 80,
        z: 10,
        scale: 110,
        rotX: 0.5,
        rotY: -0.6,
        rotZ: 0.3,
        speedX: 0.002,
        speedY: -0.0015,
        speedZ: -0.001,
        strokeColor: 'rgba(117, 0, 19, 0.35)',
        fillColor: 'rgba(117, 0, 19, 0.05)',
        dotColor: 'rgba(117, 0, 19, 0.5)',
        dotRadius: 2,
      }
    ];

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      structures.forEach((s, idx) => {
        s.rotX += s.speedX;
        s.rotY += s.speedY;
        s.rotZ += s.speedZ;

        const floatY = Math.sin(time * 0.001 + idx * 1.2) * 10;
        const posX = centerX + s.offsetX + mouseX * (idx + 1) * 0.25;
        const posY = centerY + s.offsetY + floatY + mouseY * (idx + 1) * 0.25;

        // Transform 3D vertices
        const transformed = baseVertices.map(([vx, vy, vz]) => {
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

        // Draw translucent faces & wireframe lines
        faces.forEach(([iA, iB, iC]) => {
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
          ctx.lineWidth = idx === 0 ? 1.2 : 0.9;
          ctx.stroke();
        });

        // Draw vertex nodes
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
