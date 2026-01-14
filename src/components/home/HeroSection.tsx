import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Users, Award } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/50" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-20">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-background leading-tight animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            Discover Your
            <span className="block text-accent">Dream Property</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-background/80 max-w-xl animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
            Experience luxury living at its finest. Our curated collection of premium properties offers unparalleled elegance and sophistication.
          </p>

          <div className="flex flex-wrap gap-4 mt-8 animate-fade-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
            <Link to="/properties">
              <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground">
                Browse Properties
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-background/10 border-background/30 text-background hover:bg-background/20">
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 animate-fade-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
            {[
              { icon: Building2, value: '500+', label: 'Properties Sold' },
              { icon: Users, value: '1,200+', label: 'Happy Clients' },
              { icon: Award, value: '15+', label: 'Years Experience' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto text-accent mb-2" />
                <p className="text-2xl sm:text-3xl font-bold text-background">{stat.value}</p>
                <p className="text-sm text-background/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-background/50 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-background/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
