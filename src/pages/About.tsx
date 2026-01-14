import { Layout } from '@/components/layout/Layout';
import { Award, Users, Building2, Heart } from 'lucide-react';

export default function About() {
  return (
    <Layout>
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            <h1 className="font-display text-4xl font-bold mb-4">About Prestige Estates</h1>
            <p className="text-muted-foreground text-lg">
              For over 15 years, we've been helping families find their perfect homes. Our commitment to excellence and personalized service sets us apart in the luxury real estate market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { icon: Building2, value: '500+', label: 'Properties Sold' },
              { icon: Users, value: '1,200+', label: 'Happy Clients' },
              { icon: Award, value: '15+', label: 'Years Experience' },
              { icon: Heart, value: '98%', label: 'Client Satisfaction' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-card rounded-lg border animate-fade-up opacity-0" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}>
                <stat.icon className="h-10 w-10 mx-auto text-primary mb-3" />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-lg max-w-3xl mx-auto text-muted-foreground">
            <p>At Prestige Estates, we believe that finding the right property is about more than just square footage and amenities—it's about finding a place where you can build your future.</p>
            <p>Our team of dedicated professionals brings together decades of combined experience in luxury real estate, ensuring that every client receives the personalized attention they deserve.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
