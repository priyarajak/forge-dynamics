import React, { useRef } from 'react';
import { NavLink } from './NavLink';
import { useAnimationLoop } from '@/hooks/useAnimationLoop';

const NavigationOptimized: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);

  useAnimationLoop((state) => {
    if (navRef.current) {
      const scrolled = state.scrollProgress > 0.02;
      navRef.current.style.backgroundColor = scrolled
        ? 'hsla(var(--background), 0.8)'
        : 'transparent';
      navRef.current.style.backdropFilter = scrolled ? 'blur(12px)' : 'none';
    }
  });

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rotate-45" />
            <span className="text-mono text-lg font-bold tracking-wider">TECHMASS</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <NavLink to="#products" className="text-mono text-sm text-muted-foreground hover:text-foreground transition-colors">Products</NavLink>
            <NavLink to="#solutions" className="text-mono text-sm text-muted-foreground hover:text-foreground transition-colors">Solutions</NavLink>
            <NavLink to="#about" className="text-mono text-sm text-muted-foreground hover:text-foreground transition-colors">About</NavLink>
            <NavLink to="#contact" className="text-mono text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</NavLink>
          </div>

          <button className="px-6 py-2 bg-primary text-primary-foreground text-mono text-sm font-medium hover:bg-primary/90 transition-colors">
            GET QUOTE
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationOptimized;
