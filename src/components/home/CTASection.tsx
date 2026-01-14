import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Our team of experienced real estate professionals is here to guide you through every step of your property journey. Let us help you make your dream a reality.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Phone className="h-4 w-4" />
                Schedule a Consultation
              </Button>
            </Link>
            <Link to="/properties">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
