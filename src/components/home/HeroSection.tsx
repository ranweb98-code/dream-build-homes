import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Users, Award, Sparkles, Play } from 'lucide-react';
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-muted">
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-primary/30 to-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-secondary/25 to-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-40" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-8 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
              <Sparkles className="h-4 w-4" />
              <span>Premium Real Estate</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
              Find Your
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Dream Home
              </span>
            </h1>

            <p className="mt-8 text-xl text-muted-foreground leading-relaxed max-w-lg animate-fade-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
              Discover exceptional properties that match your lifestyle. From modern apartments to luxurious villas, we bring your vision to life.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-10 animate-fade-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
              <Link to="/properties">
                <Button size="lg" className="h-14 px-8 text-base gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-primary/40">
                  Explore Properties
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base gap-2 border-2 hover:bg-muted/50 transition-all duration-300 hover:scale-105">
                  <Play className="h-4 w-4" />
                  Watch Video
                </Button>
              </Link>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-8 mt-16 animate-fade-up opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-3" ref={stat1.ref}>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{stat1.count.toLocaleString()}+</p>
                  <p className="text-sm text-muted-foreground">Properties</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3" ref={stat2.ref}>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{stat2.count.toLocaleString()}+</p>
                  <p className="text-sm text-muted-foreground">Happy Clients</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3" ref={stat3.ref}>
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold tabular-nums">{stat3.count}+</p>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image Grid */}
          <div className="hidden lg:block relative">
            <div className="relative animate-fade-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
                  alt="Luxury Home"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
              </div>

              {/* Floating Card 1 */}
              <div className="absolute -left-8 top-1/4 bg-card border shadow-xl rounded-2xl p-4 animate-fade-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">New Listing</p>
                    <p className="text-xs text-muted-foreground">Modern Villa</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute -right-4 bottom-1/4 bg-card border shadow-xl rounded-2xl p-4 animate-fade-up opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                    alt="Agent"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm">Expert Agents</p>
                    <p className="text-xs text-muted-foreground">Available 24/7</p>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 -top-4 -right-4 w-full h-full border-2 border-primary/20 rounded-3xl" />
              <div className="absolute -z-10 -bottom-4 -left-4 w-3/4 h-3/4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl blur-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
