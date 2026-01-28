import React from 'react';
import NavigationOptimized from '@/components/NavigationOptimized';
import HeroTruckSection from '@/components/HeroTruckSection';
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
        {/* Hero with Truck 360° Rotation */}
        <HeroTruckSection />

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
