import React, { useEffect, useRef } from 'react';
import { useAnimationLoop, getHeroProgress } from '@/hooks/useAnimationLoop';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  opacity: number;
}

// Animation phases mapped to scroll progress
const PHASES = {
  enter: { start: 0, end: 0.2 },      // Truck enters from left
  descend: { start: 0.2, end: 0.35 }, // Truck descends into pit
  weigh: { start: 0.35, end: 0.6 },   // Weighing pause
  ascend: { start: 0.6, end: 0.75 },  // Truck rises out of pit
  exit: { start: 0.75, end: 1 },      // Truck exits to right and fades
};

function getPhaseProgress(progress: number, phase: { start: number; end: number }): number {
  if (progress < phase.start) return 0;
  if (progress > phase.end) return 1;
  return (progress - phase.start) / (phase.end - phase.start);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t: number): number {
  return t * t * t;
}

const PitWeighbridgeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const stateRef = useRef({
    weightValue: 0,
    targetWeight: 87.45,
    glowIntensity: 0,
    vibration: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useAnimationLoop((state) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const progress = getHeroProgress(state.virtualScrollY);
    const dpr = Math.min(window.devicePixelRatio, 2);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Calculate phase progress
    const enterProgress = getPhaseProgress(progress, PHASES.enter);
    const descendProgress = getPhaseProgress(progress, PHASES.descend);
    const weighProgress = getPhaseProgress(progress, PHASES.weigh);
    const ascendProgress = getPhaseProgress(progress, PHASES.ascend);
    const exitProgress = getPhaseProgress(progress, PHASES.exit);

    // Calculate truck position
    const truckData = calculateTruckPosition(
      width,
      height,
      enterProgress,
      descendProgress,
      weighProgress,
      ascendProgress,
      exitProgress
    );

    // Update weight display during weigh phase
    if (weighProgress > 0 && weighProgress < 1) {
      const targetWeight = stateRef.current.targetWeight;
      stateRef.current.weightValue += (targetWeight - stateRef.current.weightValue) * 0.03;
      stateRef.current.glowIntensity = Math.min(weighProgress * 2, 1);
      stateRef.current.vibration = Math.sin(state.time * 0.04) * (1 - weighProgress) * 2;
    } else if (ascendProgress > 0 || exitProgress > 0) {
      stateRef.current.glowIntensity *= 0.95;
      stateRef.current.vibration *= 0.9;
    }

    // Update smoke particles
    updateParticles(
      particlesRef.current,
      truckData.x,
      truckData.y,
      truckData.isMoving,
      state.time
    );

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw scene layers
    drawBackground(ctx, width, height, state.time);
    drawRoad(ctx, width, height);
    drawPitWeighbridge(ctx, width, height, stateRef.current.glowIntensity, stateRef.current.vibration);
    drawParticles(ctx, particlesRef.current);
    drawTruck(ctx, truckData, stateRef.current.vibration, state.time);
    drawWeightIndicator(ctx, width, height, stateRef.current.weightValue, stateRef.current.glowIntensity, weighProgress);
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};

function calculateTruckPosition(
  width: number,
  height: number,
  enterProgress: number,
  descendProgress: number,
  weighProgress: number,
  ascendProgress: number,
  exitProgress: number
) {
  const groundY = height * 0.65;
  const pitCenterX = width * 0.5;
  const pitDepth = 50;
  const scale = Math.min(width / 1920, 1);

  // Starting position (off-screen left)
  let x = -300;
  let y = groundY;
  let truckScale = 0.8;
  let opacity = 1;
  let isMoving = false;

  // Phase 1: Enter from left
  if (enterProgress > 0) {
    const t = easeOutCubic(enterProgress);
    x = -300 + t * (pitCenterX + 100);
    isMoving = enterProgress < 1;
  }

  // Phase 2: Descend into pit
  if (descendProgress > 0) {
    const t = easeInOutCubic(descendProgress);
    x = pitCenterX - 200 + t * 200;
    y = groundY + t * pitDepth;
    isMoving = descendProgress < 1;
  }

  // Phase 3: Weighing (slight settle)
  if (weighProgress > 0 && ascendProgress === 0) {
    x = pitCenterX;
    y = groundY + pitDepth;
    isMoving = false;
  }

  // Phase 4: Ascend out of pit
  if (ascendProgress > 0) {
    const t = easeInOutCubic(ascendProgress);
    x = pitCenterX + t * 200;
    y = groundY + pitDepth - t * pitDepth;
    isMoving = ascendProgress < 1;
  }

  // Phase 5: Exit to right
  if (exitProgress > 0) {
    const t = easeInCubic(exitProgress);
    x = pitCenterX + 200 + t * (width - pitCenterX + 300);
    y = groundY;
    opacity = 1 - easeInCubic(exitProgress);
    isMoving = exitProgress < 0.9;
  }

  return { x, y, scale: truckScale * scale, opacity, isMoving };
}

function updateParticles(
  particles: Particle[],
  truckX: number,
  truckY: number,
  isMoving: boolean,
  time: number
) {
  // Remove dead particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].life -= 0.016;
    if (particles[i].life <= 0) {
      particles.splice(i, 1);
    }
  }

  // Add new particles if truck is moving
  if (isMoving && particles.length < 30) {
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: truckX - 150 + Math.random() * 20,
        y: truckY - 30 + Math.random() * 20,
        vx: -1 - Math.random() * 2,
        vy: -0.5 - Math.random() * 1.5,
        life: 1 + Math.random() * 0.5,
        maxLife: 1.5,
        size: 8 + Math.random() * 12,
        opacity: 0.3 + Math.random() * 0.2,
      });
    }
  }

  // Update particle positions
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy -= 0.02; // Drift upward
    p.vx *= 0.99; // Slow down horizontally
    p.size *= 1.01; // Grow slightly
  });
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach((p) => {
    const lifeRatio = p.life / p.maxLife;
    const alpha = p.opacity * lifeRatio;

    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    gradient.addColorStop(0, `rgba(180, 180, 180, ${alpha * 0.5})`);
    gradient.addColorStop(0.5, `rgba(120, 120, 120, ${alpha * 0.3})`);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  // Animated grid
  const gridSize = 80;
  const pulse = Math.sin(time * 0.001) * 0.3 + 0.7;

  ctx.strokeStyle = `rgba(0, 240, 255, ${0.015 * pulse})`;
  ctx.lineWidth = 1;

  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}

function drawRoad(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const groundY = height * 0.65;

  // Road surface
  const roadGradient = ctx.createLinearGradient(0, groundY - 50, 0, height);
  roadGradient.addColorStop(0, 'transparent');
  roadGradient.addColorStop(0.2, 'rgba(25, 25, 30, 0.9)');
  roadGradient.addColorStop(1, 'rgba(15, 15, 20, 1)');

  ctx.fillStyle = roadGradient;
  ctx.fillRect(0, groundY - 50, width, height - groundY + 50);

  // Road edge line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(width, groundY);
  ctx.stroke();

  // Road markings (dashed center line)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 3;
  ctx.setLineDash([50, 40]);
  ctx.beginPath();
  ctx.moveTo(0, groundY + 40);
  ctx.lineTo(width, groundY + 40);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPitWeighbridge(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  glowIntensity: number,
  vibration: number
) {
  const groundY = height * 0.65;
  const pitCenterX = width * 0.5;
  const pitWidth = 350;
  const pitDepth = 60;
  const scale = Math.min(width / 1920, 1);

  // Pit excavation (dark void)
  ctx.fillStyle = 'rgba(5, 5, 10, 0.95)';
  ctx.beginPath();
  ctx.moveTo(pitCenterX - pitWidth, groundY);
  ctx.lineTo(pitCenterX + pitWidth, groundY);
  ctx.lineTo(pitCenterX + pitWidth * 0.9, groundY + pitDepth);
  ctx.lineTo(pitCenterX - pitWidth * 0.9, groundY + pitDepth);
  ctx.closePath();
  ctx.fill();

  // Pit walls
  ctx.fillStyle = '#1a1a20';
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
  ctx.lineWidth = 1;

  // Left pit wall
  ctx.beginPath();
  ctx.moveTo(pitCenterX - pitWidth, groundY);
  ctx.lineTo(pitCenterX - pitWidth * 0.9, groundY + pitDepth);
  ctx.lineTo(pitCenterX - pitWidth * 0.9, groundY + pitDepth + 30);
  ctx.lineTo(pitCenterX - pitWidth, groundY + 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right pit wall
  ctx.beginPath();
  ctx.moveTo(pitCenterX + pitWidth, groundY);
  ctx.lineTo(pitCenterX + pitWidth * 0.9, groundY + pitDepth);
  ctx.lineTo(pitCenterX + pitWidth * 0.9, groundY + pitDepth + 30);
  ctx.lineTo(pitCenterX + pitWidth, groundY + 20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Weighbridge platform
  const platformY = groundY + pitDepth - 8 + vibration;

  // Platform glow
  if (glowIntensity > 0) {
    const glowGradient = ctx.createRadialGradient(
      pitCenterX, platformY, 0,
      pitCenterX, platformY, pitWidth * 1.2
    );
    glowGradient.addColorStop(0, `rgba(0, 240, 255, ${0.25 * glowIntensity})`);
    glowGradient.addColorStop(0.5, `rgba(0, 240, 255, ${0.08 * glowIntensity})`);
    glowGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = glowGradient;
    ctx.fillRect(pitCenterX - pitWidth * 1.5, platformY - 80, pitWidth * 3, 200);
  }

  // Platform surface
  const platformGradient = ctx.createLinearGradient(pitCenterX - pitWidth * 0.85, 0, pitCenterX + pitWidth * 0.85, 0);
  platformGradient.addColorStop(0, '#2a2a32');
  platformGradient.addColorStop(0.5, glowIntensity > 0 ? `rgba(55, 65, 70, ${0.9 + glowIntensity * 0.1})` : '#3a3a42');
  platformGradient.addColorStop(1, '#2a2a32');

  ctx.fillStyle = platformGradient;
  ctx.strokeStyle = glowIntensity > 0 ? `rgba(0, 240, 255, ${0.4 + glowIntensity * 0.4})` : 'rgba(0, 240, 255, 0.25)';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.rect(pitCenterX - pitWidth * 0.85, platformY, pitWidth * 1.7, 15);
  ctx.fill();
  ctx.stroke();

  // Tread plate pattern
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.04 + glowIntensity * 0.02})`;
  ctx.lineWidth = 1;
  for (let i = -10; i <= 10; i++) {
    const x1 = pitCenterX + i * 25 * scale;
    ctx.beginPath();
    ctx.moveTo(x1, platformY + 2);
    ctx.lineTo(x1 - 10, platformY + 13);
    ctx.stroke();
  }

  // Load cells (sensor points)
  const loadCells = [
    { x: -pitWidth * 0.7, y: platformY + 7 },
    { x: pitWidth * 0.7, y: platformY + 7 },
    { x: -pitWidth * 0.35, y: platformY + 7 },
    { x: pitWidth * 0.35, y: platformY + 7 },
  ];

  loadCells.forEach((cell) => {
    const glow = ctx.createRadialGradient(pitCenterX + cell.x, cell.y, 0, pitCenterX + cell.x, cell.y, 12);
    glow.addColorStop(0, `rgba(0, 240, 255, ${0.5 + glowIntensity * 0.5})`);
    glow.addColorStop(0.5, `rgba(0, 240, 255, ${0.15 * (1 + glowIntensity)})`);
    glow.addColorStop(1, 'transparent');

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(pitCenterX + cell.x, cell.y, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(pitCenterX + cell.x, cell.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Entry/exit ramps
  ctx.fillStyle = '#222228';
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';

  // Left ramp
  ctx.beginPath();
  ctx.moveTo(pitCenterX - pitWidth - 100, groundY);
  ctx.lineTo(pitCenterX - pitWidth, groundY);
  ctx.lineTo(pitCenterX - pitWidth * 0.9, groundY + pitDepth - 8);
  ctx.lineTo(pitCenterX - pitWidth - 50, groundY + pitDepth - 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right ramp
  ctx.beginPath();
  ctx.moveTo(pitCenterX + pitWidth + 100, groundY);
  ctx.lineTo(pitCenterX + pitWidth, groundY);
  ctx.lineTo(pitCenterX + pitWidth * 0.9, groundY + pitDepth - 8);
  ctx.lineTo(pitCenterX + pitWidth + 50, groundY + pitDepth - 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawTruck(
  ctx: CanvasRenderingContext2D,
  truckData: { x: number; y: number; scale: number; opacity: number; isMoving: boolean },
  vibration: number,
  time: number
) {
  const { x, y, scale, opacity, isMoving } = truckData;
  if (opacity <= 0.01) return;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.translate(x, y + vibration);
  ctx.scale(scale, scale);

  // Truck dimensions
  const cabLength = 100;
  const cabHeight = 90;
  const containerLength = 220;
  const containerHeight = 110;
  const wheelRadius = 30;

  // Shadow under truck
  ctx.fillStyle = `rgba(0, 0, 0, ${0.5 * opacity})`;
  ctx.beginPath();
  ctx.ellipse(50, 30, 180, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  // Container (trailer)
  const containerX = 20;
  const containerGradient = ctx.createLinearGradient(containerX, 0, containerX + containerLength, 0);
  containerGradient.addColorStop(0, '#282830');
  containerGradient.addColorStop(0.5, '#38383f');
  containerGradient.addColorStop(1, '#282830');

  ctx.fillStyle = containerGradient;
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(containerX, -containerHeight, containerLength, containerHeight, 4);
  ctx.fill();
  ctx.stroke();

  // Container top highlight
  ctx.fillStyle = '#484850';
  ctx.fillRect(containerX, -containerHeight, containerLength, 6);

  // Container ridges
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const rx = containerX + 20 + i * 42;
    ctx.strokeRect(rx, -containerHeight + 12, 35, containerHeight - 20);
  }

  // Cab
  const cabX = containerX - cabLength - 12;
  const cabGradient = ctx.createLinearGradient(cabX, 0, cabX + cabLength, 0);
  cabGradient.addColorStop(0, '#ff6600');
  cabGradient.addColorStop(0.5, '#ff8833');
  cabGradient.addColorStop(1, '#ff6600');

  ctx.fillStyle = cabGradient;
  ctx.strokeStyle = 'rgba(255, 120, 0, 0.5)';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(cabX, -cabHeight, cabLength, cabHeight, [14, 14, 4, 4]);
  ctx.fill();
  ctx.stroke();

  // Cab windshield
  ctx.fillStyle = 'rgba(0, 200, 255, 0.2)';
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cabX + 10, -cabHeight + 12, cabLength - 24, cabHeight * 0.45, 8);
  ctx.fill();
  ctx.stroke();

  // Headlights with glow
  const headlightX = cabX + 6;
  const headlightGlow = ctx.createRadialGradient(headlightX, -cabHeight * 0.35, 0, headlightX, -cabHeight * 0.35, 30);
  headlightGlow.addColorStop(0, 'rgba(255, 255, 220, 0.7)');
  headlightGlow.addColorStop(0.4, 'rgba(255, 255, 200, 0.2)');
  headlightGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = headlightGlow;
  ctx.beginPath();
  ctx.arc(headlightX, -cabHeight * 0.35, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 230, 0.9)';
  ctx.beginPath();
  ctx.arc(headlightX, -cabHeight * 0.35, 6, 0, Math.PI * 2);
  ctx.fill();

  // Wheels with rotation animation
  const wheelY = -5;
  const wheelRotation = isMoving ? time * 0.01 : 0;
  const wheelPositions = [
    cabX + cabLength * 0.35,
    containerX + 30,
    containerX + containerLength - 60,
    containerX + containerLength - 25,
  ];

  wheelPositions.forEach((wheelX) => {
    // Tire
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(wheelX, wheelY, wheelRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hubcap
    const hubGradient = ctx.createRadialGradient(wheelX, wheelY, 0, wheelX, wheelY, wheelRadius * 0.6);
    hubGradient.addColorStop(0, '#555');
    hubGradient.addColorStop(0.6, '#333');
    hubGradient.addColorStop(1, '#222');
    ctx.fillStyle = hubGradient;
    ctx.beginPath();
    ctx.arc(wheelX, wheelY, wheelRadius * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Hub spokes (rotating)
    ctx.save();
    ctx.translate(wheelX, wheelY);
    ctx.rotate(wheelRotation);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * wheelRadius * 0.5, Math.sin(angle) * wheelRadius * 0.5);
      ctx.stroke();
    }
    ctx.restore();

    // Hub center
    ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.beginPath();
    ctx.arc(wheelX, wheelY, wheelRadius * 0.12, 0, Math.PI * 2);
    ctx.fill();
  });

  // Tail lights
  ctx.fillStyle = 'rgba(255, 40, 40, 0.8)';
  ctx.fillRect(containerX + containerLength - 4, -containerHeight + 15, 4, 18);
  ctx.fillRect(containerX + containerLength - 4, -25, 4, 18);

  ctx.restore();
}

function drawWeightIndicator(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  weightValue: number,
  glowIntensity: number,
  weighProgress: number
) {
  if (glowIntensity < 0.05) return;

  const scale = Math.min(width / 1920, 1);
  const indicatorX = width - 140 * scale;
  const indicatorY = height * 0.25;

  // Indicator panel background
  ctx.fillStyle = `rgba(10, 12, 18, ${0.92 * glowIntensity})`;
  ctx.strokeStyle = `rgba(0, 240, 255, ${0.5 * glowIntensity})`;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(indicatorX - 110 * scale, indicatorY - 50 * scale, 200 * scale, 130 * scale, 8 * scale);
  ctx.fill();
  ctx.stroke();

  // "WEIGHT" label
  ctx.fillStyle = `rgba(0, 240, 255, ${0.7 * glowIntensity})`;
  ctx.font = `${12 * scale}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('WEIGHT', indicatorX, indicatorY - 25 * scale);

  // Weight value
  ctx.fillStyle = `rgba(0, 240, 255, ${glowIntensity})`;
  ctx.font = `bold ${36 * scale}px 'JetBrains Mono', monospace`;
  ctx.fillText(weightValue.toFixed(2), indicatorX, indicatorY + 15 * scale);

  // Unit
  ctx.fillStyle = `rgba(0, 240, 255, ${0.6 * glowIntensity})`;
  ctx.font = `${16 * scale}px 'JetBrains Mono', monospace`;
  ctx.fillText('TONS', indicatorX, indicatorY + 45 * scale);

  // Status indicator
  const statusColor = weighProgress > 0.5 ? 'rgba(0, 255, 150, 0.9)' : 'rgba(0, 240, 255, 0.9)';
  ctx.fillStyle = statusColor;
  ctx.beginPath();
  ctx.arc(indicatorX - 70 * scale, indicatorY - 25 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Status text
  ctx.fillStyle = statusColor;
  ctx.font = `${10 * scale}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'left';
  ctx.fillText(weighProgress > 0.5 ? 'CAPTURED' : 'MEASURING', indicatorX - 60 * scale, indicatorY - 22 * scale);
}

export default PitWeighbridgeCanvas;
