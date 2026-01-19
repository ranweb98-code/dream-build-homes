import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building2, Users, Award, MapPin, Search } from 'lucide-react';
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
      {/* Animated Background with Multiple Layers */}
      <div className="absolute inset-0">
        {/* Main Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-[pulse_20s_ease-in-out_infinite]"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920)',
          }}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-accent/40 rounded-full animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-background/30 rounded-full animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 right-1/5 w-3 h-3 bg-accent/30 rounded-full animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-right">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-background/10 backdrop-blur-sm border border-background/20 rounded-full text-background/90 text-sm mb-6 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
              <MapPin className="h-4 w-4 text-accent" />
              <span>נכסי יוקרה בישראל</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-background leading-tight animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
              מצאו את
              <span className="block text-accent drop-shadow-lg">הבית המושלם</span>
              <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2 font-light">שלכם</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-background/85 max-w-xl mx-auto lg:mx-0 lg:mr-0 animate-fade-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
              חווית מגורים יוקרתית במיטבה. הקולקציה שלנו של נכסי פרימיום מציעה אלגנטיות ותחכום ללא תחרות.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-8 justify-center lg:justify-start animate-fade-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
              <Link to="/properties">
                <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all duration-300 hover:scale-105">
                  <Search className="h-4 w-4" />
                  חפשו נכסים
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="bg-background/10 backdrop-blur-sm border-background/30 text-background hover:bg-background/20 hover:scale-105 transition-all duration-300">
                  צרו קשר
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Stats Cards */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Main Stats Card */}
              <div className="bg-background/10 backdrop-blur-md border border-background/20 rounded-3xl p-8 animate-fade-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-center gap-4 p-4 bg-background/10 rounded-2xl" ref={stat1.ref}>
                    <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                      <Building2 className="h-7 w-7 text-accent" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-background tabular-nums">
                        {stat1.count.toLocaleString()}+
                      </p>
                      <p className="text-sm text-background/70">נכסים נמכרו</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-background/10 rounded-2xl" ref={stat2.ref}>
                    <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                      <Users className="h-7 w-7 text-accent" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-background tabular-nums">
                        {stat2.count.toLocaleString()}+
                      </p>
                      <p className="text-sm text-background/70">לקוחות מרוצים</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-background/10 rounded-2xl" ref={stat3.ref}>
                    <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center">
                      <Award className="h-7 w-7 text-accent" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-background tabular-nums">
                        {stat3.count}+
                      </p>
                      <p className="text-sm text-background/70">שנות ניסיון</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Trust Badge */}
              <div className="absolute -bottom-6 -left-6 bg-accent text-accent-foreground px-6 py-3 rounded-2xl shadow-xl animate-fade-up opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="font-semibold">סוכנות מובילה</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="lg:hidden mt-12">
          <div className="grid grid-cols-3 gap-4 animate-fade-up opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
            <div className="text-center p-4 bg-background/10 backdrop-blur-sm rounded-2xl" ref={stat1.ref}>
              <Building2 className="h-6 w-6 mx-auto text-accent mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-background tabular-nums">
                {stat1.count.toLocaleString()}+
              </p>
              <p className="text-xs text-background/70">נכסים נמכרו</p>
            </div>
            <div className="text-center p-4 bg-background/10 backdrop-blur-sm rounded-2xl" ref={stat2.ref}>
              <Users className="h-6 w-6 mx-auto text-accent mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-background tabular-nums">
                {stat2.count.toLocaleString()}+
              </p>
              <p className="text-xs text-background/70">לקוחות מרוצים</p>
            </div>
            <div className="text-center p-4 bg-background/10 backdrop-blur-sm rounded-2xl" ref={stat3.ref}>
              <Award className="h-6 w-6 mx-auto text-accent mb-2" />
              <p className="text-xl sm:text-2xl font-bold text-background tabular-nums">
                {stat3.count}+
              </p>
              <p className="text-xs text-background/70">שנות ניסיון</p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-background/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-background/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
