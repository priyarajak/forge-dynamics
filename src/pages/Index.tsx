import React from 'react';
import { useSmoothScroll, useScrollSection } from '@/hooks/useSmoothScroll';
import { useMousePosition } from '@/hooks/useMousePosition';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ProductSection from '@/components/ProductSection';
import StatsSection from '@/components/StatsSection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  const { virtualScrollY, scrollVelocity, scrollProgress } = useSmoothScroll(0.06);
  const { normalizedX, normalizedY } = useMousePosition();

  // Hero section progress (0-1 over the pinned scroll distance)
  const heroSectionHeight = typeof window !== 'undefined' ? window.innerHeight * 3 : 3000;
  const { sectionProgress: heroProgress } = useScrollSection(
    virtualScrollY,
    0,
    heroSectionHeight
  );

  return (
    <div className="relative bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <Navigation scrollProgress={scrollProgress} />

      {/* Main Content */}
      <main>
        {/* Hero with 3D Canvas */}
        <HeroSection
          progress={heroProgress}
          mouseX={normalizedX}
          mouseY={normalizedY}
          velocity={scrollVelocity}
        />

        {/* Product Section */}
        <ProductSection mouseX={normalizedX} mouseY={normalizedY} />

        {/* Stats Section */}
        <StatsSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Cursor Glow Effect */}
      <div
        className="fixed w-96 h-96 pointer-events-none z-50 opacity-20 blur-[100px] mix-blend-screen"
        style={{
          left: `calc(${(normalizedX + 1) * 50}% - 12rem)`,
          top: `calc(${(normalizedY + 1) * 50}% - 12rem)`,
          background: 'radial-gradient(circle, hsl(185, 100%, 50%), transparent 70%)',
        }}
      />
    </div>
  );
};

export default Index;
