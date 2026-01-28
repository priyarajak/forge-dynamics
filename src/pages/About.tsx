import React from 'react';
import NavigationOptimized from '@/components/NavigationOptimized';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';
import { Calendar, Users, Award, Target } from 'lucide-react';

const stats = [
  { value: '30+', label: 'Years of Excellence', icon: <Calendar className="w-6 h-6" /> },
  { value: '10,000+', label: 'Installations', icon: <Target className="w-6 h-6" /> },
  { value: '500+', label: 'Enterprise Clients', icon: <Users className="w-6 h-6" /> },
  { value: '50+', label: 'Industry Awards', icon: <Award className="w-6 h-6" /> },
];

const milestones = [
  { year: '1994', title: 'Company Founded', description: 'Started operations with a vision to revolutionize weighing technology in India.' },
  { year: '2000', title: 'First Weighbridge Plant', description: 'Established our manufacturing facility for heavy-duty weighbridge production.' },
  { year: '2008', title: 'Digital Transformation', description: 'Pioneered digital load cell technology for enhanced accuracy and reliability.' },
  { year: '2015', title: 'Pan-India Expansion', description: 'Expanded service network to cover all major industrial hubs across the country.' },
  { year: '2020', title: 'IoT Integration', description: 'Launched smart weighing solutions with cloud connectivity and real-time monitoring.' },
  { year: '2024', title: 'Industry 4.0 Ready', description: 'Full automation capabilities with AI-powered analytics and predictive maintenance.' },
];

const values = [
  {
    title: 'Precision Engineering',
    description: 'Every product we manufacture undergoes rigorous quality control to ensure measurement accuracy that exceeds industry standards.',
  },
  {
    title: 'Customer Partnership',
    description: 'We believe in building long-term relationships, providing ongoing support and customization to meet evolving business needs.',
  },
  {
    title: 'Innovation Focus',
    description: 'Continuous investment in R&D keeps us at the forefront of weighing technology, delivering cutting-edge solutions.',
  },
  {
    title: 'Sustainability Commitment',
    description: 'Our manufacturing processes prioritize environmental responsibility with energy-efficient designs and recyclable materials.',
  },
];

const About: React.FC = () => {
  return (
    <div className="relative bg-background text-foreground min-h-screen">
      <NavigationOptimized />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-px bg-primary" />
            <span className="text-mono text-primary text-sm uppercase tracking-widest">
              About Us
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Three Decades of <br /><span className="text-primary">Weighing Excellence</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Since 1994, we have been at the forefront of precision weighing technology, 
            delivering reliable solutions that power industries across the nation.
          </p>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="p-6 bg-card border border-border rounded-lg text-center"
              >
                <div className="text-primary mx-auto mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 1994, TechMass began with a simple mission: to provide 
                  Indian industries with world-class weighing solutions that combine 
                  precision engineering with unmatched reliability.
                </p>
                <p>
                  Over three decades, we have grown from a small workshop to a 
                  leading manufacturer of weighing equipment, serving over 10,000 
                  installations across manufacturing, logistics, agriculture, and 
                  mining sectors.
                </p>
                <p>
                  Our success is built on a foundation of technical expertise, 
                  customer-centric service, and continuous innovation. We take pride 
                  in our team of skilled engineers who design and manufacture every 
                  product with meticulous attention to detail.
                </p>
                <p>
                  Today, we stand as a trusted partner for businesses seeking accurate, 
                  durable, and efficient weighing solutions—backed by nationwide service 
                  support and a commitment to excellence that has defined our journey.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl md:text-8xl font-bold text-primary/20 mb-4">30</div>
                  <div className="text-xl font-semibold">Years of Trust</div>
                  <div className="text-muted-foreground">Engineering Excellence Since 1994</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-border hidden md:block" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-4 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="p-4 bg-card border border-border rounded-lg inline-block">
                      <div className="text-primary font-bold text-lg mb-1">{milestone.year}</div>
                      <div className="font-semibold mb-1">{milestone.title}</div>
                      <div className="text-sm text-muted-foreground">{milestone.description}</div>
                    </div>
                  </div>
                  <div className="w-4 h-4 bg-primary rounded-full border-4 border-background z-10" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="p-6 bg-card border border-border rounded-lg"
              >
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Partner With Us
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Join the thousands of businesses that trust our weighing solutions. 
              Let's build something great together.
            </p>
            <a 
              href="/contact"
              className="inline-block px-8 py-3 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <CursorGlow />
    </div>
  );
};

export default About;
