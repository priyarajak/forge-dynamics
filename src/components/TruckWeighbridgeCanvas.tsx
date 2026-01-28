import React, { useEffect, useRef } from 'react';
import { useAnimationLoop, getHeroProgress } from '@/hooks/useAnimationLoop';

const TruckWeighbridgeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationStateRef = useRef({
    rotation: 0,
    targetRotation: 0,
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
    const width = canvas.width / Math.min(window.devicePixelRatio, 2);
    const height = canvas.height / Math.min(window.devicePixelRatio, 2);

    // Target rotation based on scroll (0 to 360 degrees)
    animationStateRef.current.targetRotation = progress * Math.PI * 2;
    
    // Smooth lerp for rotation
    const diff = animationStateRef.current.targetRotation - animationStateRef.current.rotation;
    animationStateRef.current.rotation += diff * 0.1;

    const rotation = animationStateRef.current.rotation;
    const centerX = width / 2;
    const centerY = height / 2 + 50;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background grid
    drawGrid(ctx, width, height, state.time);

    // Draw weighbridge (stable)
    drawWeighbridge(ctx, centerX, centerY, width);

    // Draw truck (rotating)
    drawTruck(ctx, centerX, centerY - 60, rotation, width);

    // Draw ambient particles
    drawParticles(ctx, width, height, state.time, rotation);
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
  const gridSize = 60;
  const pulse = Math.sin(time * 0.001) * 0.3 + 0.7;

  ctx.strokeStyle = `rgba(0, 240, 255, ${0.03 * pulse})`;
  ctx.lineWidth = 1;

  // Horizontal lines
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Vertical lines
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
}

function drawWeighbridge(ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number) {
  const scale = Math.min(width / 1920, 1);
  const platformWidth = 500 * scale;
  const platformHeight = 30 * scale;
  const platformDepth = 200 * scale;

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 100 * scale, platformWidth * 0.8, 40 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Foundation (back)
  ctx.fillStyle = '#1a1a1a';
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
  ctx.lineWidth = 2;
  
  // 3D Foundation
  ctx.beginPath();
  ctx.moveTo(cx - platformWidth, cy + platformDepth * 0.3);
  ctx.lineTo(cx + platformWidth, cy + platformDepth * 0.3);
  ctx.lineTo(cx + platformWidth * 0.9, cy + platformDepth * 0.6);
  ctx.lineTo(cx - platformWidth * 0.9, cy + platformDepth * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Platform top surface
  const gradient = ctx.createLinearGradient(cx - platformWidth, cy, cx + platformWidth, cy);
  gradient.addColorStop(0, '#2a2a2a');
  gradient.addColorStop(0.5, '#3a3a3a');
  gradient.addColorStop(1, '#2a2a2a');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(cx - platformWidth, cy - platformHeight);
  ctx.lineTo(cx + platformWidth, cy - platformHeight);
  ctx.lineTo(cx + platformWidth * 0.9, cy + platformDepth * 0.3);
  ctx.lineTo(cx - platformWidth * 0.9, cy + platformDepth * 0.3);
  ctx.closePath();
  ctx.fill();

  // Platform edge highlight
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Tread plate pattern
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = -15; i <= 15; i++) {
    const x1 = cx + i * 25 * scale;
    ctx.beginPath();
    ctx.moveTo(x1, cy - platformHeight + 5);
    ctx.lineTo(x1 - 30 * scale, cy + platformDepth * 0.25);
    ctx.stroke();
  }

  // Load cell indicators (glowing dots)
  const loadCellPositions = [
    { x: -platformWidth * 0.7, y: platformDepth * 0.1 },
    { x: platformWidth * 0.7, y: platformDepth * 0.1 },
    { x: -platformWidth * 0.7, y: platformDepth * 0.4 },
    { x: platformWidth * 0.7, y: platformDepth * 0.4 },
  ];

  loadCellPositions.forEach(pos => {
    const glowGradient = ctx.createRadialGradient(
      cx + pos.x, cy + pos.y, 0,
      cx + pos.x, cy + pos.y, 20 * scale
    );
    glowGradient.addColorStop(0, 'rgba(0, 240, 255, 0.8)');
    glowGradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.2)');
    glowGradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
    
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(cx + pos.x, cy + pos.y, 20 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#00f0ff';
    ctx.beginPath();
    ctx.arc(cx + pos.x, cy + pos.y, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawTruck(ctx: CanvasRenderingContext2D, cx: number, cy: number, rotation: number, width: number) {
  const scale = Math.min(width / 1920, 1) * 0.9;
  
  // Normalize rotation to 0-2PI
  const normalizedRotation = ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  
  // Calculate perspective based on rotation
  const perspectiveX = Math.cos(rotation);
  const perspectiveZ = Math.sin(rotation);
  
  // Truck dimensions
  const truckLength = 300 * scale;
  const truckWidth = 100 * scale;
  const cabLength = 80 * scale;
  const cabHeight = 70 * scale;
  const containerHeight = 90 * scale;
  const wheelRadius = 25 * scale;

  ctx.save();
  ctx.translate(cx, cy);

  // Determine which side to show based on rotation
  const showingFront = normalizedRotation > Math.PI * 0.5 && normalizedRotation < Math.PI * 1.5;
  const showingLeft = normalizedRotation > Math.PI && normalizedRotation < Math.PI * 2;
  
  // Draw shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 80 * scale, truckLength * 0.7 * Math.abs(perspectiveX) + truckWidth * 0.5, 30 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Calculate truck body positions based on rotation
  const bodyOffsetX = perspectiveX * truckLength * 0.3;
  const depthScale = 0.3 + Math.abs(perspectiveZ) * 0.3;

  // Draw container (back part)
  const containerWidth = truckLength * Math.abs(perspectiveX) + truckWidth * Math.abs(perspectiveZ);
  
  // Container back
  if (perspectiveZ < 0) {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(-containerWidth * 0.5 + bodyOffsetX * 0.3, -containerHeight, containerWidth * 0.8, containerHeight);
  }

  // Container side
  const containerGradient = ctx.createLinearGradient(
    -containerWidth * 0.5, 0,
    containerWidth * 0.5, 0
  );
  containerGradient.addColorStop(0, showingLeft ? '#3a3a3a' : '#2a2a2a');
  containerGradient.addColorStop(0.5, '#4a4a4a');
  containerGradient.addColorStop(1, showingLeft ? '#2a2a2a' : '#3a3a3a');

  ctx.fillStyle = containerGradient;
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  ctx.rect(-containerWidth * 0.5 + bodyOffsetX * 0.3, -containerHeight, containerWidth * 0.8, containerHeight);
  ctx.fill();
  ctx.stroke();

  // Container top highlight
  ctx.fillStyle = '#5a5a5a';
  ctx.fillRect(-containerWidth * 0.5 + bodyOffsetX * 0.3, -containerHeight, containerWidth * 0.8, 5 * scale);

  // Cab
  const cabOffsetX = showingFront ? -containerWidth * 0.35 : containerWidth * 0.35;
  const actualCabOffset = cabOffsetX * (showingFront ? 1 : -1) + bodyOffsetX;
  
  const cabGradient = ctx.createLinearGradient(
    actualCabOffset - cabLength * 0.5, 0,
    actualCabOffset + cabLength * 0.5, 0
  );
  cabGradient.addColorStop(0, '#ff6b00');
  cabGradient.addColorStop(0.5, '#ff8c40');
  cabGradient.addColorStop(1, '#ff6b00');

  ctx.fillStyle = cabGradient;
  ctx.strokeStyle = 'rgba(255, 107, 0, 0.8)';
  ctx.lineWidth = 2;

  // Cab body
  ctx.beginPath();
  ctx.roundRect(
    actualCabOffset - cabLength * 0.5,
    -cabHeight,
    cabLength,
    cabHeight,
    [8 * scale, 8 * scale, 0, 0]
  );
  ctx.fill();
  ctx.stroke();

  // Cab window
  ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(
    actualCabOffset - cabLength * 0.35,
    -cabHeight + 10 * scale,
    cabLength * 0.6,
    cabHeight * 0.4,
    4 * scale
  );
  ctx.fill();
  ctx.stroke();

  // Wheels
  const wheelPositions = [
    { x: -containerWidth * 0.35 + bodyOffsetX * 0.3, y: 0 },
    { x: containerWidth * 0.2 + bodyOffsetX * 0.3, y: 0 },
    { x: containerWidth * 0.35 + bodyOffsetX * 0.3, y: 0 },
  ];

  wheelPositions.forEach((wheel, index) => {
    // Wheel shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(wheel.x, wheel.y + 5 * scale, wheelRadius * 1.1, wheelRadius * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tire
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y - wheelRadius * 0.3, wheelRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hubcap
    const hubGradient = ctx.createRadialGradient(
      wheel.x, wheel.y - wheelRadius * 0.3, 0,
      wheel.x, wheel.y - wheelRadius * 0.3, wheelRadius * 0.6
    );
    hubGradient.addColorStop(0, '#666');
    hubGradient.addColorStop(0.5, '#444');
    hubGradient.addColorStop(1, '#333');
    
    ctx.fillStyle = hubGradient;
    ctx.beginPath();
    ctx.arc(wheel.x, wheel.y - wheelRadius * 0.3, wheelRadius * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Wheel spokes (rotating)
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + rotation * 2;
      ctx.beginPath();
      ctx.moveTo(wheel.x, wheel.y - wheelRadius * 0.3);
      ctx.lineTo(
        wheel.x + Math.cos(angle) * wheelRadius * 0.5,
        wheel.y - wheelRadius * 0.3 + Math.sin(angle) * wheelRadius * 0.5
      );
      ctx.stroke();
    }
  });

  // Headlights / taillights based on rotation
  const lightX = showingFront ? actualCabOffset - cabLength * 0.4 : containerWidth * 0.35 + bodyOffsetX * 0.3;
  const lightColor = showingFront ? '#00f0ff' : '#ff3333';
  
  const lightGlow = ctx.createRadialGradient(lightX, -cabHeight * 0.3, 0, lightX, -cabHeight * 0.3, 30 * scale);
  lightGlow.addColorStop(0, lightColor);
  lightGlow.addColorStop(0.3, `${lightColor}66`);
  lightGlow.addColorStop(1, 'transparent');
  
  ctx.fillStyle = lightGlow;
  ctx.beginPath();
  ctx.arc(lightX, -cabHeight * 0.3, 30 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawParticles(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, rotation: number) {
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    const seed = i * 1234.5678;
    const x = ((seed * 9.8) % width);
    const baseY = ((seed * 7.3) % height);
    const y = baseY + Math.sin(time * 0.001 + seed) * 20;
    const size = 1 + (seed % 2);
    const alpha = 0.1 + (Math.sin(time * 0.002 + seed) * 0.5 + 0.5) * 0.2;

    ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Rotation indicator particles
  const indicatorCount = 8;
  const radius = Math.min(width, height) * 0.35;
  
  for (let i = 0; i < indicatorCount; i++) {
    const angle = (i / indicatorCount) * Math.PI * 2 + rotation;
    const x = width / 2 + Math.cos(angle) * radius;
    const y = height / 2 + Math.sin(angle) * radius * 0.3;
    const alpha = 0.1 + Math.sin(time * 0.003 + i) * 0.1;

    ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default TruckWeighbridgeCanvas;
