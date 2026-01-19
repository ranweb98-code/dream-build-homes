import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Users, Award, Phone } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, hasStarted]);

  return { count, ref };
}

export function HeroSection() {
  const stat1 = useCountUp(500, 2000);
  const stat2 = useCountUp(1200, 2500);
  const stat3 = useCountUp(15, 1500);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt="Luxury Property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/70" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-32">
        <div className="max-w-3xl">
          {/* Tagline */}
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            Trusted Real Estate Partners
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
            Premium Properties
            <span className="block mt-2">For Discerning Clients</span>
          </h1>

          <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl leading-relaxed animate-fade-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
            With over 15 years of experience in luxury real estate, we deliver exceptional service and unparalleled expertise to help you find your perfect property.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-10 animate-fade-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
            <Link to="/properties">
              <Button size="lg" className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium">
                View Properties
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="h-12 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-medium">
                <Phone className="h-4 w-4 mr-2" />
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-secondary/50 mt-16 mb-10 animate-fade-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }} />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 animate-fade-up opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
            <div ref={stat1.ref}>
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-secondary" />
                <span className="text-3xl font-bold text-primary-foreground tabular-nums">
                  {stat1.count.toLocaleString()}+
                </span>
              </div>
              <p className="text-sm text-primary-foreground/60 uppercase tracking-wide">Properties Sold</p>
            </div>
            
            <div ref={stat2.ref}>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-secondary" />
                <span className="text-3xl font-bold text-primary-foreground tabular-nums">
                  {stat2.count.toLocaleString()}+
                </span>
              </div>
              <p className="text-sm text-primary-foreground/60 uppercase tracking-wide">Happy Clients</p>
            </div>
            
            <div ref={stat3.ref}>
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-secondary" />
                <span className="text-3xl font-bold text-primary-foreground tabular-nums">
                  {stat3.count}+
                </span>
              </div>
              <p className="text-sm text-primary-foreground/60 uppercase tracking-wide">Years Experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent" />
    </section>
  );
}
