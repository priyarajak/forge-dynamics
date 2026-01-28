import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface PartCalloutProps {
  number: string;
  label: string;
  description: string;
  position: { x: string; y: string };
  lineDirection: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  isVisible: boolean;
}

const PartCallout: React.FC<PartCalloutProps> = ({
  number,
  label,
  description,
  position,
  lineDirection,
  delay = 0,
  isVisible,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!containerRef.current || !lineRef.current) return;

    if (isVisible) {
      anime({
        targets: containerRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        translateZ: [50, 0],
        duration: 800,
        delay: delay,
        easing: 'easeOutExpo',
      });

      anime({
        targets: lineRef.current,
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 600,
        delay: delay + 200,
        easing: 'easeOutSine',
      });
    } else {
      anime({
        targets: containerRef.current,
        opacity: 0,
        translateY: 10,
        duration: 300,
        easing: 'easeInQuad',
      });
    }
  }, [isVisible, delay]);

  const getLinePath = () => {
    switch (lineDirection) {
      case 'left':
        return 'M0,20 L-40,20 L-60,0';
      case 'right':
        return 'M0,20 L40,20 L60,0';
      case 'up':
        return 'M20,0 L20,-30 L40,-50';
      case 'down':
        return 'M20,40 L20,70 L40,90';
      default:
        return 'M0,20 L40,20';
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute z-20 preserve-3d opacity-0"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translateZ(20px)',
      }}
    >
      {/* SVG Leader Line */}
      <svg
        className="absolute pointer-events-none"
        width="100"
        height="100"
        style={{
          left: lineDirection === 'left' ? '-80px' : '-10px',
          top: '-30px',
          overflow: 'visible',
        }}
      >
        <path
          ref={lineRef}
          d={getLinePath()}
          fill="none"
          stroke="hsl(185, 100%, 50%)"
          strokeWidth="1"
          strokeDasharray="200"
          strokeDashoffset="200"
        />
        <circle
          cx={lineDirection === 'left' ? 0 : 60}
          cy={lineDirection === 'up' ? -50 : 0}
          r="3"
          fill="hsl(185, 100%, 50%)"
        />
      </svg>

      {/* Number Badge */}
      <div className="number-badge mb-2 animate-pulse-glow">
        {number}
      </div>

      {/* Label Container */}
      <div className="callout-label min-w-[140px]">
        <div className="text-primary font-semibold text-sm uppercase tracking-wider">
          {label}
        </div>
        <div className="text-muted-foreground text-xs mt-1">
          {description}
        </div>
      </div>
    </div>
  );
};

export default PartCallout;
