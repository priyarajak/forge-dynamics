import React from 'react';
import NavigationOptimized from '@/components/NavigationOptimized';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';
import { Shield, Factory, TrendingUp, Wrench, Truck, Award } from 'lucide-react';

interface Solution {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const solutions: Solution[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'High-Precision Weighing Solutions',
    description: 'Achieve laboratory-grade accuracy with our advanced weighing systems designed for critical measurements.',
    features: [
      'OIML Class III certified accuracy',
      '0.01% error tolerance',
      'Temperature compensation technology',
      'Auto-calibration systems',
      'Traceable measurement certificates',
    ],
  },
  {
    icon: <Factory className="w-8 h-8" />,
    title: 'Industrial & Commercial Applications',
    description: 'Robust weighing solutions engineered for demanding industrial environments and high-volume operations.',
    features: [
      'Heavy-duty steel construction',
      'IP67 rated for harsh environments',
      'Continuous operation capability',
      'Integration with ERP systems',
      'Multi-platform networking',
    ],
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Fraud-Resistant Weighing Systems',
    description: 'Protect your business with tamper-proof weighing technology and audit trail capabilities.',
    features: [
      'Sealed calibration mechanisms',
      'Digital signature verification',
      'Real-time data logging',
      'Remote monitoring alerts',
      'Legal-for-trade certification',
    ],
  },
  {
    icon: <Wrench className="w-8 h-8" />,
    title: 'Long-Term Durability & Service Support',
    description: 'Invest in equipment built to last with comprehensive service and maintenance programs.',
    features: [
      '10+ year operational lifespan',
      'Nationwide service network',
      'Preventive maintenance contracts',
      '24/7 technical support',
      'Genuine spare parts availability',
    ],
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Logistics & Transportation Solutions',
    description: 'Streamline your supply chain with integrated weighing solutions for fleet management.',
    features: [
      'Axle load measurement',
      'Vehicle identification systems',
      'Automated ticketing',
      'Fleet management integration',
      'Overload prevention alerts',
    ],
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Custom Enterprise Solutions',
    description: 'Tailored weighing systems designed to meet your specific operational requirements.',
    features: [
      'Site assessment & consultation',
      'Custom software development',
      'Hardware customization',
      'Training & certification',
      'Ongoing optimization support',
    ],
  },
];

const industries = [
  { name: 'Manufacturing', description: 'Quality control and batch processing' },
  { name: 'Agriculture', description: 'Grain storage and commodity trading' },
  { name: 'Mining & Quarry', description: 'Heavy material measurement' },
  { name: 'Pharmaceuticals', description: 'Precision formulation weighing' },
  { name: 'Food & Beverage', description: 'Recipe management and packaging' },
  { name: 'Logistics', description: 'Freight and shipping operations' },
];

const Solutions: React.FC = () => {
  return (
    <div className="relative bg-background text-foreground min-h-screen">
      <NavigationOptimized />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-px bg-primary" />
            <span className="text-mono text-primary text-sm uppercase tracking-widest">
              Our Solutions
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Engineering <span className="text-primary">Excellence</span> <br />for Every Scale
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            From precision jewellery scales to industrial weighbridges, we deliver 
            comprehensive weighing solutions that power businesses across industries.
          </p>
        </section>

        {/* Solutions Grid */}
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div 
                key={index}
                className="group p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-all duration-300"
              >
                <div className="text-primary mb-4 group-hover:scale-110 transition-transform">
                  {solution.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{solution.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Industries Section */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Industries We Serve</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our solutions are trusted across diverse sectors, delivering reliable 
              performance where accuracy matters most.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((industry, index) => (
              <div 
                key={index}
                className="p-4 bg-card border border-border rounded-lg text-center hover:border-primary/50 transition-colors"
              >
                <h4 className="font-semibold text-sm mb-1">{industry.name}</h4>
                <p className="text-xs text-muted-foreground">{industry.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Need a Custom Solution?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Our engineering team specializes in designing bespoke weighing systems 
              tailored to your unique operational requirements.
            </p>
            <a 
              href="/contact"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors"
            >
              Contact Our Engineers
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <CursorGlow />
    </div>
  );
};

export default Solutions;
