import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import WeighbridgeCanvas from './WeighbridgeCanvas';
import PartCallout from './PartCallout';

interface HeroSectionProps {
  progress: number;
  mouseX: number;
  mouseY: number;
  velocity: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  progress,
  mouseX,
  mouseY,
  velocity,
}) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

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

  const showCallouts = progress > 0.2;

  return (
    <section className="relative h-[400vh] overflow-hidden">
      {/* Pinned Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden noise-overlay">
        {/* Canvas Background */}
        <WeighbridgeCanvas
          progress={progress}
          mouseX={mouseX}
          mouseY={mouseY}
          velocity={velocity}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute top-0 bottom-0 left-0 w-40 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute top-0 bottom-0 right-0 w-40 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* Title */}
        <div
          className="absolute top-[15%] left-1/2 -translate-x-1/2 z-10 text-center perspective-1000"
          style={{
            opacity: 1 - progress * 2,
            transform: `translate(-50%, ${progress * -100}px)`,
          }}
        >
          <h1 ref={titleRef} className="text-display text-glow preserve-3d">
            {'PRECISION'.split('').map((char, i) => (
              <span key={i} className="char inline-block opacity-0">
                {char}
              </span>
            ))}
          </h1>
          <p
            ref={subtitleRef}
            className="text-subhead text-muted-foreground mt-4 opacity-0"
          >
            Industrial Weighing Solutions
          </p>
        </div>

        {/* Part Callouts */}
        <PartCallout
          number="01"
          label="Deck Platform"
          description="Heavy-duty steel surface"
          position={{ x: '25%', y: '35%' }}
          lineDirection="right"
          delay={0}
          isVisible={showCallouts}
        />
        <PartCallout
          number="02"
          label="Load Cells"
          description="High-precision sensors"
          position={{ x: '15%', y: '55%' }}
          lineDirection="right"
          delay={100}
          isVisible={showCallouts}
        />
        <PartCallout
          number="03"
          label="Junction Box"
          description="Signal distribution"
          position={{ x: '70%', y: '45%' }}
          lineDirection="left"
          delay={200}
          isVisible={showCallouts}
        />
        <PartCallout
          number="04"
          label="Indicator"
          description="Digital display unit"
          position={{ x: '75%', y: '25%' }}
          lineDirection="left"
          delay={300}
          isVisible={showCallouts}
        />
        <PartCallout
          number="05"
          label="Foundation"
          description="Concrete base structure"
          position={{ x: '20%', y: '75%' }}
          lineDirection="right"
          delay={400}
          isVisible={showCallouts}
        />

        {/* Progress Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="text-mono text-muted-foreground text-xs uppercase tracking-widest">
              {progress < 0.5 ? 'Explode View' : 'Assembly View'}
            </div>
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
              <div
                ref={progressBarRef}
                className="h-full bg-primary transition-all duration-100"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="text-mono text-primary text-sm">
              {Math.round(progress * 100)}%
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10"
          style={{ opacity: 1 - progress * 3 }}
        >
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
          <div className="text-mono text-muted-foreground text-xs">
            EST. 2024
          </div>
          <div className="text-mono text-primary text-sm mt-1">
            ISO 9001:2015
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
