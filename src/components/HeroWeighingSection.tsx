import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import TruckWeighingCanvas from './TruckWeighingCanvas';
import { useAnimationLoop, getHeroProgress } from '@/hooks/useAnimationLoop';

const PHASES = [
  { name: 'approach', start: 0, end: 0.25, label: 'APPROACHING' },
  { name: 'descend', start: 0.25, end: 0.45, label: 'POSITIONING' },
  { name: 'weigh', start: 0.45, end: 0.7, label: 'WEIGHING' },
  { name: 'exit', start: 0.7, end: 1, label: 'COMPLETE' },
];

function getCurrentPhase(progress: number): typeof PHASES[0] | null {
  return PHASES.find((p) => progress >= p.start && progress < p.end) || (progress >= 1 ? PHASES[3] : null);
}

const HeroWeighingSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const phaseTextRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const weightCapturedRef = useRef<HTMLDivElement>(null);
  const weightCapturedShown = useRef(false);

  useEffect(() => {
    // Animate left text
    if (leftTextRef.current) {
      anime({
        targets: leftTextRef.current.querySelectorAll('.text-line'),
        opacity: [0, 1],
        translateX: [-60, 0],
        duration: 1400,
        delay: anime.stagger(200, { start: 600 }),
        easing: 'easeOutExpo',
      });
    }

    // Animate right text
    if (rightTextRef.current) {
      anime({
        targets: rightTextRef.current.querySelectorAll('.text-line'),
        opacity: [0, 1],
        translateX: [60, 0],
        duration: 1400,
        delay: anime.stagger(200, { start: 800 }),
        easing: 'easeOutExpo',
      });
    }
  }, []);

  useAnimationLoop((state) => {
    const progress = getHeroProgress(state.virtualScrollY);
    const currentPhase = getCurrentPhase(progress);

    // Update container visibility
    if (containerRef.current) {
      containerRef.current.style.opacity = progress >= 1 ? '0' : '1';
      containerRef.current.style.pointerEvents = progress >= 1 ? 'none' : 'auto';
    }

    // Parallax for left text
    if (leftTextRef.current) {
      const parallaxX = -progress * 40;
      const parallaxY = progress * -60;
      leftTextRef.current.style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;
      leftTextRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.2));
    }

    // Parallax for right text
    if (rightTextRef.current) {
      const parallaxX = progress * 40;
      const parallaxY = progress * -60;
      rightTextRef.current.style.transform = `translate(${parallaxX}px, ${parallaxY}px)`;
      rightTextRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.2));
    }

    // Update progress bar
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress * 100}%`;
    }

    // Update phase text
    if (phaseTextRef.current && currentPhase) {
      phaseTextRef.current.textContent = currentPhase.label;
    }

    // Show/hide weight captured message
    const isWeighingPhase = progress >= 0.5 && progress < 0.65;
    if (weightCapturedRef.current) {
      if (isWeighingPhase && !weightCapturedShown.current) {
        weightCapturedShown.current = true;
        anime({
          targets: weightCapturedRef.current,
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 600,
          easing: 'easeOutExpo',
        });
      } else if (!isWeighingPhase && weightCapturedShown.current) {
        weightCapturedShown.current = false;
        anime({
          targets: weightCapturedRef.current,
          opacity: 0,
          scale: 0.9,
          duration: 400,
          easing: 'easeInExpo',
        });
      }
    }

    // Update scroll indicator
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.opacity = String(Math.max(0, 1 - progress * 4));
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
        <TruckWeighingCanvas />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* Left Side Text */}
        <div
          ref={leftTextRef}
          className="absolute left-6 md:left-12 lg:left-20 top-[25%] z-20 max-w-[200px] md:max-w-xs"
        >
          <div className="text-line opacity-0">
            <span className="text-mono text-primary text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 block">
              01 — Precision
            </span>
          </div>
          <div className="text-line opacity-0">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-[1.1]">
              WEIGH
              <br />
              <span className="text-primary">SMARTER</span>
            </h2>
          </div>
          <div className="text-line opacity-0">
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
              Advanced pit weighbridge technology with ±0.01% accuracy.
            </p>
          </div>
        </div>

        {/* Right Side Text */}
        <div
          ref={rightTextRef}
          className="absolute right-6 md:right-12 lg:right-20 top-[25%] z-20 max-w-[200px] md:max-w-xs text-right"
        >
          <div className="text-line opacity-0">
            <span className="text-mono text-accent text-[10px] md:text-xs uppercase tracking-[0.3em] mb-3 block">
              02 — Engineering
            </span>
          </div>
          <div className="text-line opacity-0">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 leading-[1.1]">
              BUILT TO
              <br />
              <span className="text-accent">LAST</span>
            </h2>
          </div>
          <div className="text-line opacity-0">
            <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
              Heavy-duty construction rated for 150+ ton capacity.
            </p>
          </div>
        </div>

        {/* Weight Captured Message */}
        <div
          ref={weightCapturedRef}
          className="absolute top-[35%] left-1/2 -translate-x-1/2 z-30 text-center opacity-0"
        >
          <div className="bg-background/80 backdrop-blur-sm border border-primary/30 rounded-lg px-8 py-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-mono text-green-400 text-sm uppercase tracking-widest">
                Weight Captured
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              High Precision Measurement Complete
            </p>
          </div>
        </div>

        {/* Center Brand Mark */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-primary animate-pulse-glow" />
            <span className="text-mono text-primary text-xs md:text-sm tracking-widest">Eco Weighing Solutions</span>
            <div className="w-2 h-2 md:w-3 md:h-3 bg-primary animate-pulse-glow" />
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="absolute top-6 right-6 md:right-8 z-20 text-right">
          <div className="text-mono text-muted-foreground text-[10px] uppercase tracking-widest">
            Status
          </div>
          <div ref={phaseTextRef} className="text-mono text-primary text-sm md:text-lg font-bold mt-1">
            APPROACHING
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              {PHASES.map((phase, index) => (
                <div key={phase.name} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full bg-primary/30 phase-dot-${index}`} />
                  <span className="hidden md:block text-mono text-muted-foreground text-[10px] uppercase">
                    {phase.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-48 md:w-64 h-1 bg-muted rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-primary via-primary to-accent"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div ref={scrollIndicatorRef} className="absolute bottom-28 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2">
            <span className="text-mono text-muted-foreground text-[10px] uppercase tracking-widest">
              Scroll to Begin
            </span>
            <div className="w-5 h-8 border-2 border-primary/50 rounded-full flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute bottom-6 left-6 md:left-8 z-20">
          <div className="text-mono text-muted-foreground text-[10px]">
            <div>EST. 2024</div>
            <div className="text-primary mt-1">ISO 9001:2015</div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 md:right-8 z-20">
          <div className="text-mono text-muted-foreground text-[10px] text-right">
            <div>MAX CAPACITY</div>
            <div className="text-accent mt-1">150 TONS</div>
          </div>
        </div>

        {/* Decorative Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-5" style={{ opacity: 0.08 }}>
          <line x1="15%" y1="0" x2="15%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
          <line x1="85%" y1="0" x2="85%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
        </svg>
      </div>
    </section>
  );
};

export default HeroWeighingSection;
