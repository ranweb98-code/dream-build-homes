import { Link } from 'react-router-dom';
import { Property } from '@/types/property';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  className?: string;
  onInquire?: (property: Property) => void;
}

export function PropertyCard({ property, className, onInquire }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSize = (size: number) => {
    return new Intl.NumberFormat('en-US').format(size);
  };

  return (
    <div
      className={cn(
        'group bg-card rounded-lg overflow-hidden shadow-sm border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0] || '/placeholder.svg'}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Status Badge */}
        <Badge
          className={cn(
            'absolute top-4 left-4',
            property.status === 'sold'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-success text-success-foreground'
          )}
        >
          {property.status === 'sold' ? 'Sold' : 'For Sale'}
        </Badge>

        {/* Featured Badge */}
        {property.featured && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
            Featured
          </Badge>
        )}

        {/* Price Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/80 to-transparent p-4">
          <p className="text-2xl font-bold text-background">
            {formatPrice(property.price)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <MapPin className="h-4 w-4" />
            {property.city}, {property.area}
          </p>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {property.rooms} Beds
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.baths} Baths
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            {formatSize(property.size)} sqft
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link to={`/properties/${property.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Button
            onClick={(e) => {
              e.preventDefault();
              onInquire?.(property);
            }}
            className="flex-1"
          >
            Inquire
          </Button>
        </div>
      </div>
    </div>
  );
}
