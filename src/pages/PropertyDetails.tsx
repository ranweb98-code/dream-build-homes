import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { usePropertyContext } from '@/contexts/PropertyContext';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { InquiryModal } from '@/components/property/InquiryModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Maximize, MapPin, ArrowLeft, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const { getPropertyById, loading } = usePropertyContext();
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const property = getPropertyById(String(id));

  if (loading) {
    return (
      <Layout>
        <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="pt-28 pb-20 min-h-screen">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/properties">
              <Button className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Properties
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  return (
    <Layout>
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <Link to="/properties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
              <PropertyGallery images={property.images} title={property.title} />
            </div>

            <div className="space-y-6 animate-fade-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={cn(property.status === 'sold' ? 'bg-destructive' : 'bg-success')}>
                    {property.status === 'sold' ? 'Sold' : 'For Sale'}
                  </Badge>
                  {property.featured && <Badge variant="secondary">Featured</Badge>}
                </div>
                <h1 className="font-display text-3xl font-bold">{property.title}</h1>
                <p className="flex items-center gap-1 text-muted-foreground mt-2">
                  <MapPin className="h-4 w-4" />
                  {property.city}, {property.area}
                </p>
              </div>

              <p className="text-4xl font-bold text-primary">{formatPrice(property.price)}</p>

              <div className="flex gap-6 py-4 border-y">
                <div className="flex items-center gap-2"><Bed className="h-5 w-5 text-muted-foreground" /><span>{property.rooms} Bedrooms</span></div>
                <div className="flex items-center gap-2"><Bath className="h-5 w-5 text-muted-foreground" /><span>{property.baths} Bathrooms</span></div>
                <div className="flex items-center gap-2"><Maximize className="h-5 w-5 text-muted-foreground" /><span>{property.size.toLocaleString()} sqft</span></div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>

              <Button size="lg" className="w-full gap-2" onClick={() => setIsInquiryOpen(true)}>
                <Phone className="h-4 w-4" />
                Inquire About This Property
              </Button>
            </div>
          </div>
        </div>
      </div>

      <InquiryModal property={property} isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} />
    </Layout>
  );
}
