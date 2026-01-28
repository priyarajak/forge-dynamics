import React, { useState } from 'react';
import NavigationOptimized from '@/components/NavigationOptimized';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const contactInfo = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: 'Visit Us',
    details: ['123 Industrial Area, Phase II', 'Sector 45, New Delhi - 110001', 'India'],
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: 'Call Us',
    details: ['+91 11 2345 6789', '+91 98765 43210', 'Toll Free: 1800-123-4567'],
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: 'Email Us',
    details: ['info@techmass.com', 'sales@techmass.com', 'support@techmass.com'],
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Working Hours',
    details: ['Monday - Friday: 9:00 AM - 6:00 PM', 'Saturday: 9:00 AM - 2:00 PM', 'Sunday: Closed'],
  },
];

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Please enter your name', variant: 'destructive' });
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({ title: 'Error', description: 'Please enter a valid email address', variant: 'destructive' });
      return false;
    }
    if (!formData.phone.trim() || !/^[0-9+\-\s()]{10,}$/.test(formData.phone)) {
      toast({ title: 'Error', description: 'Please enter a valid phone number', variant: 'destructive' });
      return false;
    }
    if (!formData.message.trim()) {
      toast({ title: 'Error', description: 'Please enter your message', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual edge function when Cloud is enabled)
    try {
      // For now, simulate a delay and show success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Message Sent!',
        description: 'Thank you for contacting us. We will get back to you within 24 hours.',
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-background text-foreground min-h-screen">
      <NavigationOptimized />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-px bg-primary" />
            <span className="text-mono text-primary text-sm uppercase tracking-widest">
              Contact Us
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Let's <span className="text-primary">Connect</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Have a question or need a custom weighing solution? Our team of experts 
            is ready to help you find the perfect fit for your business.
          </p>
        </section>

        {/* Contact Form & Info */}
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-primary transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-primary transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Phone <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-primary transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company <span className="text-muted-foreground">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-primary transition-colors"
                      placeholder="Your company name"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 bg-background border border-border rounded focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Tell us about your weighing requirements..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
              <div className="grid gap-6">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index}
                    className="flex gap-4 p-4 bg-card border border-border rounded-lg"
                  >
                    <div className="text-primary mt-1">{info.icon}</div>
                    <div>
                      <h3 className="font-semibold mb-2">{info.title}</h3>
                      {info.details.map((detail, detailIndex) => (
                        <p key={detailIndex} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Interactive map would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold mb-2">What is your typical response time?</h3>
              <p className="text-sm text-muted-foreground">
                We respond to all inquiries within 24 hours on business days.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold mb-2">Do you provide installation services?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer complete installation and calibration services across India.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold mb-2">What warranty do you provide?</h3>
              <p className="text-sm text-muted-foreground">
                All our products come with a minimum 2-year warranty with extended options available.
              </p>
            </div>
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold mb-2">Can you customize solutions?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely! We specialize in tailored weighing solutions for unique requirements.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CursorGlow />
    </div>
  );
};

export default Contact;
