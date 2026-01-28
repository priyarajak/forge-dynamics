import React, { useRef, useEffect, useState } from 'react';
import anime from 'animejs';

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  isInView: boolean;
}

const StatItem: React.FC<StatItemProps> = ({
  value,
  suffix,
  label,
  delay,
  isInView,
}) => {
  const valueRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated && valueRef.current && containerRef.current) {
      setHasAnimated(true);

      anime({
        targets: containerRef.current,
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 800,
        delay: delay,
        easing: 'easeOutExpo',
      });

      anime({
        targets: { val: 0 },
        val: value,
        round: 1,
        duration: 2000,
        delay: delay + 200,
        easing: 'easeOutExpo',
        update: (anim) => {
          if (valueRef.current) {
            valueRef.current.textContent = String(
              Math.round(anim.animations[0].currentValue as number)
            );
          }
        },
      });
    }
  }, [isInView, hasAnimated, value, delay]);

  return (
    <div ref={containerRef} className="text-center opacity-0">
      <div className="relative inline-block">
        <span
          ref={valueRef}
          className="text-display text-7xl md:text-8xl text-glow"
        >
          0
        </span>
        <span className="text-4xl md:text-5xl text-primary font-bold">
          {suffix}
        </span>
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
        <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30" />
      </div>
      <div className="text-mono text-muted-foreground text-sm uppercase tracking-widest mt-4">
        {label}
      </div>
    </div>
  );
};

const StatsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 2500, suffix: '+', label: 'Installations Worldwide' },
    { value: 99, suffix: '.9%', label: 'Uptime Guarantee' },
    { value: 35, suffix: '+', label: 'Years of Excellence' },
    { value: 150, suffix: 'T', label: 'Max Capacity' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />

      {/* Scan Line Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-mono text-primary text-sm uppercase tracking-widest">
            Performance Metrics
          </span>
          <h2 className="text-headline mt-4">
            Built for <span className="text-primary">Reliability</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              {...stat}
              delay={index * 150}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
