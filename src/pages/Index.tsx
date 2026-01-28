import React from 'react';
import NavigationOptimized from '@/components/NavigationOptimized';
import HeroSectionOptimized from '@/components/HeroSectionOptimized';
import ProductSectionOptimized from '@/components/ProductSectionOptimized';
import StatsSection from '@/components/StatsSection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';

const Index: React.FC = () => {
  return (
    <div className="relative bg-background text-foreground overflow-x-hidden">
      {/* Navigation */}
      <NavigationOptimized />

      {/* Main Content */}
      <main>
        {/* Hero with 3D Canvas */}
        <HeroSectionOptimized />

        {/* Product Section */}
        <ProductSectionOptimized />

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
      <CursorGlow />
    </div>
  );
};

export default Index;
