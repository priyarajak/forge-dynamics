import React, { useState, useEffect } from 'react';

interface NavigationProps {
  scrollProgress: number;
}

const Navigation: React.FC<NavigationProps> = ({ scrollProgress }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show nav after initial hero animation
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const navOpacity = Math.min(1, scrollProgress * 5);
  const bgOpacity = Math.min(0.9, scrollProgress * 2);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      <div
        className="backdrop-blur-xl transition-all duration-300"
        style={{
          backgroundColor: `rgba(10, 10, 15, ${bgOpacity})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-primary animate-pulse-glow" />
              <span className="text-mono text-primary text-lg font-bold tracking-wider">
                Eco Weighing Solutions
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['Products', 'Solutions', 'Technology', 'About'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-mono text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* CTA */}
            <button className="hidden md:block btn-industrial py-2 px-6 text-xs">
              Get Quote
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5">
              <span className="w-6 h-0.5 bg-primary" />
              <span className="w-6 h-0.5 bg-primary" />
              <span className="w-4 h-0.5 bg-primary ml-auto" />
            </button>
          </div>
        </div>

        {/* Bottom Line */}
        <div
          className="h-px transition-opacity duration-300"
          style={{
            opacity: navOpacity,
            background:
              'linear-gradient(90deg, transparent, hsl(185, 100%, 50%, 0.3), transparent)',
          }}
        />
      </div>
    </nav>
  );
};

export default Navigation;
