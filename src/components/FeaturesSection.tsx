import React, { useRef, useEffect, useState } from 'react';
import anime from 'animejs';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  isInView: boolean;
}

const Feature: React.FC<FeatureProps> = ({
  icon,
  title,
  description,
  index,
  isInView,
}) => {
  const featureRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated && featureRef.current) {
      setHasAnimated(true);

      anime({
        targets: featureRef.current,
        opacity: [0, 1],
        translateX: [index % 2 === 0 ? -50 : 50, 0],
        translateY: [30, 0],
        duration: 800,
        delay: index * 100,
        easing: 'easeOutExpo',
      });
    }
  }, [isInView, hasAnimated, index]);

  return (
    <div
      ref={featureRef}
      className="group relative p-6 glass-panel hover:border-primary/50 transition-all duration-500 opacity-0"
    >
      {/* Icon */}
      <div className="w-14 h-14 flex items-center justify-center border border-primary/30 mb-6 group-hover:border-primary group-hover:glow-primary transition-all duration-300">
        <div className="text-primary">{icon}</div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold mb-3 group-hover:text-glow transition-all duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[40px] border-b-[40px] border-r-transparent border-b-primary/10 group-hover:border-b-primary/30 transition-all duration-300" />
    </div>
  );
};

const FeaturesSection: React.FC = () => {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: 'Modular Architecture',
      description:
        'Scalable platform design enables seamless capacity expansion and component upgrades without system downtime.',
    },
    {
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      title: 'Real-Time Analytics',
      description:
        'Advanced telemetry with millisecond precision. Cloud-synced data streams enable predictive maintenance insights.',
    },
    {
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: 'Industrial Grade',
      description:
        'Engineered to withstand extreme conditions. IP68 protection, wide temperature range, and vibration resistance.',
    },
    {
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      title: 'Smart Integration',
      description:
        'Native connectivity with ERP systems, fleet management, and IoT platforms through standardized APIs.',
    },
    {
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M18 20V10" />
          <path d="M12 20V4" />
          <path d="M6 20v-6" />
        </svg>
      ),
      title: 'Precision Calibration',
      description:
        'OIML-certified accuracy with automated zero tracking and span correction for consistent measurement.',
    },
    {
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      title: 'Remote Diagnostics',
      description:
        'Proactive system monitoring with automated alerts. Minimize downtime with AI-powered fault prediction.',
    },
  ];

  return (
    <section ref={sectionRef} className="relative py-32 px-8 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary" />
            <span className="text-mono text-primary text-sm uppercase tracking-widest">
              Capabilities
            </span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary" />
          </div>

          <h2 className="text-headline">
            Engineered for <span className="text-primary">Tomorrow</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
