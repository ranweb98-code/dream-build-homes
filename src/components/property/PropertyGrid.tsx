import { Property } from '@/types/property';
import { PropertyCard } from './PropertyCard';
import { cn } from '@/lib/utils';

interface PropertyGridProps {
  properties: Property[];
  className?: string;
  onInquire?: (property: Property) => void;
}

export function PropertyGrid({ properties, className, onInquire }: PropertyGridProps) {
  if (properties.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No properties found.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
        className
      )}
    >
      {properties.map((property, index) => (
        <div
          key={property.id}
          className="animate-fade-up opacity-0"
          style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
        >
          <PropertyCard property={property} onInquire={onInquire} />
        </div>
      ))}
    </div>
  );
}
