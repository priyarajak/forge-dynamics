import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import PitWeighbridgeCanvas from './PitWeighbridgeCanvas';
import { useAnimationLoop, getHeroProgress } from '@/hooks/useAnimationLoop';

const PHASES = [
  { name: 'enter', start: 0, end: 0.2, label: 'APPROACHING' },
  { name: 'climb', start: 0.2, end: 0.35, label: 'POSITIONING' },
  { name: 'weigh', start: 0.35, end: 0.6, label: 'MEASURING' },
  { name: 'descend', start: 0.6, end: 0.75, label: 'COMPLETE' },
  { name: 'exit', start: 0.75, end: 1, label: 'DEPARTING' },
];

function getCurrentPhase(progress: number): (typeof PHASES)[0] | null {
  return PHASES.find((p) => progress >= p.start && progress < p.end) || (progress >= 1 ? PHASES[4] : null);
}

const HeroPitSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const phaseTextRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate heading
    if (headingRef.current) {
      anime({
        targets: headingRef.current.querySelectorAll('.char'),
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1200,
        delay: anime.stagger(50, { start: 400 }),
        easing: 'easeOutExpo',
      });
    }

    // Animate subheading
    if (subheadingRef.current) {
      anime({
        targets: subheadingRef.current,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1000,
        delay: 1000,
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

    // Parallax for heading
    if (headingRef.current) {
      const parallaxY = progress * -80;
      headingRef.current.style.transform = `translateY(${parallaxY}px)`;
      headingRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.5));
    }

    // Parallax for subheading
    if (subheadingRef.current) {
      const parallaxY = progress * -60;
      subheadingRef.current.style.transform = `translateY(${parallaxY}px)`;
      subheadingRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.8));
    }

    // Update progress bar
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress * 100}%`;
    }

    // Update phase text
    if (phaseTextRef.current && currentPhase) {
      phaseTextRef.current.textContent = currentPhase.label;
    }

    // Update scroll indicator
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.opacity = String(Math.max(0, 1 - progress * 5));
    }
  });

  // Split text into characters for animation
  const headingText = 'Precision Pit Weighbridges';
  const chars = headingText.split('').map((char, i) => (
    <span key={i} className="char inline-block opacity-0" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
      {char}
    </span>
  ));

  return (
    <section className="relative h-[400vh]">
      <div
        ref={containerRef}
        className="fixed top-0 left-0 h-screen w-full overflow-hidden noise-overlay z-10"
        style={{ transition: 'opacity 0.3s ease-out' }}
      >
        {/* Canvas Background */}
        <PitWeighbridgeCanvas />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-background via-background/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* Top Heading */}
        <div className="absolute top-16 md:top-20 left-0 right-0 z-20 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <div
              ref={headingRef}
              className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground tracking-tight leading-none mb-4"
            >
              {chars}
            </div>
            <div
              ref={subheadingRef}
              className="text-base md:text-lg lg:text-xl text-muted-foreground opacity-0 max-w-2xl mx-auto"
            >
              Engineered for Heavy-Duty Accuracy
            </div>
          </div>
        </div>

        {/* Center Brand Mark */}
        <div className="absolute top-6 left-6 md:left-8 z-20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-primary animate-pulse" />
            <span className="text-mono text-primary text-xs md:text-sm tracking-widest">TECHMASS</span>
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="absolute top-6 right-6 md:right-8 z-20 text-right">
          <div className="text-mono text-muted-foreground text-[10px] uppercase tracking-widest">Status</div>
          <div ref={phaseTextRef} className="text-mono text-primary text-sm md:text-lg font-bold mt-1">
            APPROACHING
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-56 md:w-72 h-1 bg-muted rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-primary via-primary to-accent"
                style={{ width: '0%' }}
              />
            </div>
            <div className="flex items-center gap-3 md:gap-6">
              {PHASES.map((phase) => (
                <span key={phase.name} className="text-mono text-muted-foreground text-[9px] md:text-[10px] uppercase tracking-wider">
                  {phase.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div ref={scrollIndicatorRef} className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2">
            <span className="text-mono text-muted-foreground text-[10px] uppercase tracking-widest">Scroll</span>
            <div className="w-5 h-8 border-2 border-primary/50 rounded-full flex justify-center pt-1.5">
              <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        </div>

        {/* Corner Stats */}
        <div className="absolute bottom-6 left-6 md:left-8 z-20">
          <div className="text-mono text-muted-foreground text-[10px]">
            <div>EST. 2024</div>
            <div className="text-primary mt-1">ISO 9001:2015</div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 md:right-8 z-20">
          <div className="text-mono text-muted-foreground text-[10px] text-right">
            <div>CAPACITY</div>
            <div className="text-accent mt-1">150 TONS</div>
          </div>
        </div>

        {/* Decorative Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-5" style={{ opacity: 0.06 }}>
          <line x1="10%" y1="0" x2="10%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
          <line x1="90%" y1="0" x2="90%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-primary" />
        </svg>
      </div>
    </section>
  );
};

export default HeroPitSection;
