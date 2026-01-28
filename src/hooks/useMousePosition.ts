import { useEffect, useState, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  normalizedX: number;
  normalizedY: number;
  velocityX: number;
  velocityY: number;
}

export const useMousePosition = () => {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    velocityX: 0,
    velocityY: 0,
  });

  const lastX = useRef(0);
  const lastY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const rafId = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
    };

    const animate = () => {
      const lerp = 0.1;
      currentX.current += (targetX.current - currentX.current) * lerp;
      currentY.current += (targetY.current - currentY.current) * lerp;

      const velocityX = currentX.current - lastX.current;
      const velocityY = currentY.current - lastY.current;

      lastX.current = currentX.current;
      lastY.current = currentY.current;

      setPosition({
        x: currentX.current,
        y: currentY.current,
        normalizedX: (currentX.current / window.innerWidth) * 2 - 1,
        normalizedY: (currentY.current / window.innerHeight) * 2 - 1,
        velocityX,
        velocityY,
      });

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return position;
};
