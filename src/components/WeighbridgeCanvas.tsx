import React, { useRef, useEffect, useCallback } from 'react';

interface WeighbridgePart {
  id: string;
  name: string;
  baseX: number;
  baseY: number;
  baseZ: number;
  width: number;
  height: number;
  depth: number;
  color: string;
  glowColor: string;
  explodeOffset: { x: number; y: number; z: number };
}

interface WeighbridgeCanvasProps {
  progress: number;
  mouseX: number;
  mouseY: number;
  velocity: number;
}

const parts: WeighbridgePart[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    baseX: 0,
    baseY: 180,
    baseZ: 0,
    width: 380,
    height: 40,
    depth: 200,
    color: '#1a1a2e',
    glowColor: '#00f0ff',
    explodeOffset: { x: 0, y: 200, z: -100 },
  },
  {
    id: 'loadcell1',
    name: 'Load Cell',
    baseX: -140,
    baseY: 140,
    baseZ: 0,
    width: 30,
    height: 35,
    depth: 30,
    color: '#2a2a4e',
    glowColor: '#ff6b00',
    explodeOffset: { x: -180, y: 100, z: 50 },
  },
  {
    id: 'loadcell2',
    name: 'Load Cell',
    baseX: 140,
    baseY: 140,
    baseZ: 0,
    width: 30,
    height: 35,
    depth: 30,
    color: '#2a2a4e',
    glowColor: '#ff6b00',
    explodeOffset: { x: 180, y: 100, z: 50 },
  },
  {
    id: 'loadcell3',
    name: 'Load Cell',
    baseX: -140,
    baseY: 140,
    baseZ: 60,
    width: 30,
    height: 35,
    depth: 30,
    color: '#2a2a4e',
    glowColor: '#ff6b00',
    explodeOffset: { x: -180, y: 60, z: 150 },
  },
  {
    id: 'loadcell4',
    name: 'Load Cell',
    baseX: 140,
    baseY: 140,
    baseZ: 60,
    width: 30,
    height: 35,
    depth: 30,
    color: '#2a2a4e',
    glowColor: '#ff6b00',
    explodeOffset: { x: 180, y: 60, z: 150 },
  },
  {
    id: 'deck',
    name: 'Deck Platform',
    baseX: 0,
    baseY: 100,
    baseZ: 30,
    width: 360,
    height: 25,
    depth: 180,
    color: '#3a3a5e',
    glowColor: '#00f0ff',
    explodeOffset: { x: 0, y: -150, z: 80 },
  },
  {
    id: 'junction',
    name: 'Junction Box',
    baseX: 180,
    baseY: 70,
    baseZ: 0,
    width: 50,
    height: 30,
    depth: 40,
    color: '#4a4a6e',
    glowColor: '#00f0ff',
    explodeOffset: { x: 280, y: -80, z: 0 },
  },
  {
    id: 'indicator',
    name: 'Indicator',
    baseX: 220,
    baseY: -20,
    baseZ: 0,
    width: 80,
    height: 60,
    depth: 25,
    color: '#0a0a1a',
    glowColor: '#00f0ff',
    explodeOffset: { x: 320, y: -200, z: -50 },
  },
];

