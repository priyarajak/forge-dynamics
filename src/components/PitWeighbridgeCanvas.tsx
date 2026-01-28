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
  enter: { start: 0, end: 0.2 },       // Truck enters from left
  climb: { start: 0.2, end: 0.35 },    // Truck climbs up onto weighbridge
  weigh: { start: 0.35, end: 0.6 },    // Weighing pause
  descend: { start: 0.6, end: 0.75 },  // Truck descends from weighbridge
  exit: { start: 0.75, end: 1 },       // Truck exits to right
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
    const climbProgress = getPhaseProgress(progress, PHASES.climb);
    const weighProgress = getPhaseProgress(progress, PHASES.weigh);
    const descendProgress = getPhaseProgress(progress, PHASES.descend);
    const exitProgress = getPhaseProgress(progress, PHASES.exit);

    // Calculate truck position
    const truckData = calculateTruckPosition(
      width,
      height,
      enterProgress,
      climbProgress,
      weighProgress,
      descendProgress,
      exitProgress
    );

    // Update weight display during weigh phase
    if (weighProgress > 0 && weighProgress < 1) {
      const targetWeight = stateRef.current.targetWeight;
      stateRef.current.weightValue += (targetWeight - stateRef.current.weightValue) * 0.03;
      stateRef.current.glowIntensity = Math.min(weighProgress * 2, 1);
      stateRef.current.vibration = Math.sin(state.time * 0.04) * (1 - weighProgress) * 2;
    } else if (descendProgress > 0 || exitProgress > 0) {
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
    drawElevatedWeighbridge(ctx, width, height, stateRef.current.glowIntensity, stateRef.current.vibration);
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
  climbProgress: number,
  weighProgress: number,
  descendProgress: number,
  exitProgress: number
) {
  const groundY = height * 0.68;
  const pitCenterX = width * 0.5;
  const platformHeight = 45; // Platform is ABOVE ground
  const scale = Math.min(width / 1920, 1);

  // Starting position (off-screen left)
  let x = -350;
  let y = groundY;
  let truckScale = 0.85;
  let opacity = 1;
  let isMoving = false;

  // Phase 1: Enter from left (truck facing right)
  if (enterProgress > 0) {
    const t = easeOutCubic(enterProgress);
    x = -350 + t * (pitCenterX - 50);
    isMoving = enterProgress < 1;
  }

  // Phase 2: Climb UP onto elevated weighbridge
  if (climbProgress > 0) {
    const t = easeInOutCubic(climbProgress);
    x = pitCenterX - 50 + t * 50;
    y = groundY - t * platformHeight; // Move UP
    isMoving = climbProgress < 1;
  }

  // Phase 3: Weighing (on platform)
  if (weighProgress > 0 && descendProgress === 0) {
    x = pitCenterX;
    y = groundY - platformHeight;
    isMoving = false;
  }

  // Phase 4: Descend from weighbridge
  if (descendProgress > 0) {
    const t = easeInOutCubic(descendProgress);
    x = pitCenterX + t * 50;
    y = groundY - platformHeight + t * platformHeight; // Move DOWN
    isMoving = descendProgress < 1;
  }

  // Phase 5: Exit to right
  if (exitProgress > 0) {
    const t = easeInCubic(exitProgress);
    x = pitCenterX + 50 + t * (width - pitCenterX + 300);
    y = groundY;
    opacity = 1 - easeInCubic(exitProgress * 1.2);
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

  // Add new particles behind truck (exhaust on left side since truck faces right)
  if (isMoving && particles.length < 25) {
    for (let i = 0; i < 2; i++) {
      particles.push({
        x: truckX - 140 + Math.random() * 15,
        y: truckY - 25 + Math.random() * 15,
        vx: -0.8 - Math.random() * 1.5,
        vy: -0.4 - Math.random() * 1.2,
        life: 0.8 + Math.random() * 0.4,
        maxLife: 1.2,
        size: 6 + Math.random() * 10,
        opacity: 0.25 + Math.random() * 0.15,
      });
    }
  }

  // Update particle positions
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy -= 0.015; // Drift upward
    p.vx *= 0.98;
    p.size *= 1.008;
  });
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach((p) => {
    const lifeRatio = p.life / p.maxLife;
    const alpha = p.opacity * lifeRatio;

    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    gradient.addColorStop(0, `rgba(160, 160, 160, ${alpha * 0.4})`);
    gradient.addColorStop(0.5, `rgba(100, 100, 100, ${alpha * 0.2})`);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  // Subtle animated grid
  const gridSize = 80;
  const pulse = Math.sin(time * 0.001) * 0.3 + 0.7;

  ctx.strokeStyle = `rgba(0, 240, 255, ${0.012 * pulse})`;
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
  const groundY = height * 0.68;

  // Road surface gradient
  const roadGradient = ctx.createLinearGradient(0, groundY - 30, 0, height);
  roadGradient.addColorStop(0, 'transparent');
  roadGradient.addColorStop(0.15, 'rgba(22, 22, 28, 0.9)');
  roadGradient.addColorStop(1, 'rgba(12, 12, 16, 1)');

  ctx.fillStyle = roadGradient;
  ctx.fillRect(0, groundY - 30, width, height - groundY + 30);

  // Road edge
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  ctx.lineTo(width, groundY);
  ctx.stroke();

  // Center line dashes
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 3;
  ctx.setLineDash([45, 35]);
  ctx.beginPath();
  ctx.moveTo(0, groundY + 35);
  ctx.lineTo(width, groundY + 35);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawElevatedWeighbridge(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  glowIntensity: number,
  vibration: number
) {
  const groundY = height * 0.68;
  const pitCenterX = width * 0.5;
  const platformWidth = 320;
  const platformHeight = 45;
  const platformTop = groundY - platformHeight;

  // Platform shadow on ground
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(pitCenterX, groundY + 10, platformWidth * 0.9, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Left ramp
  ctx.fillStyle = '#1e1e24';
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pitCenterX - platformWidth - 80, groundY);
  ctx.lineTo(pitCenterX - platformWidth, groundY);
  ctx.lineTo(pitCenterX - platformWidth, platformTop + vibration);
  ctx.lineTo(pitCenterX - platformWidth - 80, groundY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right ramp
  ctx.beginPath();
  ctx.moveTo(pitCenterX + platformWidth + 80, groundY);
  ctx.lineTo(pitCenterX + platformWidth, groundY);
  ctx.lineTo(pitCenterX + platformWidth, platformTop + vibration);
  ctx.lineTo(pitCenterX + platformWidth + 80, groundY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Platform base/supports
  ctx.fillStyle = '#151518';
  ctx.beginPath();
  ctx.moveTo(pitCenterX - platformWidth, groundY);
  ctx.lineTo(pitCenterX + platformWidth, groundY);
  ctx.lineTo(pitCenterX + platformWidth, platformTop + vibration);
  ctx.lineTo(pitCenterX - platformWidth, platformTop + vibration);
  ctx.closePath();
  ctx.fill();

  // Support pillars
  ctx.fillStyle = '#1a1a1f';
  const pillarWidth = 25;
  const pillarPositions = [-platformWidth * 0.7, -platformWidth * 0.3, platformWidth * 0.3, platformWidth * 0.7];
  pillarPositions.forEach((offset) => {
    ctx.fillRect(pitCenterX + offset - pillarWidth / 2, platformTop + vibration, pillarWidth, platformHeight);
  });

  // Platform glow effect
  if (glowIntensity > 0) {
    const glowGradient = ctx.createRadialGradient(
      pitCenterX, platformTop + vibration - 20, 0,
      pitCenterX, platformTop + vibration - 20, platformWidth * 1.3
    );
    glowGradient.addColorStop(0, `rgba(0, 240, 255, ${0.2 * glowIntensity})`);
    glowGradient.addColorStop(0.4, `rgba(0, 240, 255, ${0.06 * glowIntensity})`);
    glowGradient.addColorStop(1, 'transparent');

    ctx.fillStyle = glowGradient;
    ctx.fillRect(pitCenterX - platformWidth * 1.5, platformTop - 100, platformWidth * 3, 150);
  }

  // Platform deck surface
  const deckGradient = ctx.createLinearGradient(pitCenterX - platformWidth, 0, pitCenterX + platformWidth, 0);
  deckGradient.addColorStop(0, '#28282e');
  deckGradient.addColorStop(0.5, glowIntensity > 0 ? `rgba(50, 58, 62, ${0.9 + glowIntensity * 0.1})` : '#38383e');
  deckGradient.addColorStop(1, '#28282e');

  ctx.fillStyle = deckGradient;
  ctx.strokeStyle = glowIntensity > 0 ? `rgba(0, 240, 255, ${0.35 + glowIntensity * 0.4})` : 'rgba(0, 240, 255, 0.2)';
  ctx.lineWidth = 2;

  const deckY = platformTop - 12 + vibration;
  ctx.beginPath();
  ctx.rect(pitCenterX - platformWidth, deckY, platformWidth * 2, 14);
  ctx.fill();
  ctx.stroke();

  // Tread plate pattern
  ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + glowIntensity * 0.015})`;
  ctx.lineWidth = 1;
  for (let i = -12; i <= 12; i++) {
    const x1 = pitCenterX + i * 22;
    ctx.beginPath();
    ctx.moveTo(x1, deckY + 2);
    ctx.lineTo(x1 - 8, deckY + 12);
    ctx.stroke();
  }

  // Load cells (sensor indicators)
  const loadCells = [
    { x: -platformWidth * 0.75 },
    { x: platformWidth * 0.75 },
    { x: -platformWidth * 0.25 },
    { x: platformWidth * 0.25 },
  ];

  loadCells.forEach((cell) => {
    const cellX = pitCenterX + cell.x;
    const cellY = deckY + 7;

    const glow = ctx.createRadialGradient(cellX, cellY, 0, cellX, cellY, 10);
    glow.addColorStop(0, `rgba(0, 240, 255, ${0.5 + glowIntensity * 0.5})`);
    glow.addColorStop(0.5, `rgba(0, 240, 255, ${0.12 * (1 + glowIntensity)})`);
    glow.addColorStop(1, 'transparent');

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cellX, cellY, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(cellX, cellY, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });
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
  ctx.scale(scale, scale); // Truck facing RIGHT (no mirror)

  // Truck dimensions
  const cabLength = 95;
  const cabHeight = 85;
  const containerLength = 210;
  const containerHeight = 105;
  const wheelRadius = 28;

  // Shadow under truck
  ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * opacity})`;
  ctx.beginPath();
  ctx.ellipse(50, 28, 170, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  // Container (trailer) - positioned to the RIGHT of cab
  const containerX = cabLength + 15;
  const containerGradient = ctx.createLinearGradient(containerX, 0, containerX + containerLength, 0);
  containerGradient.addColorStop(0, '#262630');
  containerGradient.addColorStop(0.5, '#36363e');
  containerGradient.addColorStop(1, '#262630');

  ctx.fillStyle = containerGradient;
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(containerX, -containerHeight, containerLength, containerHeight, 4);
  ctx.fill();
  ctx.stroke();

  // Container top highlight
  ctx.fillStyle = '#46464e';
  ctx.fillRect(containerX, -containerHeight, containerLength, 5);

  // Container ridges
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const rx = containerX + 18 + i * 40;
    ctx.strokeRect(rx, -containerHeight + 10, 32, containerHeight - 18);
  }

  // Cab (front of truck, facing RIGHT)
  const cabX = 0;
  const cabGradient = ctx.createLinearGradient(cabX, 0, cabX + cabLength, 0);
  cabGradient.addColorStop(0, '#ff6600');
  cabGradient.addColorStop(0.5, '#ff8530');
  cabGradient.addColorStop(1, '#ff6600');

  ctx.fillStyle = cabGradient;
  ctx.strokeStyle = 'rgba(255, 115, 0, 0.45)';
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(cabX, -cabHeight, cabLength, cabHeight, [12, 12, 4, 4]);
  ctx.fill();
  ctx.stroke();

  // Cab windshield (on the RIGHT side of cab since truck faces right)
  ctx.fillStyle = 'rgba(0, 200, 255, 0.18)';
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(cabX + cabLength - 35, -cabHeight + 10, 28, cabHeight * 0.42, 6);
  ctx.fill();
  ctx.stroke();

  // Headlights (on RIGHT side - front of truck)
  const headlightX = cabX + cabLength - 5;
  const headlightGlow = ctx.createRadialGradient(headlightX, -cabHeight * 0.38, 0, headlightX, -cabHeight * 0.38, 28);
  headlightGlow.addColorStop(0, 'rgba(255, 255, 210, 0.65)');
  headlightGlow.addColorStop(0.35, 'rgba(255, 255, 190, 0.15)');
  headlightGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = headlightGlow;
  ctx.beginPath();
  ctx.arc(headlightX, -cabHeight * 0.38, 28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 220, 0.85)';
  ctx.beginPath();
  ctx.arc(headlightX, -cabHeight * 0.38, 5, 0, Math.PI * 2);
  ctx.fill();

  // Wheels with rotation animation
  const wheelY = -4;
  const wheelRotation = isMoving ? time * 0.012 : 0;
  const wheelPositions = [
    cabX + cabLength * 0.35, // Front cab wheel
    containerX + 25,         // First trailer wheel
    containerX + containerLength - 55, // Third trailer wheel
    containerX + containerLength - 22, // Fourth trailer wheel
  ];

  wheelPositions.forEach((wheelX) => {
    // Tire
    ctx.fillStyle = '#181818';
    ctx.strokeStyle = '#282828';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(wheelX, wheelY, wheelRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hubcap
    const hubGradient = ctx.createRadialGradient(wheelX, wheelY, 0, wheelX, wheelY, wheelRadius * 0.58);
    hubGradient.addColorStop(0, '#525252');
    hubGradient.addColorStop(0.6, '#323232');
    hubGradient.addColorStop(1, '#202020');
    ctx.fillStyle = hubGradient;
    ctx.beginPath();
    ctx.arc(wheelX, wheelY, wheelRadius * 0.58, 0, Math.PI * 2);
    ctx.fill();

    // Spokes (rotating)
    ctx.save();
    ctx.translate(wheelX, wheelY);
    ctx.rotate(wheelRotation);
    ctx.strokeStyle = '#404040';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * wheelRadius * 0.48, Math.sin(angle) * wheelRadius * 0.48);
      ctx.stroke();
    }
    ctx.restore();

    // Hub center
    ctx.fillStyle = 'rgba(0, 240, 255, 0.22)';
    ctx.beginPath();
    ctx.arc(wheelX, wheelY, wheelRadius * 0.1, 0, Math.PI * 2);
    ctx.fill();
  });

  // Tail lights (on LEFT side - back of trailer)
  ctx.fillStyle = 'rgba(255, 35, 35, 0.75)';
  ctx.fillRect(containerX + containerLength - 3, -containerHeight + 12, 3, 16);
  ctx.fillRect(containerX + containerLength - 3, -22, 3, 16);

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
  const indicatorX = width - 130 * scale;
  const indicatorY = height * 0.28;

  // Panel background
  ctx.fillStyle = `rgba(8, 10, 15, ${0.9 * glowIntensity})`;
  ctx.strokeStyle = `rgba(0, 240, 255, ${0.45 * glowIntensity})`;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(indicatorX - 100 * scale, indicatorY - 45 * scale, 185 * scale, 115 * scale, 6 * scale);
  ctx.fill();
  ctx.stroke();

  // Label
  ctx.fillStyle = `rgba(0, 240, 255, ${0.65 * glowIntensity})`;
  ctx.font = `${11 * scale}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('WEIGHT', indicatorX, indicatorY - 20 * scale);

  // Weight value
  ctx.fillStyle = `rgba(0, 240, 255, ${glowIntensity})`;
  ctx.font = `bold ${34 * scale}px 'JetBrains Mono', monospace`;
  ctx.fillText(weightValue.toFixed(2), indicatorX, indicatorY + 12 * scale);

  // Unit
  ctx.fillStyle = `rgba(0, 240, 255, ${0.55 * glowIntensity})`;
  ctx.font = `${14 * scale}px 'JetBrains Mono', monospace`;
  ctx.fillText('TONS', indicatorX, indicatorY + 40 * scale);

  // Status dot
  const statusColor = weighProgress > 0.5 ? 'rgba(0, 255, 140, 0.85)' : 'rgba(0, 240, 255, 0.85)';
  ctx.fillStyle = statusColor;
  ctx.beginPath();
  ctx.arc(indicatorX - 65 * scale, indicatorY - 20 * scale, 3.5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Status text
  ctx.fillStyle = statusColor;
  ctx.font = `${9 * scale}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'left';
  ctx.fillText(weighProgress > 0.5 ? 'CAPTURED' : 'MEASURING', indicatorX - 55 * scale, indicatorY - 17 * scale);
}

export default PitWeighbridgeCanvas;
