import React, { useRef, useEffect, useState } from 'react';
import anime from 'animejs';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  mouseX: number;
  mouseY: number;
}

const products = [
  {
    title: 'Pit Weighbridge',
    subtitle: 'Surface Mount',
    description:
      'Engineered for seamless ground-level integration. Our pit-mounted weighbridges deliver maximum accuracy with minimal footprint, ideal for high-traffic industrial facilities.',
    specs: [
      { label: 'Capacity', value: '120 Tons' },
      { label: 'Accuracy', value: '±0.05%' },
      { label: 'Platform', value: '18m × 3m' },
      { label: 'Load Cells', value: '8 × Digital' },
    ],
  },
  {
    title: 'Pitless Weighbridge',
    subtitle: 'Above Ground',
    description:
      'Zero excavation required. Our elevated weighbridge design enables rapid deployment with full accessibility for maintenance, featuring modular construction for ultimate flexibility.',
    specs: [
      { label: 'Capacity', value: '80 Tons' },
      { label: 'Accuracy', value: '±0.03%' },
      { label: 'Platform', value: '12m × 3m' },
      { label: 'Load Cells', value: '6 × Analog' },
    ],
  },
  {
    title: 'Digital Load Cells',
    subtitle: 'Precision Sensors',
    description:
      'Next-generation strain gauge technology with integrated signal processing. IP68-rated for extreme environments with automatic temperature compensation.',
    specs: [
      { label: 'Capacity', value: '30 Tons' },
      { label: 'Output', value: 'Digital RS485' },
      { label: 'Protection', value: 'IP68' },
      { label: 'Accuracy', value: 'OIML C3' },
    ],
  },
  {
    title: 'Smart Indicator',
    subtitle: 'Control Terminal',
    description:
      'Industrial-grade weight display with IoT connectivity. Real-time data logging, cloud synchronization, and comprehensive fleet management integration.',
    specs: [
      { label: 'Display', value: '7" LCD' },
      { label: 'Connectivity', value: 'WiFi/4G' },
      { label: 'Memory', value: '100K Records' },
      { label: 'Interface', value: 'Touch + Keys' },
    ],
  },
];

const ProductSection: React.FC<ProductSectionProps> = ({ mouseX, mouseY }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [titleAnimated, setTitleAnimated] = useState(false);

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

  useEffect(() => {
    if (isInView && !titleAnimated && titleRef.current) {
      setTitleAnimated(true);

      anime({
        targets: titleRef.current.querySelectorAll('.word'),
        opacity: [0, 1],
        translateY: [60, 0],
        rotateZ: [-5, 0],
        duration: 1000,
        delay: anime.stagger(100),
        easing: 'easeOutExpo',
      });
    }
  }, [isInView, titleAnimated]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-8 overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-px bg-primary" />
            <span className="text-mono text-primary text-sm uppercase tracking-widest">
              Product Range
            </span>
          </div>

          <h2 ref={titleRef} className="text-headline perspective-1000">
            <span className="word inline-block opacity-0">Industrial</span>{' '}
            <span className="word inline-block opacity-0 text-primary">
              Precision
            </span>{' '}
            <span className="word inline-block opacity-0">Engineering</span>
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              {...product}
              index={index}
              isInView={isInView}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          ))}
        </div>
      </div>

      {/* Section Divider */}
      <div className="section-divider mt-32" />
    </section>
  );
};

export default ProductSection;
