import React, { useRef, useEffect, useState } from 'react';
import anime from 'animejs';

const CTASection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (isInView && contentRef.current) {
      anime({
        targets: contentRef.current.children,
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        delay: anime.stagger(150),
        easing: 'easeOutExpo',
      });
    }
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-8 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div ref={contentRef}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel mb-8 opacity-0">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
            <span className="text-mono text-sm text-primary uppercase tracking-widest">
              Ready to Deploy
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-headline mb-6 opacity-0">
            Transform Your{' '}
            <span className="text-primary text-glow">Operations</span>
          </h2>

          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 opacity-0">
            Connect with our engineering team to design a weighing solution
            tailored to your industrial requirements.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
            <button className="btn-filled">
              Request Consultation
            </button>
            <button className="btn-industrial">
              View Case Studies
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 pt-16 border-t border-border/30 opacity-0">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-mono text-xs text-muted-foreground uppercase tracking-wider">
                  Certified
                </div>
                <div className="text-lg font-semibold text-primary mt-1">
                  ISO 9001:2015
                </div>
              </div>
              <div className="precision-line-vertical h-10 hidden md:block" />
              <div className="text-center">
                <div className="text-mono text-xs text-muted-foreground uppercase tracking-wider">
                  Accuracy Class
                </div>
                <div className="text-lg font-semibold text-primary mt-1">
                  OIML III / IIII
                </div>
              </div>
              <div className="precision-line-vertical h-10 hidden md:block" />
              <div className="text-center">
                <div className="text-mono text-xs text-muted-foreground uppercase tracking-wider">
                  Support
                </div>
                <div className="text-lg font-semibold text-primary mt-1">
                  24/7 Global
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
