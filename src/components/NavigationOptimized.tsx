import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAnimationLoop } from '@/hooks/useAnimationLoop';

const NavigationOptimized: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useAnimationLoop((state) => {
    if (navRef.current) {
      const scrolled = state.scrollProgress > 0.02;
      navRef.current.style.backgroundColor = scrolled
        ? 'hsla(var(--background), 0.8)'
        : 'transparent';
      navRef.current.style.backdropFilter = scrolled ? 'blur(12px)' : 'none';
    }
  });

  const navLinks = [
    { to: '/products', label: 'Products' },
    { to: '/solutions', label: 'Solutions' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rotate-45" />
            <span className="text-mono text-lg font-bold tracking-wider">Eco Weighing Solutions</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-mono text-sm transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            to="/contact"
            className="px-6 py-2 bg-primary text-primary-foreground text-mono text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            GET QUOTE
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavigationOptimized;
