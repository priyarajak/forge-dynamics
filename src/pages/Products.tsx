import React from 'react';
import NavigationOptimized from '@/components/NavigationOptimized';
import Footer from '@/components/Footer';
import CursorGlow from '@/components/CursorGlow';

interface Product {
  name: string;
  image: string;
  price: string;
  capacity: string;
  description: string;
}

interface ProductCategory {
  title: string;
  description: string;
  products: Product[];
}

const productCategories: ProductCategory[] = [
  {
    title: 'Small Weighing Machines',
    description: 'Compact tabletop and retail scales for everyday commercial use',
    products: [
      {
        name: 'Phoenix Digital Price Computing Scale',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        price: '₹2,500 - ₹4,500',
        capacity: '30kg × 5g',
        description: 'LCD display with rechargeable battery, ideal for grocery and retail stores.',
      },
      {
        name: 'Atom Electronic Table Top Scale',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
        price: '₹1,800 - ₹3,200',
        capacity: '25kg × 2g',
        description: 'Stainless steel pan with tare function for precise measurements.',
      },
      {
        name: 'Essae DS-252 Retail Scale',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop',
        price: '₹3,500 - ₹5,500',
        capacity: '35kg × 5g',
        description: 'Pole display for customer view, memory storage for PLU items.',
      },
      {
        name: 'CAS SW-1C Portion Scale',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
        price: '₹4,200 - ₹6,800',
        capacity: '20kg × 2g',
        description: 'Waterproof design with IP65 rating for wet environments.',
      },
      {
        name: 'Ohaus Valor 2000 Bench Scale',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        price: '₹8,500 - ₹12,000',
        capacity: '15kg × 1g',
        description: 'Food-safe ABS housing with checkweighing and accumulation features.',
      },
    ],
  },
  {
    title: 'Jewellery Weighing Machines',
    description: 'High-precision scales for precious metals and gemstones',
    products: [
      {
        name: 'Citizen CY-220 Jewellery Scale',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop',
        price: '₹12,000 - ₹18,000',
        capacity: '220g × 0.001g',
        description: 'External calibration with draft shield for accurate gold weighing.',
      },
      {
        name: 'AND GX-200 Analytical Balance',
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop',
        price: '₹45,000 - ₹65,000',
        capacity: '210g × 0.0001g',
        description: 'Internal calibration with GLP/GMP compliance for laboratory use.',
      },
      {
        name: 'Contech CA-223 Carat Scale',
        image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&h=300&fit=crop',
        price: '₹28,000 - ₹38,000',
        capacity: '220ct × 0.001ct',
        description: 'Specialized for gemstone weighing with carat mode display.',
      },
      {
        name: 'Shimadzu AUW-220D',
        image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=300&fit=crop',
        price: '₹85,000 - ₹1,20,000',
        capacity: '220g × 0.01mg',
        description: 'Semi-micro balance with UniBloc sensor for ultimate precision.',
      },
      {
        name: 'Sartorius Quintix 224',
        image: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=400&h=300&fit=crop',
        price: '₹1,50,000 - ₹2,00,000',
        capacity: '220g × 0.1mg',
        description: 'Touch screen operation with isoCAL automatic internal calibration.',
      },
    ],
  },
  {
    title: 'Weighbridges',
    description: 'Heavy-duty pit and pitless weighbridges for industrial applications',
    products: [
      {
        name: 'Pit Type Steel Deck Weighbridge',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        price: '₹8,50,000 - ₹15,00,000',
        capacity: '60 Ton - 120 Ton',
        description: 'Flush with ground level, ideal for sites with space constraints.',
      },
      {
        name: 'Pitless RCC Deck Weighbridge',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
        price: '₹6,50,000 - ₹12,00,000',
        capacity: '40 Ton - 100 Ton',
        description: 'Above-ground installation with easy maintenance access.',
      },
      {
        name: 'Mobile Weighbridge System',
        image: 'https://images.unsplash.com/photo-1558618047-f4b511a881d3?w=400&h=300&fit=crop',
        price: '₹12,00,000 - ₹20,00,000',
        capacity: '80 Ton',
        description: 'Portable design for construction sites and temporary installations.',
      },
      {
        name: 'Fully Electronic Weighbridge',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
        price: '₹10,00,000 - ₹18,00,000',
        capacity: '100 Ton',
        description: 'Digital load cells with automated software integration.',
      },
      {
        name: 'Modular Steel Weighbridge',
        image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=300&fit=crop',
        price: '₹7,50,000 - ₹14,00,000',
        capacity: '80 Ton',
        description: 'Pre-fabricated sections for quick installation and relocation.',
      },
    ],
  },
  {
    title: 'Industrial Weighing Machines',
    description: 'Robust platform and floor scales for warehouses and factories',
    products: [
      {
        name: 'Heavy Duty Platform Scale 1T',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
        price: '₹18,000 - ₹28,000',
        capacity: '1000kg × 100g',
        description: 'MS platform with stainless steel load cells for industrial use.',
      },
      {
        name: 'Floor Scale 5 Ton',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
        price: '₹45,000 - ₹65,000',
        capacity: '5000kg × 500g',
        description: 'Low profile design with ramp access for pallet weighing.',
      },
      {
        name: 'Crane Scale 10T',
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
        price: '₹55,000 - ₹85,000',
        capacity: '10000kg × 2kg',
        description: 'Wireless remote display with overload protection.',
      },
      {
        name: 'Pallet Truck Scale',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
        price: '₹75,000 - ₹1,10,000',
        capacity: '2000kg × 500g',
        description: 'Integrated weighing with hydraulic lifting for logistics.',
      },
      {
        name: 'Bench Scale 300kg',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        price: '₹12,000 - ₹18,000',
        capacity: '300kg × 50g',
        description: 'Compact industrial bench scale with RS232 connectivity.',
      },
    ],
  },
];

const Products: React.FC = () => {
  return (
    <div className="relative bg-background text-foreground min-h-screen">
      <NavigationOptimized />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-px bg-primary" />
            <span className="text-mono text-primary text-sm uppercase tracking-widest">
              Product Catalog
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Precision <span className="text-primary">Weighing</span> Solutions
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Explore our comprehensive range of weighing equipment designed for accuracy, 
            durability, and performance across all industries.
          </p>
        </section>

        {/* Product Categories */}
        {productCategories.map((category, categoryIndex) => (
          <section key={categoryIndex} className="px-6 py-12 max-w-7xl mx-auto">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{category.title}</h2>
              <p className="text-muted-foreground">{category.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {category.products.map((product, productIndex) => (
                <div 
                  key={productIndex}
                  className="group bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    <div className="space-y-1 text-xs text-muted-foreground mb-3">
                      <p><span className="text-foreground font-medium">Capacity:</span> {product.capacity}</p>
                      <p><span className="text-foreground font-medium">Price:</span> {product.price}</p>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    <button className="mt-4 w-full py-2 bg-primary/10 text-primary text-xs font-medium rounded hover:bg-primary hover:text-primary-foreground transition-colors">
                      Request Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <Footer />
      <CursorGlow />
    </div>
  );
};

export default Products;
