import React, { useRef, useEffect } from 'react';
import { useAnimationLoop } from '@/hooks/useAnimationLoop';

const CursorGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useAnimationLoop((state) => {
    if (glowRef.current) {
      const left = ((state.mouseX + 1) * 50);
      const top = ((state.mouseY + 1) * 50);
      glowRef.current.style.left = `calc(${left}% - 12rem)`;
      glowRef.current.style.top = `calc(${top}% - 12rem)`;
    }
  });

  return (
    <div
      ref={glowRef}
      className="fixed w-96 h-96 pointer-events-none z-50 opacity-20 blur-[100px] mix-blend-screen"
      style={{
        background: 'radial-gradient(circle, hsl(185, 100%, 50%), transparent 70%)',
      }}
    />
  );
};

export default CursorGlow;
