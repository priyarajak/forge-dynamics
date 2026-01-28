import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import TruckWeighbridgeCanvas from './TruckWeighbridgeCanvas';
import { useAnimationLoop, getHeroProgress } from '@/hooks/useAnimationLoop';

const HeroTruckSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLDivElement>(null);
  const rotationTextRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate left text
    if (leftTextRef.current) {
      anime({
        targets: leftTextRef.current.querySelectorAll('.text-line'),
        opacity: [0, 1],
        translateX: [-50, 0],
        duration: 1200,
        delay: anime.stagger(150, { start: 500 }),
        easing: 'easeOutExpo',
      });
    }

    // Animate right text
    if (rightTextRef.current) {
      anime({
        targets: rightTextRef.current.querySelectorAll('.text-line'),
        opacity: [0, 1],
        translateX: [50, 0],
        duration: 1200,
        delay: anime.stagger(150, { start: 700 }),
        easing: 'easeOutExpo',
      });
    }
  }, []);

  useAnimationLoop((state) => {
    const progress = getHeroProgress(state.virtualScrollY);
    const rotation = progress * 360;

    // Update container visibility
    if (containerRef.current) {
      containerRef.current.style.opacity = progress >= 1 ? '0' : '1';
      containerRef.current.style.pointerEvents = progress >= 1 ? 'none' : 'auto';
    }

    // Parallax for left text
    if (leftTextRef.current) {
      const parallaxX = -progress * 30;
      const parallaxY = progress * -50;
      leftTextRef.current.style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;
      leftTextRef.current.style.opacity = String(1 - progress * 0.5);
    }

    // Parallax for right text
    if (rightTextRef.current) {
      const parallaxX = progress * 30;
      const parallaxY = progress * -50;
      rightTextRef.current.style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;
      rightTextRef.current.style.opacity = String(1 - progress * 0.5);
    }

    // Update progress bar
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress * 100}%`;
    }

    // Update progress text
    if (progressTextRef.current) {
      progressTextRef.current.textContent = `${Math.round(progress * 100)}%`;
    }

    // Update rotation text
    if (rotationTextRef.current) {
      rotationTextRef.current.textContent = `${Math.round(rotation)}°`;
    }

    // Update scroll indicator
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.opacity = String(1 - progress * 3);
    }
  });

  return (
    <section className="relative h-[400vh]">
      <div
        ref={containerRef}
        className="fixed top-0 left-0 h-screen w-full overflow-hidden noise-overlay z-10"
        style={{ transition: 'opacity 0.3s ease-out' }}
      >
        {/* Canvas Background */}
        <TruckWeighbridgeCanvas />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* Left Side Text */}
        <div
          ref={leftTextRef}
          className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 z-20 max-w-xs md:max-w-sm"
        >
          <div className="text-line opacity-0">
            <span className="text-mono text-primary text-xs uppercase tracking-[0.3em] mb-4 block">
              01 — Precision
            </span>
          </div>
          <div className="text-line opacity-0">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              INDUSTRIAL
              <br />
              <span className="text-primary">ACCURACY</span>
            </h2>
          </div>
          <div className="text-line opacity-0">
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Engineered for precision weighing with ±0.01% accuracy across all conditions.
            </p>
          </div>
        </div>

        {/* Right Side Text */}
        <div
          ref={rightTextRef}
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-20 max-w-xs md:max-w-sm text-right"
        >
          <div className="text-line opacity-0">
            <span className="text-mono text-accent text-xs uppercase tracking-[0.3em] mb-4 block">
              02 — Strength
            </span>
          </div>
          <div className="text-line opacity-0">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              BUILT TO
              <br />
              <span className="text-accent">ENDURE</span>
            </h2>
          </div>
          <div className="text-line opacity-0">
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              Heavy-duty construction rated for 150+ ton capacity with 25-year structural warranty.
            </p>
          </div>
        </div>

        {/* Center Brand Mark */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary animate-pulse-glow" />
            <span className="text-mono text-primary text-sm tracking-widest">TECHMASS</span>
            <div className="w-3 h-3 bg-primary animate-pulse-glow" />
          </div>
        </div>

        {/* Rotation Display */}
        <div className="absolute top-8 right-8 z-20 text-right">
          <div className="text-mono text-muted-foreground text-xs uppercase tracking-widest">
            Rotation
          </div>
          <div ref={rotationTextRef} className="text-mono text-primary text-2xl font-bold mt-1">
            0°
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="text-mono text-muted-foreground text-xs uppercase tracking-widest">
              360° View
            </div>
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-primary to-accent"
                style={{ width: '0%' }}
              />
            </div>
            <div ref={progressTextRef} className="text-mono text-primary text-sm">
              0%
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div ref={scrollIndicatorRef} className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2">
            <span className="text-mono text-muted-foreground text-xs uppercase tracking-widest">
              Scroll to Rotate
            </span>
            <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute bottom-8 left-8 z-20">
          <div className="text-mono text-muted-foreground text-xs">
            <div>EST. 2024</div>
            <div className="text-primary mt-1">ISO 9001:2015</div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 z-20">
          <div className="text-mono text-muted-foreground text-xs text-right">
            <div>CAPACITY</div>
            <div className="text-accent mt-1">150 TONS</div>
          </div>
        </div>

        {/* Decorative Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ opacity: 0.1 }}>
          <line x1="20%" y1="0" x2="20%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
          <line x1="80%" y1="0" x2="80%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" className="text-primary" strokeDasharray="10 20" />
        </svg>
      </div>
    </section>
  );
};

export default HeroTruckSection;
