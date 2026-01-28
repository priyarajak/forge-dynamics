import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import WeighbridgeCanvasOptimized from './WeighbridgeCanvasOptimized';
import PartCallout from './PartCallout';
import { useAnimationLoop, getHeroProgress } from '@/hooks/useAnimationLoop';

const HeroSectionOptimized: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLDivElement>(null);
  const calloutsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (titleRef.current) {
      anime({
        targets: titleRef.current.querySelectorAll('.char'),
        opacity: [0, 1],
        translateY: [80, 0],
        rotateX: [90, 0],
        duration: 1200,
        delay: anime.stagger(40, { start: 300 }),
        easing: 'easeOutExpo',
      });
    }

    if (subtitleRef.current) {
      anime({
        targets: subtitleRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        delay: 1000,
        easing: 'easeOutExpo',
      });
    }
  }, []);

  useAnimationLoop((state) => {
    const progress = getHeroProgress(state.virtualScrollY);

    // Update container visibility
    if (containerRef.current) {
      containerRef.current.style.opacity = progress >= 1 ? '0' : '1';
      containerRef.current.style.pointerEvents = progress >= 1 ? 'none' : 'auto';
    }

    // Update title
    if (titleContainerRef.current) {
      titleContainerRef.current.style.opacity = String(1 - progress * 2);
      titleContainerRef.current.style.transform = `translate(-50%, ${progress * -100}px)`;
    }

    // Update progress bar
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress * 100}%`;
    }

    // Update progress text
    if (progressTextRef.current) {
      progressTextRef.current.textContent = `${Math.round(progress * 100)}%`;
    }

    // Update progress label
    if (progressLabelRef.current) {
      progressLabelRef.current.textContent = progress < 0.5 ? 'Explode View' : 'Assembly View';
    }

    // Update scroll indicator
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.opacity = String(1 - progress * 3);
    }

    // Update callouts visibility
    const showCallouts = progress > 0.2;
    calloutsRef.current.forEach((callout) => {
      if (callout) {
        callout.style.opacity = showCallouts ? '1' : '0';
        callout.style.transform = showCallouts ? 'translateY(0)' : 'translateY(10px)';
      }
    });
  });

  return (
    <section className="relative h-[400vh]">
      <div
        ref={containerRef}
        className="fixed top-0 left-0 h-screen w-full overflow-hidden noise-overlay z-10"
        style={{ transition: 'opacity 0.3s ease-out' }}
      >
        <WeighbridgeCanvasOptimized />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-40 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-40 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* Title */}
        <div
          ref={titleContainerRef}
          className="absolute top-[15%] left-1/2 z-10 text-center perspective-1000"
          style={{ transform: 'translate(-50%, 0)' }}
        >
          <h1 ref={titleRef} className="text-display text-glow preserve-3d">
            {'PRECISION'.split('').map((char, i) => (
              <span key={i} className="char inline-block opacity-0">
                {char}
              </span>
            ))}
          </h1>
          <p ref={subtitleRef} className="text-subhead text-muted-foreground mt-4 opacity-0">
            Industrial Weighing Solutions
          </p>
        </div>

        {/* Part Callouts */}
        <div ref={(el) => (calloutsRef.current[0] = el)} className="transition-all duration-300">
          <PartCallout
            number="01"
            label="Deck Platform"
            description="Heavy-duty steel surface"
            position={{ x: '25%', y: '35%' }}
            lineDirection="right"
            delay={0}
            isVisible={true}
          />
        </div>
        <div ref={(el) => (calloutsRef.current[1] = el)} className="transition-all duration-300">
          <PartCallout
            number="02"
            label="Load Cells"
            description="High-precision sensors"
            position={{ x: '15%', y: '55%' }}
            lineDirection="right"
            delay={100}
            isVisible={true}
          />
        </div>
        <div ref={(el) => (calloutsRef.current[2] = el)} className="transition-all duration-300">
          <PartCallout
            number="03"
            label="Junction Box"
            description="Signal distribution"
            position={{ x: '70%', y: '45%' }}
            lineDirection="left"
            delay={200}
            isVisible={true}
          />
        </div>
        <div ref={(el) => (calloutsRef.current[3] = el)} className="transition-all duration-300">
          <PartCallout
            number="04"
            label="Indicator"
            description="Digital display unit"
            position={{ x: '75%', y: '25%' }}
            lineDirection="left"
            delay={300}
            isVisible={true}
          />
        </div>
        <div ref={(el) => (calloutsRef.current[4] = el)} className="transition-all duration-300">
          <PartCallout
            number="05"
            label="Foundation"
            description="Concrete base structure"
            position={{ x: '20%', y: '75%' }}
            lineDirection="right"
            delay={400}
            isVisible={true}
          />
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-4">
            <div ref={progressLabelRef} className="text-mono text-muted-foreground text-xs uppercase tracking-widest">
              Explode View
            </div>
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-primary"
                style={{ width: '0%' }}
              />
            </div>
            <div ref={progressTextRef} className="text-mono text-primary text-sm">
              0%
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div ref={scrollIndicatorRef} className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-2">
            <span className="text-mono text-muted-foreground text-xs uppercase tracking-widest">
              Scroll to Explore
            </span>
            <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-primary rounded-full animate-bounce" />
            </div>
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-primary animate-pulse-glow" />
            <span className="text-mono text-primary text-sm">TECHMASS</span>
          </div>
        </div>

        <div className="absolute top-8 right-8 z-10 text-right">
          <div className="text-mono text-muted-foreground text-xs">EST. 2024</div>
          <div className="text-mono text-primary text-sm mt-1">ISO 9001:2015</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionOptimized;
