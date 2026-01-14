import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Users, Award } from 'lucide-react';
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
      
      // Easing function for smooth animation
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

          {/* Stats with counting animation */}
          <div className="grid grid-cols-3 gap-6 mt-16 animate-fade-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
            <div className="text-center" ref={stat1.ref}>
              <Building2 className="h-8 w-8 mx-auto text-accent mb-2" />
              <p className="text-2xl sm:text-3xl font-bold text-background tabular-nums">
                {stat1.count.toLocaleString()}+
              </p>
              <p className="text-sm text-background/70">Properties Sold</p>
            </div>
            <div className="text-center" ref={stat2.ref}>
              <Users className="h-8 w-8 mx-auto text-accent mb-2" />
              <p className="text-2xl sm:text-3xl font-bold text-background tabular-nums">
                {stat2.count.toLocaleString()}+
              </p>
              <p className="text-sm text-background/70">Happy Clients</p>
            </div>
            <div className="text-center" ref={stat3.ref}>
              <Award className="h-8 w-8 mx-auto text-accent mb-2" />
              <p className="text-2xl sm:text-3xl font-bold text-background tabular-nums">
                {stat3.count}+
              </p>
              <p className="text-sm text-background/70">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
