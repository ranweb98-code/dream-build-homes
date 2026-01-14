import { Shield, Clock, Award, Heart } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Trusted Experience',
    description: 'Over 15 years of excellence in luxury real estate with a proven track record of satisfied clients.',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Our dedicated team is always available to answer your questions and provide assistance.',
  },
  {
    icon: Award,
    title: 'Premium Selection',
    description: 'Access to exclusive listings and off-market properties that you won\'t find anywhere else.',
  },
  {
    icon: Heart,
    title: 'Personalized Service',
    description: 'We take the time to understand your unique needs and find the perfect property for you.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Why Choose Prestige Estates?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to providing exceptional service and helping you find the property of your dreams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-lg bg-card border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
