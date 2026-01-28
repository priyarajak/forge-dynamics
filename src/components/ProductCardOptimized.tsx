import React, { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import { useAnimationLoop } from '@/hooks/useAnimationLoop';

interface ProductCardProps {
  title: string;
  subtitle: string;
  description: string;
  specs: { label: string; value: string }[];
  index: number;
  isInView: boolean;
}

const ProductCardOptimized: React.FC<ProductCardProps> = ({
  title,
  subtitle,
  description,
  specs,
  index,
  isInView,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated && cardRef.current) {
      setHasAnimated(true);

      anime({
        targets: cardRef.current,
        opacity: [0, 1],
        translateY: [100, 0],
        rotateX: [15, 0],
        duration: 1000,
        delay: index * 150,
        easing: 'easeOutExpo',
      });

      anime({
        targets: cardRef.current.querySelectorAll('.spec-item'),
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 600,
        delay: anime.stagger(80, { start: index * 150 + 400 }),
        easing: 'easeOutQuad',
      });
    }
  }, [isInView, hasAnimated, index]);

  useAnimationLoop((state) => {
    if (cardRef.current && hasAnimated) {
      const rotateX = state.mouseY * 5;
      const rotateY = state.mouseX * 5;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  });

  return (
    <div
      ref={cardRef}
      className="relative glass-surface rounded-sm overflow-hidden opacity-0 preserve-3d cursor-pointer group"
      style={{ transition: 'transform 0.3s ease-out' }}
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      </div>

      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      {/* Content */}
      <div className="relative p-8">
        {/* Number */}
        <div className="absolute top-6 right-6">
          <span className="text-mono text-6xl font-bold text-muted/30">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Header */}
        <div className="mb-6">
          <span className="text-mono text-primary text-xs uppercase tracking-widest">
            {subtitle}
          </span>
          <h3 className="text-headline text-3xl mt-2 group-hover:text-glow transition-all duration-300">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed mb-8 max-w-md">
          {description}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4">
          {specs.map((spec, i) => (
            <div
              key={i}
              className="spec-item glass-panel p-4 opacity-0"
            >
              <div className="text-mono text-xs text-muted-foreground uppercase tracking-wider">
                {spec.label}
              </div>
              <div className="text-lg font-semibold text-primary mt-1">
                {spec.value}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="btn-industrial mt-8 w-full">
          View Specifications
        </button>
      </div>

      {/* Bottom Corner Decoration */}
      <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none">
        <svg viewBox="0 0 80 80" className="w-full h-full opacity-20">
          <path
            d="M80,0 L80,80 L0,80"
            fill="none"
            stroke="hsl(185, 100%, 50%)"
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
};

export default ProductCardOptimized;