const WeighbridgeCanvas: React.FC<WeighbridgeCanvasProps> = ({
  progress,
  mouseX,
  mouseY,
  velocity,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const rafRef = useRef<number>();

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const drawPart = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      part: WeighbridgePart,
      animProgress: number,
      centerX: number,
      centerY: number,
      rotationX: number,
      rotationY: number,
      time: number
    ) => {
      const easedProgress = easeInOutCubic(animProgress);

      // Calculate exploded position
      const x = part.baseX + part.explodeOffset.x * easedProgress;
      const y = part.baseY + part.explodeOffset.y * easedProgress;
      const z = part.baseZ + part.explodeOffset.z * easedProgress;

      // Add micro-motion
      const microMotion = Math.sin(time * 0.001 + part.baseX * 0.01) * 3 * (1 + easedProgress);

      // Apply 3D rotation
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);
      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);

      // Rotate around Y axis
      let rx = x * cosY - z * sinY;
      let rz = x * sinY + z * cosY;

      // Rotate around X axis
      let ry = y * cosX - rz * sinX;
      rz = y * sinX + rz * cosX;

      // Project to 2D with perspective
      const perspective = 800;
      const scale = perspective / (perspective + rz + 200);

      const screenX = centerX + rx * scale;
      const screenY = centerY + (ry + microMotion) * scale;

      // Scale dimensions
      const w = part.width * scale;
      const h = part.height * scale;
      const d = part.depth * scale * 0.4;

      // Depth-based effects
      const depthFactor = Math.max(0, Math.min(1, (rz + 300) / 600));
      const blur = easedProgress * 3 * depthFactor;
      const opacity = 1 - easedProgress * 0.3 - depthFactor * 0.2;

      ctx.save();

      // Apply blur for depth
      if (blur > 0.5) {
        ctx.filter = `blur(${blur}px)`;
      }

      ctx.globalAlpha = opacity;

      // Draw 3D box
      // Top face
      ctx.fillStyle = part.color;
      ctx.beginPath();
      ctx.moveTo(screenX - w / 2, screenY - h / 2);
      ctx.lineTo(screenX + w / 2, screenY - h / 2);
      ctx.lineTo(screenX + w / 2 + d, screenY - h / 2 - d * 0.6);
      ctx.lineTo(screenX - w / 2 + d, screenY - h / 2 - d * 0.6);
      ctx.closePath();
      ctx.fill();

      // Front face
      const gradient = ctx.createLinearGradient(
        screenX - w / 2,
        screenY - h / 2,
        screenX + w / 2,
        screenY + h / 2
      );
      gradient.addColorStop(0, part.color);
      gradient.addColorStop(1, '#0a0a15');
      ctx.fillStyle = gradient;
      ctx.fillRect(screenX - w / 2, screenY - h / 2, w, h);

      // Right face
      ctx.fillStyle = '#0a0a15';
      ctx.beginPath();
      ctx.moveTo(screenX + w / 2, screenY - h / 2);
      ctx.lineTo(screenX + w / 2 + d, screenY - h / 2 - d * 0.6);
      ctx.lineTo(screenX + w / 2 + d, screenY + h / 2 - d * 0.6);
      ctx.lineTo(screenX + w / 2, screenY + h / 2);
      ctx.closePath();
      ctx.fill();

      // Glow effect
      if (animProgress > 0.1) {
        ctx.shadowColor = part.glowColor;
        ctx.shadowBlur = 20 * easedProgress;
        ctx.strokeStyle = part.glowColor;
        ctx.lineWidth = 1;
        ctx.globalAlpha = opacity * 0.5 * easedProgress;
        ctx.strokeRect(screenX - w / 2, screenY - h / 2, w, h);
      }

      // Edge highlights
      ctx.shadowBlur = 0;
      ctx.globalAlpha = opacity * 0.3;
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(screenX - w / 2, screenY - h / 2, w, h);

      ctx.restore();

      return { screenX, screenY, scale, z: rz };
    },
    []
  );

  const drawCables = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      fromX: number,
      fromY: number,
      toX: number,
      toY: number,
      progress: number,
      time: number
    ) => {
      ctx.save();
      ctx.globalAlpha = 0.6 - progress * 0.4;

      const wave = Math.sin(time * 0.002) * 10 * (1 + progress);

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.bezierCurveTo(
        fromX + (toX - fromX) * 0.3,
        fromY + wave,
        fromX + (toX - fromX) * 0.7,
        toY - wave,
        toX,
        toY
      );
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.lineDashOffset = -time * 0.05;
      ctx.stroke();

      ctx.restore();
    },
    []
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;

    timeRef.current += 16;
    const time = timeRef.current;

    // Clear with gradient background
    const bgGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      Math.max(width, height)
    );
    bgGradient.addColorStop(0, '#0d0d1a');
    bgGradient.addColorStop(0.5, '#080812');
    bgGradient.addColorStop(1, '#050508');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 0.5;

    const gridSize = 60;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();

    // Calculate rotation based on mouse and velocity
    const baseRotationY = mouseX * 0.3;
    const baseRotationX = mouseY * 0.15;
    const velocityRotation = velocity * 0.002;

    const rotationX = baseRotationX + Math.sin(time * 0.0005) * 0.05;
    const rotationY = baseRotationY + velocityRotation + Math.cos(time * 0.0003) * 0.08;

    // Sort parts by Z for proper draw order
    const sortedParts = [...parts].sort((a, b) => {
      const aZ = a.baseZ + a.explodeOffset.z * progress;
      const bZ = b.baseZ + b.explodeOffset.z * progress;
      return aZ - bZ;
    });

    // Draw all parts
    const partPositions: { [key: string]: { x: number; y: number } } = {};

    sortedParts.forEach((part) => {
      const pos = drawPart(ctx, part, progress, centerX, centerY, rotationX, rotationY, time);
      partPositions[part.id] = { x: pos.screenX, y: pos.screenY };
    });

    // Draw cables connecting junction to load cells
    if (partPositions.junction && partPositions.loadcell1) {
      drawCables(
        ctx,
        partPositions.junction.x,
        partPositions.junction.y,
        partPositions.loadcell1.x,
        partPositions.loadcell1.y,
        progress,
        time
      );
    }
    if (partPositions.junction && partPositions.loadcell2) {
      drawCables(
        ctx,
        partPositions.junction.x,
        partPositions.junction.y,
        partPositions.loadcell2.x,
        partPositions.loadcell2.y,
        progress,
        time
      );
    }

    // Draw ambient glow
    ctx.save();
    const glowGradient = ctx.createRadialGradient(
      centerX,
      centerY + 100,
      0,
      centerX,
      centerY + 100,
      400
    );
    glowGradient.addColorStop(0, 'rgba(0, 240, 255, 0.1)');
    glowGradient.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    rafRef.current = requestAnimationFrame(draw);
  }, [progress, mouseX, mouseY, velocity, drawPart, drawCables]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ touchAction: 'none' }}
    />
  );
};

export default WeighbridgeCanvas;
