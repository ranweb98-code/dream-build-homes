import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePropertyContext } from '@/contexts/PropertyContext';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { InquiryModal } from '@/components/property/InquiryModal';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';
import { ArrowRight } from 'lucide-react';

export function FeaturedProperties() {
  const { getFeaturedProperties, properties, loading } = usePropertyContext();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const featuredProps = getFeaturedProperties();
  // If no featured properties, show first 3 properties
  const featured = featuredProps.length > 0 ? featuredProps.slice(0, 3) : properties.slice(0, 3);

  const handleInquire = (property: Property) => {
    setSelectedProperty(property);
    setIsInquiryOpen(true);
  };

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Featured Properties
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our handpicked selection of premium properties, chosen for their exceptional quality, location, and investment potential.
          </p>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No featured properties available at the moment.
            </p>
          </div>
        ) : (
          <PropertyGrid properties={featured} onInquire={handleInquire} />
        )}

        {/* CTA */}
        <div className="text-center mt-12 animate-fade-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <Link to="/properties">
            <Button size="lg" variant="outline" className="gap-2">
              View All Properties
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <InquiryModal
        property={selectedProperty}
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </section>
  );
}
