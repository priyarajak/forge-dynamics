import React, { useEffect, useRef } from 'react';
import { useAnimationLoop, getHeroProgress } from '@/hooks/useAnimationLoop';

interface AnimationPhase {
  name: string;
  start: number;
  end: number;
}

const PHASES: AnimationPhase[] = [
  { name: 'approach', start: 0, end: 0.25 },
  { name: 'descend', start: 0.25, end: 0.45 },
  { name: 'weigh', start: 0.45, end: 0.7 },
  { name: 'exit', start: 0.7, end: 1 },
];

function getPhaseProgress(progress: number, phase: AnimationPhase): number {
  if (progress < phase.start) return 0;
  if (progress > phase.end) return 1;
  return (progress - phase.start) / (phase.end - phase.start);
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutElastic(t: number): number {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

const TruckWeighingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    weightValue: 0,
    targetWeight: 87.45,
    vibration: 0,
    glowIntensity: 0,
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
    const approachProgress = getPhaseProgress(progress, PHASES[0]);
    const descendProgress = getPhaseProgress(progress, PHASES[1]);
    const weighProgress = getPhaseProgress(progress, PHASES[2]);
    const exitProgress = getPhaseProgress(progress, PHASES[3]);

    // Update weight display
    if (weighProgress > 0 && weighProgress < 1) {
      const targetWeight = stateRef.current.targetWeight;
      stateRef.current.weightValue += (targetWeight - stateRef.current.weightValue) * 0.05;
      stateRef.current.vibration = Math.sin(state.time * 0.05) * (1 - weighProgress) * 2;
      stateRef.current.glowIntensity = Math.min(weighProgress * 2, 1);
    } else if (exitProgress > 0) {
      stateRef.current.glowIntensity *= 0.95;
      stateRef.current.vibration *= 0.9;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw scene
    drawBackground(ctx, width, height, state.time);
    drawPitWeighbridge(ctx, width, height, stateRef.current.glowIntensity, stateRef.current.vibration);
    drawTruck(ctx, width, height, approachProgress, descendProgress, weighProgress, exitProgress, stateRef.current.vibration);
    drawWeightIndicator(ctx, width, height, stateRef.current.weightValue, stateRef.current.glowIntensity, weighProgress);
    drawParticles(ctx, width, height, state.time, progress);
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  // Animated grid
  const gridSize = 80;
  const pulse = Math.sin(time * 0.001) * 0.3 + 0.7;

  ctx.strokeStyle = `rgba(0, 240, 255, ${0.02 * pulse})`;
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

  // Road/ground
  const groundY = height * 0.7;
  const groundGradient = ctx.createLinearGradient(0, groundY - 100, 0, height);
  groundGradient.addColorStop(0, 'transparent');
  groundGradient.addColorStop(0.3, 'rgba(20, 20, 25, 0.8)');
  groundGradient.addColorStop(1, 'rgba(10, 10, 15, 1)');

  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, groundY - 100, width, height - groundY + 100);

  // Road markings
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 3;
  ctx.setLineDash([40, 30]);
  ctx.beginPath();
  ctx.moveTo(0, groundY + 20);
  ctx.lineTo(width, groundY + 20);
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
  const scale = Math.min(width / 1920, 1);
  const cx = width / 2;
  const groundY = height * 0.7;
  const pitDepth = 60 * scale;
  const platformWidth = 400 * scale;
  const platformLength = 250 * scale;

  // Pit shadow (deep)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.beginPath();
  ctx.moveTo(cx - platformWidth, groundY);
  ctx.lineTo(cx + platformWidth, groundY);
  ctx.lineTo(cx + platformWidth * 0.85, groundY + pitDepth);
  ctx.lineTo(cx - platformWidth * 0.85, groundY + pitDepth);
  ctx.closePath();
  ctx.fill();

  // Pit walls
  ctx.fillStyle = '#1a1a1f';
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
  ctx.lineWidth = 1;

  // Left wall
  ctx.beginPath();
  ctx.moveTo(cx - platformWidth, groundY);
  ctx.lineTo(cx - platformWidth * 0.85, groundY + pitDepth);
  ctx.lineTo(cx - platformWidth * 0.85, groundY + pitDepth + platformLength * 0.4);
  ctx.lineTo(cx - platformWidth, groundY + platformLength * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right wall
  ctx.beginPath();
  ctx.moveTo(cx + platformWidth, groundY);
  ctx.lineTo(cx + platformWidth * 0.85, groundY + pitDepth);
  ctx.lineTo(cx + platformWidth * 0.85, groundY + pitDepth + platformLength * 0.4);
  ctx.lineTo(cx + platformWidth, groundY + platformLength * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Platform surface with glow
  const platformY = groundY + pitDepth - 5 + vibration;

  if (glowIntensity > 0) {
    // Glow effect
    const glowGradient = ctx.createRadialGradient(
      cx, platformY + platformLength * 0.2, 0,
      cx, platformY + platformLength * 0.2, platformWidth * 1.5
    );
    glowGradient.addColorStop(0, `rgba(0, 240, 255, ${0.3 * glowIntensity})`);
    glowGradient.addColorStop(0.5, `rgba(0, 240, 255, ${0.1 * glowIntensity})`);
    glowGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = glowGradient;
    ctx.fillRect(cx - platformWidth * 1.5, platformY - 50, platformWidth * 3, platformLength + 100);
  }

  // Platform top
  const platformGradient = ctx.createLinearGradient(cx - platformWidth * 0.85, 0, cx + platformWidth * 0.85, 0);
  platformGradient.addColorStop(0, '#2a2a30');
  platformGradient.addColorStop(0.5, glowIntensity > 0 ? `rgba(50, 60, 65, ${0.8 + glowIntensity * 0.2})` : '#3a3a40');
  platformGradient.addColorStop(1, '#2a2a30');

  ctx.fillStyle = platformGradient;
  ctx.strokeStyle = glowIntensity > 0 ? `rgba(0, 240, 255, ${0.4 + glowIntensity * 0.4})` : 'rgba(0, 240, 255, 0.3)';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(cx - platformWidth * 0.85, platformY);
  ctx.lineTo(cx + platformWidth * 0.85, platformY);
  ctx.lineTo(cx + platformWidth * 0.75, platformY + platformLength * 0.4);
  ctx.lineTo(cx - platformWidth * 0.75, platformY + platformLength * 0.4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Tread plate pattern
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + glowIntensity * 0.02})`;
  ctx.lineWidth = 1;
  for (let i = -12; i <= 12; i++) {
    const x1 = cx + i * 20 * scale;
    ctx.beginPath();
    ctx.moveTo(x1, platformY + 5);
    ctx.lineTo(x1 - 15 * scale, platformY + platformLength * 0.35);
    ctx.stroke();
  }

  // Load cells (glowing points)
  const loadCells = [
    { x: -platformWidth * 0.6, y: platformY + platformLength * 0.1 },
    { x: platformWidth * 0.6, y: platformY + platformLength * 0.1 },
    { x: -platformWidth * 0.6, y: platformY + platformLength * 0.3 },
    { x: platformWidth * 0.6, y: platformY + platformLength * 0.3 },
  ];

  loadCells.forEach((cell) => {
    const cellGlow = ctx.createRadialGradient(cx + cell.x, cell.y, 0, cx + cell.x, cell.y, 15 * scale);
    cellGlow.addColorStop(0, `rgba(0, 240, 255, ${0.6 + glowIntensity * 0.4})`);
    cellGlow.addColorStop(0.5, `rgba(0, 240, 255, ${0.2 * (1 + glowIntensity)})`);
    cellGlow.addColorStop(1, 'transparent');

    ctx.fillStyle = cellGlow;
    ctx.beginPath();
    ctx.arc(cx + cell.x, cell.y, 15 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(cx + cell.x, cell.y, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  // Entry/exit ramps
  ctx.fillStyle = '#252530';
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';

  // Entry ramp (front)
  ctx.beginPath();
  ctx.moveTo(cx - platformWidth * 0.75, platformY + platformLength * 0.4);
  ctx.lineTo(cx + platformWidth * 0.75, platformY + platformLength * 0.4);
  ctx.lineTo(cx + platformWidth * 0.9, platformY + platformLength * 0.6);
  ctx.lineTo(cx - platformWidth * 0.9, platformY + platformLength * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawTruck(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  approachProgress: number,
  descendProgress: number,
  weighProgress: number,
  exitProgress: number,
  vibration: number
) {
  const scale = Math.min(width / 1920, 1) * 0.85;
  const cx = width / 2;
  const groundY = height * 0.7;
  const pitDepth = 60 * scale;

  // Calculate truck position based on phases
  let truckX = cx;
  let truckY = groundY - 30 * scale;
  let truckScale = 1;
  let shadowScale = 1;

  // Phase 1: Approach (truck comes from distance)
  if (approachProgress < 1) {
    const t = easeOutCubic(approachProgress);
    truckScale = 0.3 + t * 0.7;
    truckY = groundY - 200 * scale + t * 170 * scale;
    shadowScale = 0.3 + t * 0.7;
  }

  // Phase 2: Descend into pit
  if (descendProgress > 0 && descendProgress < 1) {
    const t = easeInOutCubic(descendProgress);
    truckY = groundY - 30 * scale + t * (pitDepth - 10);
  } else if (descendProgress >= 1) {
    truckY = groundY - 30 * scale + pitDepth - 10;
  }

  // Phase 3: Weighing (slight settle + vibration)
  if (weighProgress > 0 && weighProgress < 1) {
    truckY += vibration;
    // Subtle bounce at start
    if (weighProgress < 0.2) {
      const bounceT = weighProgress / 0.2;
      truckY += Math.sin(bounceT * Math.PI * 3) * 3 * (1 - bounceT);
    }
  }

  // Phase 4: Exit (truck drives away)
  if (exitProgress > 0) {
    const t = easeInOutCubic(exitProgress);
    // Rise out of pit
    truckY = groundY - 30 * scale + pitDepth - 10 - t * pitDepth;
    // Move forward and shrink (going into distance)
    truckY -= t * 150 * scale;
    truckScale = 1 - t * 0.6;
    shadowScale = 1 - t * 0.7;
  }

  // Draw shadow
  ctx.fillStyle = `rgba(0, 0, 0, ${0.4 * shadowScale})`;
  ctx.beginPath();
  ctx.ellipse(truckX, truckY + 60 * scale * truckScale, 180 * scale * truckScale, 25 * scale * truckScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Save context for truck transform
  ctx.save();
  ctx.translate(truckX, truckY);
  ctx.scale(truckScale, truckScale);

  // Truck dimensions
  const truckLength = 280 * scale;
  const cabLength = 90 * scale;
  const cabHeight = 80 * scale;
  const containerHeight = 100 * scale;
  const containerLength = 180 * scale;
  const wheelRadius = 28 * scale;

  // Container (trailer)
  const containerGradient = ctx.createLinearGradient(-containerLength / 2, 0, containerLength / 2, 0);
  containerGradient.addColorStop(0, '#2a2a30');
  containerGradient.addColorStop(0.5, '#3a3a42');
  containerGradient.addColorStop(1, '#2a2a30');

  ctx.fillStyle = containerGradient;
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
  ctx.lineWidth = 2;

  // Container body
  ctx.beginPath();
  ctx.roundRect(-containerLength / 2, -containerHeight, containerLength, containerHeight, 4);
  ctx.fill();
  ctx.stroke();

  // Container top highlight
  ctx.fillStyle = '#4a4a52';
  ctx.fillRect(-containerLength / 2, -containerHeight, containerLength, 6 * scale);

  // Container side panels
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const panelX = -containerLength / 2 + 20 * scale + i * 40 * scale;
    ctx.strokeRect(panelX, -containerHeight + 15 * scale, 30 * scale, containerHeight - 25 * scale);
  }

  // Cab
  const cabX = -containerLength / 2 - cabLength - 10 * scale;
  const cabGradient = ctx.createLinearGradient(cabX, 0, cabX + cabLength, 0);
  cabGradient.addColorStop(0, '#ff6b00');
  cabGradient.addColorStop(0.5, '#ff8533');
  cabGradient.addColorStop(1, '#ff6b00');

  ctx.fillStyle = cabGradient;
  ctx.strokeStyle = 'rgba(255, 107, 0, 0.6)';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(cabX, -cabHeight, cabLength, cabHeight, [12 * scale, 12 * scale, 4, 4]);
  ctx.fill();
  ctx.stroke();

  // Cab windshield
  ctx.fillStyle = 'rgba(0, 200, 255, 0.25)';
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cabX + 8 * scale, -cabHeight + 12 * scale, cabLength - 20 * scale, cabHeight * 0.45, 6 * scale);
  ctx.fill();
  ctx.stroke();

  // Headlights
  const headlightGlow = ctx.createRadialGradient(cabX + 5 * scale, -cabHeight * 0.35, 0, cabX + 5 * scale, -cabHeight * 0.35, 25 * scale);
  headlightGlow.addColorStop(0, 'rgba(255, 255, 200, 0.8)');
  headlightGlow.addColorStop(0.5, 'rgba(255, 255, 200, 0.2)');
  headlightGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = headlightGlow;
  ctx.beginPath();
  ctx.arc(cabX + 5 * scale, -cabHeight * 0.35, 25 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Wheels
  const wheelY = -5 * scale;
  const wheelPositions = [
    cabX + cabLength * 0.3,
    -containerLength / 2 + 30 * scale,
    containerLength / 2 - 50 * scale,
    containerLength / 2 - 20 * scale,
  ];

  wheelPositions.forEach((wheelX, index) => {
    // Tire
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(wheelX, wheelY, wheelRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hubcap
    const hubGradient = ctx.createRadialGradient(wheelX, wheelY, 0, wheelX, wheelY, wheelRadius * 0.65);
    hubGradient.addColorStop(0, '#555');
    hubGradient.addColorStop(0.7, '#333');
    hubGradient.addColorStop(1, '#222');
    ctx.fillStyle = hubGradient;
    ctx.beginPath();
    ctx.arc(wheelX, wheelY, wheelRadius * 0.65, 0, Math.PI * 2);
    ctx.fill();

    // Hub center
    ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(wheelX, wheelY, wheelRadius * 0.15, 0, Math.PI * 2);
    ctx.fill();
  });

  // Tail lights
  ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
  ctx.fillRect(containerLength / 2 - 5 * scale, -containerHeight + 20 * scale, 4 * scale, 15 * scale);
  ctx.fillRect(containerLength / 2 - 5 * scale, -30 * scale, 4 * scale, 15 * scale);

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
  if (glowIntensity < 0.1) return;

  const scale = Math.min(width / 1920, 1);
  const indicatorX = width - 120 * scale;
  const indicatorY = height * 0.35;

  // Indicator panel
  ctx.fillStyle = `rgba(10, 15, 20, ${0.9 * glowIntensity})`;
  ctx.strokeStyle = `rgba(0, 240, 255, ${0.5 * glowIntensity})`;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(indicatorX - 100 * scale, indicatorY - 60 * scale, 180 * scale, 120 * scale, 8 * scale);
  ctx.fill();
  ctx.stroke();

  // Display glow
  const displayGlow = ctx.createRadialGradient(
    indicatorX - 10 * scale, indicatorY, 0,
    indicatorX - 10 * scale, indicatorY, 100 * scale
  );
  displayGlow.addColorStop(0, `rgba(0, 240, 255, ${0.15 * glowIntensity})`);
  displayGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = displayGlow;
  ctx.fillRect(indicatorX - 100 * scale, indicatorY - 60 * scale, 180 * scale, 120 * scale);

  // Weight value
  ctx.fillStyle = `rgba(0, 240, 255, ${glowIntensity})`;
  ctx.font = `bold ${36 * scale}px "JetBrains Mono", monospace`;
  ctx.textAlign = 'center';
  ctx.fillText(weightValue.toFixed(2), indicatorX - 10 * scale, indicatorY + 10 * scale);

  // Unit label
  ctx.fillStyle = `rgba(0, 240, 255, ${0.7 * glowIntensity})`;
  ctx.font = `${14 * scale}px "JetBrains Mono", monospace`;
  ctx.fillText('TONS', indicatorX - 10 * scale, indicatorY + 35 * scale);

  // Status label
  ctx.fillStyle = `rgba(0, 240, 255, ${0.5 * glowIntensity})`;
  ctx.font = `${10 * scale}px "Space Grotesk", sans-serif`;
  ctx.fillText('GROSS WEIGHT', indicatorX - 10 * scale, indicatorY - 35 * scale);

  // Status indicator
  if (weighProgress > 0.3 && weighProgress < 0.9) {
    ctx.fillStyle = `rgba(0, 255, 100, ${glowIntensity})`;
    ctx.beginPath();
    ctx.arc(indicatorX + 50 * scale, indicatorY - 35 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  progress: number
) {
  const particleCount = 25;

  for (let i = 0; i < particleCount; i++) {
    const seed = i * 1234.5678;
    const x = (seed * 9.8) % width;
    const baseY = (seed * 7.3) % height;
    const y = baseY + Math.sin(time * 0.001 + seed) * 15;
    const size = 1 + (seed % 2);
    const alpha = 0.05 + (Math.sin(time * 0.002 + seed) * 0.5 + 0.5) * 0.1;

    ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default TruckWeighingCanvas;
