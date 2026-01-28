import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative py-16 px-8 border-t border-border/30">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-muted/10 to-transparent" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-primary animate-pulse-glow" />
              <span className="text-mono text-primary text-lg font-bold">
                Eco Weighing Solutions
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Precision industrial weighing solutions for the modern enterprise.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-mono text-sm uppercase tracking-wider mb-6">
              Products
            </h4>
            <ul className="space-y-3">
              {['Weighbridges', 'Load Cells', 'Indicators', 'Platform Scales', 'Junction Boxes'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-mono text-sm uppercase tracking-wider mb-6">
              Solutions
            </h4>
            <ul className="space-y-3">
              {['Mining', 'Logistics', 'Agriculture', 'Manufacturing', 'Waste Management'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-mono text-sm uppercase tracking-wider mb-6">
              Contact
            </h4>
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li>+91 7363838830</li>
              <li>+91 9434140457</li>
              <li>ecoweighingsols@gmail.com</li>
              <li>
                Industrial Park Zone 7
                <br />
                San Francisco, CA 94102
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-mono text-muted-foreground text-xs">
              © 2024 Eco Weighing Solutions. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-muted-foreground text-xs hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-muted-foreground text-xs hover:text-primary transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-muted-foreground text-xs hover:text-primary transition-colors"
              >
                Certifications
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
