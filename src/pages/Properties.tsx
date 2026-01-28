import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { usePropertyContext } from '@/contexts/PropertyContext';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { InquiryModal } from '@/components/property/InquiryModal';
import { Property } from '@/types/property';
import { Loader2 } from 'lucide-react';

export default function Properties() {
  const { properties, loading } = usePropertyContext();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInquire = (property: Property) => {
    setSelectedProperty(property);
    setIsInquiryOpen(true);
  };

  return (
    <Layout>
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <h1 className="font-display text-4xl font-bold mb-4">Our Properties</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our complete collection of premium properties available for purchase.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No properties available at the moment.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Please check back soon for new listings.
              </p>
            </div>
          ) : (
            <PropertyGrid properties={properties} onInquire={handleInquire} />
          )}
        </div>
      </div>

      <InquiryModal
        property={selectedProperty}
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </Layout>
  );
}
